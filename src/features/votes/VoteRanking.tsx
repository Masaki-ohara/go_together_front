// // // import React from 'react'

// // // export default function VoteRanking() {
// // //   return (
// // //     <div>
// // //       <h1 className='text-2xl font-bold mb-4'>投票結果</h1>
// // //       <p>1ちいちい</p>
// // //     </div>
// // //   )
// // // }

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import confetti from "canvas-confetti";

// interface PlanVote {
//   id: number;
//   title: string;
//   vote_count: number;
// }

// export default function VoteRanking() {
//   const { groupId } = useParams();
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState<PlanVote[]>([]);
//   const [groupName, setGroupName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const todayStr = new Date().toLocaleDateString("sv-SE");
//   const [groupDeadline, setGroupDeadline] = useState<string>("");

//   useEffect(() => {
//     if (!groupId) return;

//     const fetchResults = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/api/v1/groups/${groupId}`,
//           {
//             headers: {
//               "access-token": localStorage.getItem("access-token") || "",
//               client: localStorage.getItem("client") || "",
//               uid: localStorage.getItem("uid") || "",
//             },
//           },
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setGroupName(data.name || "");
//           setGroupDeadline(data.deadline || "");

//           // 💡 届いたデータを最初から「投票数が多い順（降順）」に並び替えてStateに入れる
//           const sortedPlans = (data.plans || [])
//             .map((p: any) => ({
//               id: p.id,
//               title: p.title,
//               vote_count: p.vote_count || 0,
//             }))
//             .sort((a: any, b: any) => b.vote_count - a.vote_count);

//           setPlans(sortedPlans);
//           // 🎉 【追加：ド派手エフェクトの自動発火】
//           // 締め切りを過ぎていて、かつ投票データがある場合に紙吹雪をドカンと鳴らす！
//           const isExpired = data.deadline
//             ? data.deadline.substring(0, 10) <= todayStr
//             : false;
//           if (isExpired && sortedPlans.length > 0) {
//             triggerLuxuryConfetti();
//           }
//         }
//       } catch (error) {
//         console.error("結果の取得に失敗しました", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [groupId]);

//   // 🎆 左右から時間差で200発の紙吹雪を中央に打ち上げる演出関数
//   const triggerLuxuryConfetti = () => {
//     // 左側からのキャノン
//     confetti({
//       particleCount: 100,
//       angle: 60,
//       spread: 70,
//       origin: { x: 0, y: 0.8 },
//       colors: ["#FFD700", "#FFA500", "#FF4500", "#DF0024", "#00A86B"],
//     });
//     // 右側からのキャノン（少しだけ遅らせる）
//     setTimeout(() => {
//       confetti({
//         particleCount: 100,
//         angle: 120,
//         spread: 70,
//         origin: { x: 1, y: 0.8 },
//         colors: ["#FFD700", "#FFA500", "#FF4500", "#007FFF", "#8A2BE2"],
//       });
//     }, 150);
//   };

//   const isBeforeDeadline = groupDeadline
//     ? groupDeadline.substring(0, 10) > todayStr
//     : false;

//   if (loading) return <div className="p-6 text-gray-500">結果を集計中...</div>;

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <style>{`
//         @keyframes goldGlow {
//           0% { text-shadow: 0 0 4px #fff, 0 0 10px #ffd700, 0 0 20px #ff8c00; }
//           50% { text-shadow: 0 0 10px #fff, 0 0 25px #ffea00, 0 0 40px #ff4500; }
//           100% { text-shadow: 0 0 4px #fff, 0 0 10px #ffd700, 0 0 20px #ff8c00; }
//         }
//         .gold-glow-text {
//           animation: goldGlow 2s infinite ease-in-out;
//         }
//       `}</style>
//       <h1 className="text-2xl font-bold mb-2">🏆 投票結果発表</h1>
//       <p className="text-gray-500 mb-6">
//         {groupName ? `${groupName} の最終ランキング` : ""}
//       </p>

//       <div className="space-y-4">
//         {/* {isBeforeDeadline  ? (
//           <h1 className="p-3 bg-yellow-50 text-yellow-700 rounded-lg font-medium border border-yellow-200 text-center">
//             ⚠️ まだ投票締め切り前です
//           </h1>
//         ) : null}
//         {plans.length === 0 ? (
//           <p className="text-gray-500 text-center">投票データがありません</p>
//         ) : ( */}
//         {isBeforeDeadline ? (
//           // パターンA: 締め切り前の時はこのメッセージだけを出す（リストは隠す）
//           <div className="p-6 bg-yellow-50 text-yellow-700 rounded-xl font-medium border border-yellow-200 text-center shadow-sm">
//             <p className="text-lg font-bold mb-2">⚠️ まだ投票締め切り前です</p>
//             <p className="text-sm text-yellow-600">
//               投票が終了するまで結果は見られません。
//             </p>
//           </div>
//         ) : plans.length === 0 ? (
//           // パターンB: 締め切りを過ぎているが、投票がない時
//           <p className="text-gray-500 text-center">投票データがありません</p>
//         ) : (
//           plans.map((plan, index) => {
//             // 💡 1位、2位、3位、それ以外でデザインや絵文字を変える
//             const isFirst = index === 0 && plan.vote_count > 0;
//             const getRankBadge = (rank: number) => {
//               if (rank === 0 && plan.vote_count > 0) return "🥇 1位";
//               if (rank === 1 && plan.vote_count > 0) return "🥈 2位";
//               if (rank === 2 && plan.vote_count > 0) return "🥉 3位";
//               return `${rank + 1}位`;
//             };

