import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

// export default function PlanDetail() {
//   const [plan, setPlan] = useState();
//   const { id } = useParams();

//   useEffect(() => {
//     fetch(`http://localhost:3000/api/v1/plans/${id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setPlan(data);
//       });
//   }, []);
//   return (
//     <>
//       <h1 className="mb-2">詳細</h1>
//       <p className="mb-2">行きたい場所</p>
//       <p className="mb-2">{plan?.location}</p>
//       <p className="mb-2">予算</p>
//       <p className="mb-2">{plan?.budget}</p>
//       <p className="mb-2">やりたいことリスト</p>
//       <ul className="list-disc list-inside">
//         {plan?.plan_items?.map((item: any) => (
//           <li key={item.id} className="mb-2">
//             {item.content}
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }
export default function PlanDetail() {
  const { id } = useParams();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/plans/${id}`)
      .then((res) => res.json())
      .then((data) => setPlan(data));
  }, [id]);

  if (!plan) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">プラン詳細</h1>

      {!isEditing ? (
        <>
          <p className="mb-2">タイトル: {plan.title}</p>
          <p className="mb-2">場所: {plan.location}</p>
          <p className="mb-2">予算: {plan.budget}</p>

          <button onClick={() => setIsEditing(true)}>編集</button>
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
