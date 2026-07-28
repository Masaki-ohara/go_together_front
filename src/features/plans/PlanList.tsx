// // import { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import { useParams } from "react-router-dom";
// // import { useNavigate } from "react-router-dom";
// // import { saveAuthHeaders } from "../../utils/auth";

// // export default function PlanList() {
// //   const [plans, setPlans] = useState<Plan[]>([]);
// //   const { groupIdz } = useParams();

// //   // useEffect(() => {
// //   //   fetch(`http://localhost:3000/api/v1/groups/${groupId}/plans`, {
// //   //     headers: {
// //   //       "access-token": localStorage.getItem("access-token") ?? "",
// //   //       client: localStorage.getItem("client") ?? "",
// //   //       uid: localStorage.getItem("uid") ?? "",
// //   //     },
// //   //   })
// //   //     .then((response) => {
// //   //       saveAuthHeaders(response);
// //   //       return response.json();
// //   //     })
// //   //     .then((data) => {
// //   //       setPlans(data);
// //   //     });
// //   // }, [groupId]);
// //   useEffect(() => {
// //     const fetchPlans = async () => {
// //       try {
// //         const res = await fetch(
// //           `http://localhost:3000/api/v1/groups/${groupId}/plans`,
// //           {
// //             headers: {
// //               "access-token": localStorage.getItem("access-token") ?? "",
// //               client: localStorage.getItem("client") ?? "",
// //               uid: localStorage.getItem("uid") ?? "",
// //             },
// //           },
// //         );

// //         // ヘッダーを先に保存
// //         saveAuthHeaders(res);

// //         const data = await res.json();

// //         if (Array.isArray(data)) {
// //           setPlans(data);
// //         } else {
// //           setPlans([]);
// //           console.error("plansが配列ではない:", data);
// //         }
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     if (groupId) fetchPlans();
// //   }, [groupId]);
// //   return (
// //     <>
// //       <h1 className="mb-4 text-xl font-bold">プランリスト</h1>

// //       <div className="grid grid-cols-1 gap-4 hover:bg-gray-100 p-4">
// //         {plans.length === 0 ? (
// //           <p>プランがありません</p>
// //         ) : (
// //           plans.map((plan, index) => (
// //             <div key={plan.id} className="bg-white rounded-lg shadow p-4">
// //               <div className="flex items-center gap-3">
// //                 <span className="text-gray-500 font-semibold">
// //                   {index + 1}.
// //                 </span>
// //                 <Link to={`/plans/${plan.id}`} className="flex-1 text-center">
// //                   <p className="flex-1 text-center">{plan.title}</p>
// //                 </Link>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </>
// //   );
// // }
// // import { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import { useParams } from "react-router-dom";
// // import { useNavigate } from "react-router-dom";
// // import { saveAuthHeaders } from "../../utils/auth";

// // export default function PlanList() {
// //   const [plans, setPlans] = useState<Plan[]>([]);
// //   const { groupIdz } = useParams();

// //   // useEffect(() => {
// //   //   fetch(`http://localhost:3000/api/v1/groups/${groupId}/plans`, {
// //   //     headers: {
// //   //       "access-token": localStorage.getItem("access-token") ?? "",
// //   //       client: localStorage.getItem("client") ?? "",
// //   //       uid: localStorage.getItem("uid") ?? "",
// //   //     },
// //   //   })
// //   //     .then((response) => {
// //   //       saveAuthHeaders(response);
// //   //       return response.json();
// //   //     })
// //   //     .then((data) => {
// //   //       setPlans(data);
// //   //     });
// //   // }, [groupId]);
// //   useEffect(() => {
// //     const fetchPlans = async () => {
// //       try {
// //         const res = await fetch(
// //           `http://localhost:3000/api/v1/groups/${groupId}/plans`,
// //           {
// //             headers: {
// //               "access-token": localStorage.getItem("access-token") ?? "",
// //               client: localStorage.getItem("client") ?? "",
// //               uid: localStorage.getItem("uid") ?? "",
// //             },
// //           },
// //         );

