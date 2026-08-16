// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import PlanEditForm from "./PlanEditForm";

// // export default function PlanDetail() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();

// //   const [plan, setPlan] = useState<any>(null);
// //   const [isEditing, setIsEditing] = useState(false);

// //   useEffect(() => {
// //     fetch(`http://localhost:3000/api/v1/plans/${id}`)
// //       .then((res) => res.json())
// //       .then((data) => setPlan(data));
// //   }, [id]);

// //   const clickBack = () => navigate(-1);

// //   if (!plan) return <p>Loading...</p>;

// //   return (
// //     <div className="max-w-xl mx-auto p-4">
// //       <h1 className="text-2xl font-bold mb-4">プラン詳細</h1>

// //       {!isEditing ? (
// //         <>
// //           <div>
// //             <label className="block mb-1 font-semibold">タイトル</label>
// //             <input
// //               type="text"
// //               value={plan.title}
// //               readOnly
// //               className="w-full border border-gray-300 rounded px-3 py-2"
// //             />
// //           </div>

// //           <div className="mb-2">
// //             <label className="font-semibold">場所:</label>
// //             <input
// //               type="text"
// //               value={plan.location}
// //               readOnly
// //               className="w-full border border-gray-300 rounded px-3 py-2"
// //             />
// //           </div>

// //           <div className="mb-2">
// //             <label className="font-semibold">予算:</label>
// //             <input
// //               type="number"
// //               value={plan.budget}
// //               readOnly
// //               className="w-full border border-gray-300 rounded px-3 py-2"
// //             />
// //           </div>

// //           <div className="mb-4">
// //             <label className="font-semibold">やりたいことリスト</label>
// //             <ul className="list-disc list-inside">
// //               {plan.plan_items?.map((item: any) => (
// //                 <input
// //                   key={item.id}
// //                   type="text"
// //                   value={item.content}
// //                   readOnly
// //                   className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
// //                 />
// //               ))}
// //             </ul>
// //           </div>

// //           <div className="flex gap-2 mt-4">
// //             <button
// //               onClick={() => setIsEditing(true)}
// //               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //             >
// //               編集
// //             </button>
// //             <button
// //               onClick={clickBack}
// //               className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
// //             >
// //               戻る
// //             </button>
// //           </div>
// //         </>
// //       ) : (
// //         <PlanEditForm
// //           plan={plan}
// //           onCancel={() => setIsEditing(false)}
// //           onUpdate={setPlan}
// //         />
// //       )}
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import PlanEditForm from "./PlanEditForm";

// // ⭕️ 時間帯の英語キーを日本語の絵文字付きラベルに変換する辞書
// const TIME_LABELS: Record<string, string> = {
//   "early morning": "早朝☀️",
//   morning: "🌅 午前",
//   lunch: "🍔 昼食・お昼",
//   afternoon: "🏃 午後",
//   evening: "🌆 夕方",
//   night: "🌙 夜・夕食",
// };

// // ⭕️ スケジュールを朝から夜の正しい順番（時系列）で並び替えるための優先度設定
// const TIME_ORDER: Record<string, number> = {
//   "early morning": 1,
//   morning: 2,
//   lunch: 3,
//   afternoon: 4,
//   evening: 5,
//   night: 6,
// };

// export default function PlanDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [plan, setPlan] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     fetch(`http://localhost:3000/api/v1/plans/${id}`, {
//       headers: {
//         "access-token": localStorage.getItem("access-token") || "",
//         client: localStorage.getItem("client") || "",
//         uid: localStorage.getItem("uid") || "",
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("データの取得に失敗しました");
//         return res.json();
//       })
//       .then((data) => setPlan(data))
//       .catch((err) => console.error(err));
//   }, [id]);

//   const clickBack = () => navigate(-1);

//   if (!plan) return <p className="p-4 text-center">Loading...</p>;

//   // ⭕️ Rails特有のエスケープ混じり文字列データを完璧に分解し、時系列順にソートする前処理
//   const sortedItems = plan.plan_items
//     ? [...plan.plan_items]
//         .map((item: any) => {
//           let content = item.content;
//           let time = item.time;

