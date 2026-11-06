import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

interface PlanVote {
  id: number;
  title: string;
  vote_count: number;
  is_winner?: boolean;
}

export default function VoteRanking() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanVote[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toLocaleDateString("sv-SE");
  const [groupDeadline, setGroupDeadline] = useState<string>("");
  const location = useLocation();
  const winningPlanFromState = (location.state as { winningPlan?: PlanVote })
    ?.winningPlan;

  // 💡 APIからの作成者判定フラグを保持するState
  const [isOwner, setIsOwner] = useState(false);

  // 💡 締め切り判定
  // const isBeforeDeadline = groupDeadline
  //   ? groupDeadline.substring(0, 10) > todayStr
  //   : false;

  // テスト用
  const isBeforeDeadline = false;

  useEffect(() => {
    if (!groupId) return;

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/groups/${groupId}`,
          {
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              client: localStorage.getItem("client") || "",
              uid: localStorage.getItem("uid") || "",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setGroupName(data.name || "");
          setGroupDeadline(data.deadline || "");

          // 💡 Rails側で判定された is_owner フラグを取得
          setIsOwner(Boolean(data.is_owner));

          let sortedPlans = (data.plans || [])
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              vote_count: p.vote_count || 0,
              is_winner: p.is_winner || false,
            }))
            .sort((a: any, b: any) => {
              if (a.is_winner) return -1;
              if (b.is_winner) return 1;
              return b.vote_count - a.vote_count;
            });

          if (winningPlanFromState) {
            sortedPlans = sortedPlans.sort((a: any, b: any) => {
              if (a.id === winningPlanFromState.id) return -1;
              if (b.id === winningPlanFromState.id) return 1;
              return b.vote_count - a.vote_count;
            });
          }

          setPlans(sortedPlans);
        }
      } catch (error) {
        console.error("結果の取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [groupId]);

  useEffect(() => {
    if (!loading && !isBeforeDeadline && plans.length > 0) {
      const timer = setTimeout(() => {
        triggerLuxuryConfetti();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, isBeforeDeadline, plans]);

  const triggerLuxuryConfetti = () => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors: ["#FFD700", "#FFA500", "#FF4500", "#DF0024", "#00A86B"],
    });
  };

  // ==========================================
  // 🎲 同票（引き分け）の判定ロジック
  // ==========================================
  const maxVotes = plans.length > 0 ? plans[0].vote_count : 0;
  const topPlans = plans.filter(
    (p) => p.vote_count === maxVotes && maxVotes > 0,
  );
  const isTied = topPlans.length > 1; // 1位が2つ以上あれば同票！

  if (loading) return <div className="p-6 text-gray-500">結果を集計中...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <style>{`
        @keyframes goldGlow {
          0% { text-shadow: 0 0 4px #fff, 0 0 10px #ffd700, 0 0 20px #ff8c00; }
          50% { text-shadow: 0 0 10px #fff, 0 0 25px #ffea00, 0 0 40px #ff4500; }
          100% { text-shadow: 0 0 4px #fff, 0 0 10px #ffd700, 0 0 20px #ff8c00; }
        }
        .gold-glow-text {
          animation: goldGlow 2s infinite ease-in-out;
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-2">🏆 投票結果発表</h1>
      <p className="text-gray-500 mb-6">
        {groupName ? `${groupName} の最終ランキング` : ""}
      </p>

      {/* 🎲 同票のときに目立つアラートを表示する場合（すでに抽選が終わっていなければ表示） */}
      {!isBeforeDeadline && isTied && !plans.some((p) => p.is_winner) && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl text-center shadow-sm">
          <p className="text-amber-900 font-bold text-base mb-1">
            ⚠️ 1位が複数あります（同票数: {maxVotes} 票）
          </p>
          <p className="text-xs text-amber-700">
            下記のボタンから抽選を行って勝者を決定してください！
          </p>
        </div>
      )}

      <div className="space-y-4">
        {isBeforeDeadline ? (
          <div className="p-6 bg-yellow-50 text-yellow-700 rounded-xl font-medium border border-yellow-200 text-center shadow-sm">
            <p className="text-lg font-bold mb-2">⚠️ まだ投票締め切り前です</p>
            <p className="text-sm text-yellow-600">
              投票が終了するまで結果は見られません。
            </p>
          </div>
        ) : plans.length === 0 ? (
          <p className="text-gray-500 text-center">投票データがありません</p>
        ) : (
          (() => {
            // 💡 票数に基づいた正しい順位計算
            let currentRank = 1;

            return plans.map((plan, index, arr) => {
              if (index > 0) {
                if (plan.vote_count < arr[index - 1].vote_count) {
                  currentRank = index + 1;
                }
              }

              const isWinner =
                plan.is_winner || (currentRank === 1 && plan.vote_count > 0);

              const getRankBadge = (
                plan: PlanVote,
                rank: number,
                voteCount: number,
              ) => {
                if (plan.is_winner) return "🎉 当選！";
                if (voteCount === 0) return "圏外";
                if (rank === 1) return "🥇 1位";
                if (rank === 2) return "🥈 2位";
                if (rank === 3) return "🥉 3位";
                return `${rank}位`;
              };

              return (
                <div
                  key={plan.id}
                  className={`mb-5 p-4 rounded-xl shadow-sm border flex justify-between items-center transition-all ${
                    plan.is_winner
                      ? "bg-amber-100 border-amber-400 ring-4 ring-amber-200"
                      : isWinner
                        ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200"
                        : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm ${
                        plan.is_winner
                          ? "bg-amber-500 text-white text-base animate-pulse"
                          : isWinner
                            ? "text-amber-800 bg-amber-100"
                            : "text-gray-500 bg-gray-100"
                      }`}
                    >
                      {getRankBadge(plan, currentRank, plan.vote_count)}
                    </span>
                    <h2
                      className={`text-lg font-semibold ${
                        plan.is_winner
                          ? "text-amber-950 font-bold gold-glow-text text-xl"
                          : isWinner
                            ? "text-amber-950 font-bold gold-glow-text"
                            : "text-gray-800"
                      }`}
                    >
                      {plan.title}
                    </h2>
                  </div>
                  <span
                    className={`font-bold px-3 py-1 rounded-full text-sm ${
                      isWinner
                        ? "bg-amber-200 text-amber-900"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {plan.vote_count} 票
                  </span>
                </div>
              );
            });
          })()
        )}
      </div>

      {/* 💡 締め切り後 ＆ 投票データあり ＆ グループ作成者（isOwner）の場合のみ表示 */}
      {!isBeforeDeadline && plans.length > 0 && isOwner && (
        <div className="mt-10">
          {(() => {
            const winnerPlan = plans.find((p) => p.is_winner);

            if (winnerPlan) {
              // ⭕️ すでに抽選等で勝者が決まっている場合は「スケジュール確定」を表示
              return (
                <Link
                  to={`/groups/${groupId}/schedule`}
                  className="block w-full bg-yellow-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-md text-center"
                  state={{ plan: winnerPlan }}
                >
                  🗓️ スケジュール確定
                </Link>
              );
            } else if (isTied) {
              // 🎲 同票かつまだ勝者が決まっていない場合は「抽選ボタン」を表示
              return (
                <Link
                  to={`/groups/${groupId}/vote/random`}
                  className="block w-full bg-amber-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-md text-center"
                >
                  🎲 抽選してランキングを決定する
                </Link>
              );
            } else {
              // 通常（単独1位でまだ未確定）のとき
              return (
                <Link
                  to={`/groups/${groupId}/schedule`}
                  className="block w-full bg-yellow-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-md text-center"
                  state={{ plan: plans[0] }}
                >
                  🗓️ スケジュール確定
                </Link>
              );
            }
          })()}
        </div>
      )}

      <Link
        to={`/groups/${groupId}/plans`}
        className="mt-6 block w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors shadow-sm font-medium text-center"
      >
        プラン候補一覧に戻る
      </Link>
    </div>
  );
}
