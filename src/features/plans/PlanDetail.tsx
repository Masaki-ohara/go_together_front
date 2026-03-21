// import React, { useEffect } from "react";
// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import PlanEditForm from "./PlanEditForm";
// import { useNavigate } from "react-router-dom";

// export default function PlanDetail() {
//   const { id } = useParams();
//   const [plan, setPlan] = useState<Plan | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const navigate = useNavigate();
//   const clickBack = () => {
//     navigate(-1);
//   };

//   useEffect(() => {
//     fetch(`http://localhost:3000/api/v1/plans/${id}`)
//       .then((res) => res.json())
//       .then((data) => setPlan(data));
//   }, [id]);

//   if (!plan) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">プラン詳細</h1>

//       {!isEditing ? (
//         <>
//           <p className="mb-2 ">タイトル: {plan.title}</p>
//           <p className="w-full border border-gray-300 rounded px-3">
//             場所: {plan.location}
//           </p>
//           <p className="mb-2">予算: {plan.budget}</p>
//           <div className="mt-4">
//             <p className="font-semibold">やりたいことリスト</p>
//             <ul className="list-disc list-inside">
//               {plan.plan_items?.map((item: any) => (
//                 <li key={item.id}>{item.content}</li>
//               ))}
//             </ul>
//           </div>

//           <button
//             onClick={() => setIsEditing(true)}
//             className="p-2 rounded-full hover:bg-green-100 bg-blue-400 transition"
//           >
//             編集
//           </button>
//           <br />
//           <button
//             onClick={clickBack}
//             className="mt-4 px-4 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-green-400"
//           >
//             戻る
//           </button>
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
    fetch(`http://localhost:3000/api/v1/plans/${id}`)
      .then((res) => res.json())
      .then((data) => setPlan(data));
  }, [id]);

  const clickBack = () => navigate(-1);

  if (!plan) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プラン詳細</h1>

      {!isEditing ? (
        <>
          <div>
            <label className="block mb-1 font-semibold">タイトル</label>
            <input
              type="text"
              value={plan.title}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="mb-2">
            <label className="font-semibold">場所:</label>
            <input
              type="text"
              value={plan.location}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="mb-2">
            <label className="font-semibold">予算:</label>
            <input
              type="number"
              value={plan.budget}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">やりたいことリスト</label>
            <ul className="list-disc list-inside">
              {plan.plan_items?.map((item: any) => (
                <input
                  key={item.id}
                  type="text"
                  value={item.content}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                />
              ))}
            </ul>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              編集
            </button>
            <button
              onClick={clickBack}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              戻る
            </button>
          </div>
        </>
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