//           // 💡 Gyazo画像にあった \"content\"=>\"スタバ\" という特殊な文字列の塊を確実に解体する
//           if (typeof content === "string") {
//             if (content.includes("=>")) {
//               try {
//                 // エスケープ文字（\や"）を無視して、矢印の右側にある純粋な文字列だけを引っこ抜く強力な正規表現
//                 const contentMatch = content.match(
//                   /(?:content|text)[\\"\s]*=>[\\"\s]*([^\\",}]+)/,
//                 );
//                 const timeMatch = content.match(
//                   /time[\\"\s]*=>[\\"\s]*([^\\",}]+)/,
//                 );

//                 // [1] を指定することで、マッチした中身の文字列（例: 「スタバ」「lunch」）だけを取り出す
//                 if (contentMatch && contentMatch[1]) {
//                   content = contentMatch[1].trim();
//                 }
//                 if (timeMatch && timeMatch[1]) {
//                   time = timeMatch[1].trim();
//                 }
//               } catch (e) {
//                 console.error("ハッシュの解析に失敗しました", e);
//               }
//             }
//             // 通常のJSON文字列形式だった場合
//             else if (content.startsWith("{") && content.endsWith("}")) {
//               try {
//                 const parsed = JSON.parse(content);
//                 content = parsed.content || parsed.text;
//                 time = parsed.time;
//               } catch (e) {
//                 // 解析失敗時はそのまま
//               }
//             }
//           }

//           // Rails側ですでにカラムが分かれて入っている場合もカバー
//           if (item.time && !time) {
//             time = item.time;
//           }

//           return { ...item, parsedContent: content, parsedTime: time };
//         })
//         // 朝から夜の順番に綺麗に並び替える（時間帯が未設定のものは一番下に配置）
//         .sort((a, b) => {
//           const orderA = TIME_ORDER[a.parsedTime] || 99;
//           const orderB = TIME_ORDER[b.parsedTime] || 99;
//           return orderA - orderB;
//         })
//     : [];

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">プラン詳細</h1>

//       {!isEditing ? (
//         <div className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">
//               タイトル
//             </label>
//             <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
//               {plan.title}
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">
//               場所
//             </label>
//             <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
//               {plan.location}
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">
//               予算
//             </label>
//             <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
//               {Number(plan.budget).toLocaleString()}円
//             </div>
//           </div>

//           {/* ⭕️ 横並びに綺麗に分離した「やりたいことリスト」エリア */}
//           <div>
//             <label className="block mb-2 text-sm font-semibold text-gray-600">
//               やりたいことスケジュール
//             </label>
//             <div className="space-y-2">
//               {sortedItems.length > 0 ? (
//                 sortedItems.map((item: any, index: number) => (
//                   <div
//                     key={item.id || index}
//                     className="w-full border border-gray-200 rounded p-3 bg-white shadow-sm flex items-center gap-4"
//                   >
//                     {/* 左側：時間帯タグ（幅を w-32 に固定して、右側の文字と綺麗に縦を揃える） */}
//                     <div className="w-32 shrink-0">
//                       {item.parsedTime ? (
//                         <span className="inline-block text-center text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md font-bold w-full">
//                           {TIME_LABELS[item.parsedTime] || item.parsedTime}
//                         </span>
//                       ) : (
//                         <span className="inline-block text-center text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md font-medium w-full">
//                           ⏱ 未設定
//                         </span>
//                       )}
//                     </div>

//                     {/* 右側：純粋に分離された「やりたいこと」のテキスト内容 */}
//                     <div className="flex-1 text-gray-800 font-medium">
//                       {item.parsedContent}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400 text-sm">リストはありません</p>
//               )}
//             </div>
//           </div>

