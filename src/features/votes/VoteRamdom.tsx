// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// export default function VoteRandom() {
//   const { groupId } = useParams<{ groupId: string }>();

//   useEffect(() => {
//     if (!groupId) return;

//     fetch(`http://localhost:3000/api/v1/groups/${groupId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "access-token": localStorage.getItem("access-token") || "",
//         client: localStorage.getItem("client") || "",
//         uid: localStorage.getItem("uid") || "",
//       },
//     });５
//   }, []);
//   return (
//     <div>
//       <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
//         同票数のため抽選中
//       </h1>
//       <p>This is a simple random vote component.</p>

//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Plan {
  id: number;
  title: string;
  vote_count: number;
}

export default function VoteRandom() {
  const { groupId } = useParams<{ groupId: string }>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayPlanName, setDisplayPlanName] = useState<string>("❓");
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const navigate = useNavigate();

  // 1. グループデータ（同票プラン）の取得
  useEffect(() => {
    if (!groupId) return;

    fetch(`http://localhost:3000/api/v1/groups/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const rawPlans = data.plans || [];
        const formattedPlans = rawPlans.map((p: any) => ({
          id: p.id,
          title: p.title || p.name,
          vote_count: p.vote_count || p.votes,
        }));

        // 最高票数を獲得しているプラン（同票のグループ）だけを抽出する
        const maxVotes =
          formattedPlans.length > 0
            ? Math.max(...formattedPlans.map((p: Plan) => p.vote_count))
            : 0;
        const tiedPlans = formattedPlans.filter(
          (p: Plan) => p.vote_count === maxVotes,
        );

        setPlans(tiedPlans);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [groupId]);

  // 2. スロット風の抽選演出
  useEffect(() => {
    if (loading || plans.length === 0) return;

    // 高速で文字を切り替える
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * plans.length);
      setDisplayPlanName(plans[randomIndex].title);
    }, 60);

    // 3.5秒後にストップして勝者を決定
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);

      // ランダムに1つ当選者を決める
      const finalWinner = plans[Math.floor(Math.random() * plans.length)];
      setDisplayPlanName(finalWinner.title);

      // 💡 1. データベースに勝者を保存するAPIを叩く
      fetch(
        `http://localhost:3000/api/v1/plans/${finalWinner.id}/select_winner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
          body: JSON.stringify({ plan_id: finalWinner.id }),
        },
      )
        .then((res) => {
          if (!res.ok) {
            console.error("勝者の保存に失敗しました");
          }
        })
        .catch((err) => {
          console.error("通信エラー:", err);
        });

      // 2.5秒後にランキング画面へ戻る
      const returnTimer = setTimeout(() => {
        navigate(`/groups/${groupId}/vote/ranking`, {
          state: { winningPlan: finalWinner },
        });
      }, 2500);

      return () => clearTimeout(returnTimer);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading, plans, groupId, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        データを読み込み中...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6 text-gray-900">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl border border-gray-100 text-center">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 animate-pulse">
            決選投票・自動抽選
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            同票数のため抽選中
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            複数のプランが同じ票数（{plans[0]?.vote_count}
            票）で並んだため、システムが自動抽選しています。
          </p>
        </div>

        {/* 抽選対象のプラン一覧 */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {plans.map((plan) => (
            <span
              key={plan.id}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200"
            >
              📋 {plan.title}
            </span>
          ))}
        </div>

        {/* スロット演出のボックス */}
        <div
          className={`relative flex h-48 w-full items-center justify-center rounded-xl bg-slate-900 px-6 border-4 transition-all duration-500 ${
            isSpinning
              ? "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.2)]"
              : "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-900 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900 to-transparent"></div>

          <div
            className={`text-xl font-bold md:text-2xl transition-all duration-300 ${
              isSpinning
                ? "text-amber-400 animate-[pulse_0.1s_infinite]"
                : "text-emerald-400 text-2xl md:text-3xl scale-105"
            }`}
          >
            {isSpinning ? `🎰 ${displayPlanName}` : `🎉 ${displayPlanName}`}
          </div>
        </div>

        <div className="mt-8">
          {isSpinning ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-full bg-amber-500 animate-[loading_3.5s_linear_infinite] origin-left"></div>
              </div>
              <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                Selecting Winner...
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-emerald-600">
                当選プランが決定しました！ランキング画面へ戻ります...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