//             return (
//               <div
//                 key={plan.id}
//                 className={`p-4 rounded-xl shadow-sm border flex justify-between items-center transition-all ${
//                   isFirst
//                     ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200"
//                     : "bg-white border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <span
//                     className={`font-bold px-2.5 py-1 rounded-md text-sm ${
//                       isFirst
//                         ? "text-amber-800 bg-amber-100"
//                         : "text-gray-500 bg-gray-100"
//                     }`}
//                   >
//                     {getRankBadge(index)}
//                   </span>
//                   <h2
//                     className={`text-lg font-semibold ${
//                       isFirst
//                         ? "text-amber-950 font-bold gold-glow-text"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     {plan.title}
//                   </h2>
//                 </div>
//                 <span
//                   className={`font-bold px-3 py-1 rounded-full text-sm ${
//                     isFirst
//                       ? "bg-amber-200 text-amber-900"
//                       : "bg-blue-50 text-blue-600"
//                   }`}
//                 >
//                   {plan.vote_count} 票
//                 </span>
//               </div>
//             );
//           })
//         )}
//       </div>

//       <button
//         onClick={() => navigate(-1)}
//         className="mt-6 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors shadow-sm font-medium"
//       >
//         前の画面に戻る
//       </button>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import confetti from "canvas-confetti";

interface PlanVote {
  id: number;
  title: string;
  vote_count: number;
}

export default function VoteRanking() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanVote[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toLocaleDateString("sv-SE");
  const [groupDeadline, setGroupDeadline] = useState<string>("");

  // 💡 締め切り判定
  const isBeforeDeadline = groupDeadline
    ? groupDeadline.substring(0, 10) > todayStr
    : false;

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

          // 届いたデータを最初から「投票数が多い順（降順）」に並び替えてStateに入れる
          const sortedPlans = (data.plans || [])
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              vote_count: p.vote_count || 0,
            }))
            .sort((a: any, b: any) => b.vote_count - a.vote_count);

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

  // 💡 【新設】紙吹雪を100%確実に自動発火させる専用のトリガー
  useEffect(() => {
    // 読み込みが終わり、締め切りを過ぎていて、かつプラン（ランキング）が存在するときに発火
    if (!loading && !isBeforeDeadline && plans.length > 0) {
      // 画面の描画が一瞬遅れても大丈夫なように、100ミリ秒だけ待ってから確実に打ち上げる
      const timer = setTimeout(() => {
        triggerLuxuryConfetti();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, isBeforeDeadline, plans]);

  // 🎆 左右から時間差で200発の紙吹雪を中央に打ち上げる演出関数
  const triggerLuxuryConfetti = () => {
    // 左側からのキャノン
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors: ["#FFD700", "#FFA500", "#FF4500", "#DF0024", "#00A86B"],
    });
    // 右側からのキャノン（少しだけ遅らせる）
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.8 },
        colors: ["#FFD700", "#FFA500", "#FF4500", "#007FFF", "#8A2BE2"],
      });
    }, 150);
  };

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

      <div className="space-y-4">
        {isBeforeDeadline ? (
          // パターンA: 締め切り前の時はこのメッセージだけを出す（リストは隠す）
          <div className="p-6 bg-yellow-50 text-yellow-700 rounded-xl font-medium border border-yellow-200 text-center shadow-sm">
            <p className="text-lg font-bold mb-2">⚠️ まだ投票締め切り前です</p>
            <p className="text-sm text-yellow-600">
              投票が終了するまで結果は見られません。
            </p>
          </div>
        ) : plans.length === 0 ? (
          // パターンB: 締め切りを過ぎているが、投票がない時
          <p className="text-gray-500 text-center">投票データがありません</p>
        ) : (
          plans.map((plan, index) => {
            const isFirst = index === 0 && plan.vote_count > 0;
            const getRankBadge = (rank: number) => {
              if (rank === 0 && plan.vote_count > 0) return "🥇 1位";
              if (rank === 1 && plan.vote_count > 0) return "🥈 2位";
              if (rank === 2 && plan.vote_count > 0) return "🥉 3位";
              return `${rank + 1}位`;
            };

            return (
              <div
                key={plan.id}
                className={`mb-5 p-4 rounded-xl shadow-sm border flex justify-between items-center transition-all ${
                  isFirst
                    ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold px-2.5 py-1 rounded-md text-sm ${
                      isFirst
                        ? "text-amber-800 bg-amber-100"
                        : "text-gray-500 bg-gray-100"
                    }`}
                  >
                    {getRankBadge(index)}
                  </span>
                  <h2
                    className={`text-lg font-semibold ${
                      isFirst
                        ? "text-amber-950 font-bold gold-glow-text"
                        : "text-gray-800"
                    }`}
                  >
                    {plan.title}
                  </h2>
                </div>
                <span
                  className={`font-bold px-3 py-1 rounded-full text-sm ${
                    isFirst
                      ? "bg-amber-200 text-amber-900"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {plan.vote_count} 票
                </span>
              </div>
            );
          })
        )}
      </div>

      <Link
        to={`/groups/${groupId}/schedule`}
        className="inline-block mt-10 bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition-colors shadow text-center"
        state={{ plan: plans[0] }}
      >
        🗓️スケジュール確定
      </Link>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors shadow-sm font-medium"
      >
        前の画面に戻る
      </button>
    </div>
  );
}