// //         // ヘッダーを先に保存
// //         saveAuthHeaders(res);

// //         const data = await res.json();

// //         if (Array.isArray(data)) {
// //           setPlans(data);
// //         } else {
// //           setPlans([]);
// //           console.error("plansが配列ではない:", data);
// //         }
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     if (groupId) fetchPlans();
// //   }, [groupId]);
// //   return (
// //     <>
// //       <h1 className="mb-4 text-xl font-bold">プランリスト</h1>

// //       <div className="grid grid-cols-1 gap-4 hover:bg-gray-100 p-4">
// //         {plans.length === 0 ? (
// //           <p>プランがありません</p>
// //         ) : (
// //           plans.map((plan, index) => (
// //             <div key={plan.id} className="bg-white rounded-lg shadow p-4">
// //               <div className="flex items-center gap-3">
// //                 <span className="text-gray-500 font-semibold">
// //                   {index + 1}.
// //                 </span>
// //                 <Link to={`/plans/${plan.id}`} className="flex-1 text-center">
// //                   <p className="flex-1 text-center">{plan.title}</p>
// //                 </Link>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { saveAuthHeaders } from "../../utils/auth";
// import Deadline from "../votes/Deadline";

// interface Plan {
//   id: number;
//   title: string;
// }

// export default function PlanList() {
//   const { groupId } = useParams<{ groupId: string }>();
//   const numericGroupId = Number(groupId);
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [error, setError] = useState<string>("");
//   const [groupDeadline, setGroupDeadline] = React.useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlans = async () => {
//       if (!numericGroupId) {
//         setError("グループIDが無効です");
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/v1/groups/${numericGroupId}/plans`,
//           {
//             headers: {
//               "access-token": localStorage.getItem("access-token") || "",
//               client: localStorage.getItem("client") || "",
//               uid: localStorage.getItem("uid") || "",
//             },
//           },
//         );

//         if (!res.ok) {
//           setError("プランを取得できませんでした（認証が必要です）");
//           setPlans([]);
//           return;
//         }

//         saveAuthHeaders(res);

//         const data = await res.json();
//         console.log("Railsから届いたデータ:", data);

//         // 🎯 Railsの `{ plans: ..., deadline: ... }` という形に完全に合わせます
//         if (data && typeof data === "object") {
//           // 1. 締め切り日をセット
//           setGroupDeadline(data.deadline || null);

//           // 2. プランをセット（Railsの location を title に変換して格納）
//           if (Array.isArray(data.plans)) {
//             const formattedPlans = data.plans.map((p: any) => ({
//               id: p.id,
//               title: p.title
//             }));
//             setPlans(formattedPlans);
//           } else {
//             setPlans([]);
//           }
//         } else {
//           setPlans([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("通信エラーが発生しました");
//       }
//     };

//     fetchPlans();
//   }, [numericGroupId]);

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h1 className="mb-4 text-xl font-bold">プランリスト</h1>
//       <div className="grid grid-cols-1 gap-4">
//         {error && <p className="text-red-500">{error}</p>}

//         <p>グループの投票締め切り日</p>
//         <div className="mb-4">
//           {groupDeadline
//             ? groupDeadline.substring(0, 10)
//             : "設定されていません。"}
//         </div>
//         {plans.length === 0 && !error ? (
//           <p>プランがありません</p>
//         ) : (
//           plans.map((plan, index) => (
//             <div
//               key={plan.id}
//               className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-blue-200"
//             >
//               <div className="flex items-center gap-4">
//                 <span className="text-gray-400 font-bold text-sm min-w-[24px]">
//                   {index + 1}
//                 </span>
//                 <Link to={`/plans/${plan.id}`} className="flex-1 group">
//                   <p className="text-left text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
//                     {plan.title}
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           ))
//         )}

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => navigate(`/groups/${groupId}/plans/new`)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors shadow"
//           >
//             プラン作成
//           </button>
//         </div>
//         <Link
//           to={`/groups/${groupId}/deadline`}
//           className="inline-block bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors shadow w-full sm:w-auto text-center"
//         >
//           ⏰ グループの締め切り設定ページへ
//         </Link>

//         <Link
//           to={`/groups/${groupId}/vote`}
//           className="inline-block bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-sky-600 transition-colors shadow w-full sm:w-auto text-center"
//         >
//           🗳️ グループの投票ページへ
//         </Link>

//         <Link
//           to={`/groups/${groupId}/vote/ranking`}
//           className="inline-block bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition-colors shadow w-full sm:w-auto text-center"
//         >
//           🏆 投票結果ランキングページへ
//         </Link>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { saveAuthHeaders } from "../../utils/auth";

// interface Plan {
//   id: number;
//   title: string;
// }

// export default function PlanList() {
//   const { groupId } = useParams<{ groupId: string }>();
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [error, setError] = useState<string>("");
//   const [groupDeadline, setGroupDeadline] = React.useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!groupId || isNaN(Number(groupId))) {
//       setError("グループIDが無効です");
//       return;
//     }

//     const handleDelete = async (planId: number) => {
//     if (!window.confirm("このプランを削除してもよろしいですか？")) {
//       return;
//     }

//     const numericGroupId = Number(groupId);

//     const fetchPlans = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/v1/groups/${numericGroupId}/plans`,
//           {
//             headers: {
//               "access-token": localStorage.getItem("access-token") || "",
//               client: localStorage.getItem("client") || "",
//               uid: localStorage.getItem("uid") || "",
//             },
//           },
//         );