//           <div className="flex gap-4 mt-8">
//             <button
//               onClick={() => setIsEditing(true)}
//               className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//             >
//               編集する
//             </button>
//             <button
//               onClick={clickBack}
//               className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
//             >
//               戻る
//             </button>
//           </div>
//         </div>
//       ) : (
//         <PlanEditForm
//           plan={plan}
//           onCancel={() => setIsEditing(false)}
//           onUpdate={(updatedPlan) => {
//             setPlan(updatedPlan);
//             setIsEditing(false); // 編集完了時に自動で詳細画面に戻る
//           }}
//         />
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlanEditForm from "./PlanEditForm";

// ⭕️ 時間帯のキーを日本語ラベルに変換する辞書
const TIME_LABELS: Record<string, string> = {
  "early morning": "早朝☀️",
  morning: "🌅 午前",
  lunch: "🍔 昼食・お昼",
  afternoon: "🏃 午後",
  evening: "🌆 夕方",
  night: "🌙 夜・夕食",
};

// ⭕️ 時系列順に並び替えるための優先度設定
const TIME_ORDER: Record<string, number> = {
  "early morning": 1,
  morning: 2,
  lunch: 3,
  afternoon: 4,
  evening: 5,
  night: 6,
};

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
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

  // ⭕️ 【超すっきり化】正規表現の解体工場をすべて削除！
  const parsedItems = plan.plan_items
    ? plan.plan_items.map((item: any) => ({
        ...item,
        // Railsの新しいtimeカラムとcontentカラムの値をそのまま使うだけ！
        parsedContent: item.content,
        parsedTime: item.time,
      }))
    : [];

  // ⭕️ 当日のスケジュール用に時系列順にソートする処理
  const timelineItems = [...parsedItems].sort((a, b) => {
    const orderA = TIME_ORDER[a.parsedTime] || 99;
    const orderB = TIME_ORDER[b.parsedTime] || 99;
    return orderA - orderB;
  });

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">プラン詳細</h1>

      {!isEditing ? (
        <>
          {/* 基本概要カード */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            {/* <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              📁 概要
            </h2> */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-2">
                <span className="text-gray-500">タイトル:</span>{" "}
                <span className="font-bold text-gray-800">{plan.title}</span>
              </div>
              <div>
                <span className="text-gray-500">場所:</span>{" "}
                <span className="font-medium text-gray-700">
                  {plan.location}
                </span>
              </div>
              <div>
                <span className="text-gray-500">予算:</span>{" "}
                <span className="font-bold text-amber-600">
                  {Number(plan.budget).toLocaleString()}円
                </span>
              </div>
            </div>
          </div>

          {/* 分けたエリア1：【みんなのやりたいこと（箇条書き）】 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              💡 みんなのやりたいこと
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 font-medium">
              {parsedItems.length > 0 ? (
                parsedItems.map((item: any, index: number) => (
                  <li
                    key={item.id || index}
                    className="hover:text-purple-600 transition"
                  >
                    {item.parsedContent}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm list-none pl-0">
                  登録された項目はありません
                </p>
              )}
            </ul>
          </div>

          {/* 分けたエリア2：【当日のスケジュール（時系列ルート）】 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              📅 当日のスケジュール
            </h2>
            <div className="border-l-2 border-purple-200 ml-3 pl-5 space-y-4">
              {timelineItems.length > 0 ? (
                timelineItems.map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className="relative flex items-center gap-3"
                  >
                    {/* タイムラインの左ポチ */}
                    <div className="absolute -left-[27px] w-2.5 h-2.5 bg-purple-500 rounded-full border border-white" />

                    {/* 時間帯 */}
                    <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded font-bold border border-purple-100 shrink-0 w-24 text-center">
                      {TIME_LABELS[item.parsedTime] || "未設定"}
                    </span>

                    {/* 行動内容 */}
                    <span className="text-sm text-gray-700 font-semibold">
                      {item.parsedContent}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm border-none pl-0">
                  スケジュールはありません
                </p>
              )}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
            >
              編集する
            </button>
            <button
              onClick={clickBack}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              戻る
            </button>
          </div>
        </>
      ) : (
        <PlanEditForm
          plan={plan}
          onCancel={() => setIsEditing(false)}
          onUpdate={(updatedPlan) => {
            setPlan(updatedPlan);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
