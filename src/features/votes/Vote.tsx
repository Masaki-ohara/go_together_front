// // import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";

// // 💡 TypeScript用の型定義（Railsから返ってくるデータの形に合わせる）
// interface PlanVote {
//   id: number;
//   title: string; // plan_title より title の方がRailsと合わせやすいです
//   vote_count: number;
// }

// export default function Vote() {
//   const { groupId } = useParams();
//   const [plans, setPlans] = useState<PlanVote[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [voteCount, setVoteCount] = useState<number>(0); // 投票数を管理する状態
//   const handleClick = () => {
//     setVoteCount(voteCount + 1);
//   };

//   useEffect(() => {
//     // groupId が取れない時は処理しない
//     if (!groupId) return;

//     const fetchVotePlans = async () => {
//       try {
//         // 💡 以前作った、グループ詳細（plansやusersが含まれる）のAPIを叩く
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
//           // 💡 Railsの show アクションが返すデータの中から「plans」を抽出してセット
//           // 現状、まだ投票数がRails側になければデフォルトで 0 にしておきます
//           const formattedPlans = (data.plans || []).map((p: any) => ({
//             id: p.id,
//             title: p.title || p.name, // カラム名が name か title に合わせて調整
//             vote_count: p.vote_count || 0, // あとでRails側で計算させる
//           }));

//           setPlans(formattedPlans);
//         }
//       } catch (error) {
//         console.error("投票データの取得に失敗しました", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVotePlans();
//   }, [groupId]);

//   if (loading) {
//     return <div className="p-6 text-gray-500">投票データを読み込み中...</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">投票対象一覧</h1>
//       <p className="text-gray-600 mb-4">
//         ここに投票対象のリストが表示されます。
//       </p>

//       <div className="space-y-4">
//         {/* 💡 ( ) ではなく { } で囲み、アロー関数を => に修正しました */}
//         {plans.map((plan) => (
//           <div key={plan.id} className="p-4 bg-white shadow rounded border">
//             <h2 className="text-lg font-semibold">{plan.title}</h2>
//             <p className="text-sm text-gray-500">投票数: {plan.vote_count}</p>
//             <button
//               className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//               onClick={handleClick}
//             >
//               {voteCount > 0 && <span className="mr-2">{voteCount}</span>}
//               投票する
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";

// interface PlanVote {
//   id: number;
//   title: string;
//   vote_count: number;
// }

// export default function Vote() {
//   const { groupId } = useParams();
//   const [plans, setPlans] = useState<PlanVote[]>([]);
//   const [loading, setLoading] = useState(true);

//   // 🗑️ 【削除】共通の voteCount ステートは不要なので消しました

//   // 🎯 【修正】クリックされたプランのIDだけを狙い撃ちしてカウントを増やす関数
//   const handleVote = (planId: number) => {
//     setPlans((prevPlans) =>
//       prevPlans.map((plan) =>
//         plan.id === planId
//           ? { ...plan, vote_count: plan.vote_count + 1 } // IDが一致したプランだけ +1
//           : plan,
//       ),
//     );

//     // 💡 最終的にはここに「RailsのAPI（POST /api/v1/votes）を叩く処理」を後から追加します！
//     const handleVote = async (planId: number) => {
//     try {
//       // 📡 Railsの作成したばかりの create アクションへPOSTリクエストを送る
//       const response = await fetch(
//         `http://localhost:3000/api/v1/groups/${groupId}/plans/${planId}/vote`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "access-token": localStorage.getItem("access-token") || "",
//             client: localStorage.getItem("client") || "",
//             uid: localStorage.getItem("uid") || "",
//           },
//         }
//       );
//   };

//   useEffect(() => {
//     if (!groupId) return;

//     const fetchVotePlans = async () => {
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
//           const formattedPlans = (data.plans || []).map((p: any) => ({
//             id: p.id,
//             title: p.title || p.name,
//             vote_count: p.vote_count || 0,
//           }));

//           setPlans(formattedPlans);
//         }
//       } catch (error) {
//         console.error("投票データの取得に失敗しました", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVotePlans();
//   }, [groupId]);

//   if (loading) {
//     return <div className="p-6 text-gray-500">投票データを読み込み中...</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">投票対象一覧</h1>
//       <p className="text-gray-600 mb-4">
//         ここに投票対象のリストが表示されます。
//       </p>

//       <div className="space-y-4">
//         {plans.map((plan) => (
//           <div
//             key={plan.id}
//             className="p-4 bg-white shadow rounded border flex justify-between items-center"
//           >
//             <div>
//               <h2 className="text-lg font-semibold">{plan.title}</h2>
//               {/* 💡 Railsから取得した、そのプラン単体の投票数を表示する */}
//               <p className="text-sm text-gray-500">投票数: {plan.vote_count}</p>
//             </div>

//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//               // 💡 引数に plan.id を渡して、どのプランを押したか判別させる
//               onClick={() => handleVote(plan.id)}
//             >
//               <span className="mr-2">
//                 {plan.vote_count > 0 ? plan.vote_count : ""}
//               </span>
//               👍 投票する
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface PlanVote {
  id: number;
  title: string;
  vote_count: number;
  voted_by_current_user: boolean; // 💡 自分がすでに投票しているかのフラグ（オマケ）
}

export default function Vote() {
  const { groupId } = useParams();
  const [plans, setPlans] = useState<PlanVote[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎯 RailsのAPIを叩いて投票する関数
  const handleVote = async (planId: number) => {
    try {
      // 📡 Railsの作成したばかりの create アクションへPOSTリクエストを送る
      const response = await fetch(
        `http://localhost:3000/api/v1/plans/${planId}/votes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        },
      );

      if (response.ok) {
        // 💾 Rails側の保存が成功したら、フロント側の表示も+1する
        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan.id === planId
              ? {
                  ...plan,
                  vote_count: plan.vote_count + 1,
                  voted_by_current_user: true,
                }
              : plan,
          ),
        );
      } else {
        const errorData = await response.json();
        alert(
          errorData.errors ? errorData.errors.join(", ") : "投票に失敗しました",
        );
      }
    } catch (error) {
      console.error("投票通信エラー:", error);
    }
  };

  useEffect(() => {
    if (!groupId) return;

    const fetchVotePlans = async () => {
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
          const formattedPlans = (data.plans || []).map((p: any) => ({
            id: p.id,
            title: p.title || p.name,
            // 💡 あとでRails側のシリアライザー（JSONを返す部分）で、
            // votes_count などのキー名で集計した数字を返せるように調整します
            vote_count: p.vote_count || 0,
            voted_by_current_user: p.voted_by_current_user || false,
          }));

          setPlans(formattedPlans);
        }
      } catch (error) {
        console.error("投票データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotePlans();
  }, [groupId]);

  if (loading) {
    return <div className="p-6 text-gray-500">投票データを読み込み中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">投票対象一覧</h1>
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-4 bg-white shadow rounded border flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{plan.title}</h2>
              <p className="text-sm text-gray-500">投票数: {plan.vote_count}</p>
            </div>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => handleVote(plan.id)}
            >
              👍 投票する
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
