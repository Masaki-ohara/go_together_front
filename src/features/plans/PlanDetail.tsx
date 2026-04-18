// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import PlanEditForm from "./PlanEditForm";

// export default function PlanDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [plan, setPlan] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     fetch(`http://localhost:3000/api/v1/plans/${id}`)
//       .then((res) => res.json())
//       .then((data) => setPlan(data));
//   }, [id]);

//   const clickBack = () => navigate(-1);

//   if (!plan) return <p>Loading...</p>;

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">プラン詳細</h1>

//       {!isEditing ? (
//         <>
//           <div>
//             <label className="block mb-1 font-semibold">タイトル</label>
//             <input
//               type="text"
//               value={plan.title}
//               readOnly
//               className="w-full border border-gray-300 rounded px-3 py-2"
//             />
//           </div>

//           <div className="mb-2">
//             <label className="font-semibold">場所:</label>
//             <input
//               type="text"
//               value={plan.location}
//               readOnly
//               className="w-full border border-gray-300 rounded px-3 py-2"
//             />
//           </div>

//           <div className="mb-2">
//             <label className="font-semibold">予算:</label>
//             <input
//               type="number"
//               value={plan.budget}
//               readOnly
//               className="w-full border border-gray-300 rounded px-3 py-2"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="font-semibold">やりたいことリスト</label>
//             <ul className="list-disc list-inside">
//               {plan.plan_items?.map((item: any) => (
//                 <input
//                   key={item.id}
//                   type="text"
//                   value={item.content}
//                   readOnly
//                   className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
//                 />
//               ))}
//             </ul>
//           </div>

//           <div className="flex gap-2 mt-4">
//             <button
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               編集
//             </button>
//             <button
//               onClick={clickBack}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//             >
//               戻る
//             </button>
//           </div>
//         </>
//       ) : (
//         <PlanEditForm
//           plan={plan}
//           onCancel={() => setIsEditing(false)}
//           onUpdate={setPlan}
//         />
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlanEditForm from "./PlanEditForm";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 詳細取得時も認証ヘッダーを含める
    fetch(`http://localhost:3000/api/v1/plans/${id}`, {
      headers: {
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then((data) => setPlan(data))
      .catch((err) => console.error(err));
  }, [id]);

  const clickBack = () => navigate(-1);

  if (!plan) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">プラン詳細</h1>

      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">
              タイトル
            </label>
            <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
              {plan.title}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">
              場所
            </label>
            <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
              {plan.location}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">
              予算
            </label>
            <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
              {/* ¥{Number(plan.budget).toLocaleString()} */}
              {Number(plan.budget).toLocaleString()}円
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">
              やりたいことリスト
            </label>
            <div className="space-y-2">
              {plan.plan_items && plan.plan_items.length > 0 ? (
                plan.plan_items.map((item: any) => (
                  <div
                    key={item.id}
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-white shadow-sm"
                  >
                    {item.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">リストはありません</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              編集する
            </button>
            <button
              onClick={clickBack}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              戻る
            </button>
          </div>
        </div>
      ) : (
        <PlanEditForm
          plan={plan}
          onCancel={() => setIsEditing(false)}
          onUpdate={setPlan}
        />
      )}
    </div>
  );
}