//         if (!res.ok) {
//           setError("プランを取得できませんでした（認証が必要です）");
//           setPlans([]);
//           return;
//         }

//         saveAuthHeaders(res);

//         const data = await res.json();

//         if (data && typeof data === "object") {
//           setGroupDeadline(data.deadline || null);

//           if (Array.isArray(data.plans)) {
//             const formattedPlans = data.plans.map((p: any) => ({
//               id: p.id,
//               title: p.title,
//             }));
//             setPlans(formattedPlans);
//           } else {
//             setPlans([]);
//           }
//         } else {
//           setPlans([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("通信エラーが発生しました");
//       }
//     };

//     fetchPlans();
//   }, [groupId]);

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h1 className="mb-4 text-xl font-bold">プランリスト</h1>
//       <div className="grid grid-cols-1 gap-4">
//         {error && <p className="text-red-500">{error}</p>}

//         <p>グループの投票締め切り日</p>
//         <div className="mb-4">
//           {groupDeadline
//             ? groupDeadline.substring(0, 10)
//             : "設定されていません。"}
//         </div>
//         {plans.length === 0 && !error ? (
//           <p>プランがありません</p>
//         ) : (
//           plans.map((plan, index) => (
//             <div
//               key={plan.id}
//               className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-blue-200"
//             >
//               <div className="flex items-center gap-4">
//                 <span className="text-gray-400 font-bold text-sm min-w-[24px]">
//                   {index + 1}
//                 </span>
//                 <Link to={`/plans/${plan.id}`} className="flex-1 group">
//                   <p className="text-left text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
//                     {plan.title}
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           ))
//         )}

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => navigate(`/groups/${groupId}/plans/new`)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors shadow"
//           >
//             プラン作成
//           </button>
//         </div>
//         <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
//           <button
//                 onClick={() => handleDelete(plan.id)}
//                 className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-100 transition-colors font-medium"
//               >
//                 削除
//               </button>
//         </div>
//         <Link
//           to={`/groups/${groupId}/deadline`}
//           className="inline-block bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors shadow w-full sm:w-auto text-center"
//         >
//           ⏰ グループの締め切り設定ページへ
//         </Link>

