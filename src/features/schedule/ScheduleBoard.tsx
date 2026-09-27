// // export default function ScheduleBoard() {
// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">スケジュールボード</h1>
// //       <p>ここにスケジュールの内容が表示されます。</p>
// //     </div>
// //   );
// // }
// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";

// // export default function ScheduleDetail() {
// //   // const { scheduleId } = useParams();
// //   const { groupId } = useParams();
// //   const [schedule, setSchedule] = useState<any>(null);

// //   useEffect(() => {
// //     if (!groupId || groupId === "undefined") {
// //       return;
// //     }
// //     const fetchSchedule = async () => {
// //       try {
// //         const response = await fetch(
// //           // `http://localhost:3000/api/v1/schedules/${groupId}`,
// //           `http://localhost:3000/api/v1/groups/${groupId}/schedules`,
// //           {
// //             headers: {
// //               "access-token": localStorage.getItem("access-token") || "",
// //               client: localStorage.getItem("client") || "",
// //               uid: localStorage.getItem("uid") || "",
// //             },
// //           },
// //         );
// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         setSchedule(data);
// //       } catch (error) {
// //         console.error("スケジュールの取得に失敗しました", error);
// //       }
// //     };

// //     fetchSchedule();
// //   }, [groupId]);

// //   if (!groupId || groupId === "undefined") {
// //     return (
// //       <div className="p-6 text-gray-500">グループIDが指定されていません。</div>
// //     );
// //   }

// //   if (!schedule) return <div className="p-6">読み込み中...</div>;

// //   return (
// //     <div className="p-6 max-w-4xl mx-auto">
// //       <h1 className="text-2xl font-bold mb-4">{schedule.title} のしおり</h1>

// //       {/* タイムライン・表形式の表示エリア */}
// //       <div className="space-y-4">
// //         {schedule.schedule_items?.map((item: any) => (
// //           <div
// //             key={item.id}
// //             className="p-4 bg-white border rounded shadow-sm flex gap-4"
// //           >
// //             <div className="w-24 text-sky-600 font-bold">
// //               {item.start_time} - {item.end_time}
// //             </div>
// //             <div>
// //               <h3 className="font-bold text-lg">{item.title}</h3>
// //               {item.location && (
// //                 <p className="text-sm text-gray-500">📍 {item.location}</p>
// //               )}
// //               {item.memo && (
// //                 <p className="text-sm text-gray-700 mt-1">{item.memo}</p>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import BackButton from "../../components/common/BackButton";

// type ScheduleItem = {
//   id: number;
//   content: string;
//   time: string;
//   location?: string;
//   memo?: string;
// };

// type ScheduleData = {
//   id: number;
//   title: string;
//   date?: string;
//   location?: string;
//   budget?: number;
//   lists?: ScheduleItem[];
//   schedule_items?: ScheduleItem[]; // APIのキー名が schedule_items の場合の互換性
// };

// export default function ScheduleBoard() {
//   const { groupId } = useParams<{ groupId: string }>();
//   const [schedule, setSchedule] = useState<ScheduleData | null>(null);

//   // 時間帯コードを日本語に整形する関数
//   const formatTime = (time: string) => {
//     const timeMap: Record<string, string> = {
//       "early morning": "早朝 ☀️",
//       morning: "午前 🌅",
//       lunch: "昼食・お昼 🍔",
//       afternoon: "午後 🏃",
//       evening: "夕方 🌆",
//       night: "夜・夕食 🌙",
//     };
//     return timeMap[time] || time;
//   };

//   useEffect(() => {
//     if (!groupId || groupId === "undefined") return;

//     const fetchSchedule = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/api/v1/groups/${groupId}/schedules`,
//           {
//             headers: {
//               "access-token": localStorage.getItem("access-token") || "",
//               client: localStorage.getItem("client") || "",
//               uid: localStorage.getItem("uid") || "",
//             },
//           },
//         );

//         if (!response.ok)
//           throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         console.log("取得したスケジュールデータ:", data);
//         setSchedule(data);
//       } catch (error) {
//         console.error("スケジュールの取得に失敗しました", error);
//       }
//     };

//     fetchSchedule();
//   }, [groupId]);

//   if (!groupId || groupId === "undefined") {
//     return (
//       <div className="p-6 text-gray-500">グループIDが指定されていません。</div>
//     );
//   }

//   if (!schedule) return <div className="p-6 text-center">読み込み中...</div>;

//   // バックエンドからのレスポンス構造（lists または schedule_items）に対応
//   const items = schedule.lists || schedule.schedule_items || [];

//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-6">
//       {/* 1. タイトル & 場所 & 予算 ヘッダーエリア */}
//       <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-3">
//         <h1 className="text-2xl font-bold text-gray-800">
//           📅 {schedule.title || "スケジュールしおり"}
//         </h1>