//         <Link
//           to={`/groups/${groupId}/vote`}
//           className="inline-block bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-sky-600 transition-colors shadow w-full sm:w-auto text-center"
//         >
//           🗳️ グループの投票ページへ
//         </Link>

//         <Link
//           to={`/groups/${groupId}/vote/ranking`}
//           className="inline-block bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition-colors shadow w-full sm:w-auto text-center"
//         >
//           🏆 投票結果ランキングページへ
//         </Link>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { saveAuthHeaders } from "../../utils/auth";

interface Plan {
  id: number;
  title: string;
}

export default function PlanList() {
  const { groupId } = useParams<{ groupId: string }>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string>("");
  const [groupDeadline, setGroupDeadline] = useState<string>("");
  const navigate = useNavigate();

  // 1. プラン一覧取得関数
  const fetchPlans = async () => {
    if (!groupId || isNaN(Number(groupId))) {
      setError("グループIDが無効です");
      return;
    }

    const numericGroupId = Number(groupId);

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/groups/${numericGroupId}/plans`,
        {
          headers: {
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        },
      );

      if (!res.ok) {
        setError("プランを取得できませんでした（認証が必要です）");
        setPlans([]);
        return;
      }

      saveAuthHeaders(res);

      const data = await res.json();

      if (data && typeof data === "object") {
        setGroupDeadline(data.deadline || "");

        if (Array.isArray(data.plans)) {
          const formattedPlans = data.plans.map((p: any) => ({
            id: p.id,
            title: p.title,
          }));
          setPlans(formattedPlans);
        } else {
          setPlans([]);
        }
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error(err);
      setError("通信エラーが発生しました");
    }
  };

  // 2. 初回＆groupId変更時の読み込み処理
  useEffect(() => {
    fetchPlans();
  }, [groupId]);

  // 3. 削除処理関数（useEffectの外側に独立して定義）
  const handleDelete = async (planId: number) => {
    if (!window.confirm("このプランを削除してもよろしいですか？")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/v1/plans/${planId}`, {
        method: "DELETE",
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
        },
      });

      if (res.ok) {
        saveAuthHeaders(res);
        // ローカルの状態を更新して画面から削除されたプランを消す
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
      } else {
        alert("削除に失敗しました");
      }
    } catch (err) {
      console.error("削除エラー:", err);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="mb-4 text-xl font-bold">プランリスト</h1>
      <div className="grid grid-cols-1 gap-4">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <p className="text-sm text-gray-600 font-medium">
            グループの投票締め切り日
          </p>
          <div className="mb-4 font-bold text-gray-800">
            {groupDeadline
              ? groupDeadline.substring(0, 10)
              : "設定されていません。"}
          </div>
        </div>

        {plans.length === 0 && !error ? (
          <p className="text-gray-500">プランがありません</p>
        ) : (
          plans.map((plan, index) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md border border-gray-100 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-gray-400 font-bold text-sm min-w-[24px]">
                  {index + 1}
                </span>
                <Link to={`/plans/${plan.id}`} className="flex-1 group">
                  <p className="text-left text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    {plan.title}
                  </p>
                </Link>
              </div>

              {/* 各プランごとの削除ボタン */}
              <button
                type="button"
                onClick={() => handleDelete(plan.id)}
                className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-100 transition-colors font-medium"
              >
                削除
              </button>
            </div>
          ))
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(`/groups/${groupId}/plans/new`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors shadow"
          >
            ＋ プラン作成
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Link
            to={`/groups/${groupId}/deadline`}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors shadow text-center"
          >
            ⏰ グループの締め切り設定ページへ
          </Link>

          <Link
            to={`/groups/${groupId}/vote`}
            className="bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-sky-600 transition-colors shadow text-center"
          >
            🗳️ グループの投票ページへ
          </Link>

          <Link
            to={`/groups/${groupId}/vote/ranking`}
            className="bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition-colors shadow text-center"
          >
            🏆 投票結果ランキングページへ
          </Link>
        </div>
      </div>
    </div>
  );
}