//         <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2 border-t">
//           {/* 場所の表示 */}
//           {schedule.location && (
//             <div className="flex items-center font-medium text-gray-700">
//               📍 <span className="ml-1">場所: {schedule.location}</span>
//             </div>
//           )}

//           {/* 予算の表示 */}
//           {schedule.budget !== undefined && (
//             <div className="flex items-center font-medium text-gray-700">
//               💰{" "}
//               <span className="ml-1">
//                 予算: ¥{schedule.budget.toLocaleString()}
//               </span>
//             </div>
//           )}

//           {/* 日付の表示 */}
//           {schedule.date && (
//             <div className="flex items-center font-medium text-gray-700">
//               🗓️{" "}
//               <span className="ml-1">
//                 {new Date(schedule.date).toLocaleDateString("ja-JP")}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. したいことリスト（タイムライン形式） */}
//       <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//         <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
//           ✨ タイムライン / したいこと
//         </h2>

//         {items.length > 0 ? (
//           <div className="space-y-3">
//             {items.map((item, index) => (
//               <div
//                 key={item.id || index}
//                 className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200"
//               >
//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-800">{item.content}</p>
//                   {item.location && (
//                     <p className="text-xs text-gray-500">📍 {item.location}</p>
//                   )}
//                 </div>

//                 <span className="text-xs font-semibold px-3 py-1 bg-sky-100 text-sky-800 rounded-full whitespace-nowrap">
//                   {formatTime(item.time)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 text-center py-4">
//             登録された予定がありません。
//           </p>
//         )}
//       </div>

//       <BackButton />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";

// 1. APIのレスポンス構造に合わせた型定義
type Plan = {
  id: number;
  location?: string;
  budget?: number;
};

type ScheduleItem = {
  id: number;
  content: string;
  start_time: string; // ⭕️ time から変更
  end_time?: string; // ⭕️ 追加
  location?: string;
};

type ScheduleData = {
  id: number;
  title: string;
  date?: string;
  plan_id?: number;
  plan?: Plan; // ⭕️ plan オブジェクトを追加
  schedule_items?: ScheduleItem[];
};

export default function ScheduleBoard() {
  const { groupId } = useParams<{ groupId: string }>();
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);

  useEffect(() => {
    if (!groupId || groupId === "undefined") return;

    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/groups/${groupId}/schedules`,
          {
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              client: localStorage.getItem("client") || "",
              uid: localStorage.getItem("uid") || "",
            },
          },
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("取得したスケジュールデータ:", data);
        setSchedule(data);
      } catch (error) {
        console.error("スケジュールの取得に失敗しました", error);
      }
    };

    fetchSchedule();
  }, [groupId]);

  if (!groupId || groupId === "undefined") {
    return (
      <div className="p-6 text-gray-500">グループIDが指定されていません。</div>
    );
  }

  if (!schedule) return <div className="p-6 text-center">読み込み中...</div>;

  const items = schedule.schedule_items || [];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* 1. タイトル & 場所 & 予算 ヘッダーエリア */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-3">
        <h1 className="text-2xl font-bold text-gray-800">
          📅 {schedule.title || "スケジュールしおり"}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2 border-t">
          {/* ⭕️ 場所の表示 (schedule.plan.location を参照) */}
          {schedule.plan?.location && (
            <div className="flex items-center font-medium text-gray-700">
              📍 <span className="ml-1">場所: {schedule.plan.location}</span>
            </div>
          )}

          {/* ⭕️ 予算の表示 (schedule.plan.budget を参照) */}
          {schedule.plan?.budget !== undefined &&
            schedule.plan?.budget !== null && (
              <div className="flex items-center font-medium text-gray-700">
                💰{" "}
                <span className="ml-1">
                  予算: ¥{schedule.plan.budget.toLocaleString()}
                </span>
              </div>
            )}

          {/* 日付の表示 */}
          {schedule.date && (
            <div className="flex items-center font-medium text-gray-700">
              🗓️{" "}
              <span className="ml-1">
                {new Date(schedule.date).toLocaleDateString("ja-JP")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. したいことリスト（タイムライン形式） */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          ✨ タイムライン / したいこと
        </h2>

        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">{item.content}</p>
                  {item.location && (
                    <p className="text-xs text-gray-500">📍 {item.location}</p>
                  )}
                </div>

                {/* ⭕️ start_time と end_time を表示 */}
                <span className="text-xs font-semibold px-3 py-1 bg-sky-100 text-sky-800 rounded-full whitespace-nowrap">
                  ⏰ {item.start_time}
                  {item.end_time ? ` 〜 ${item.end_time}` : ""}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">
            登録された予定がありません。
          </p>
        )}
      </div>

      <BackButton />
    </div>
  );
}
