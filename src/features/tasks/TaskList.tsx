// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function TaskList() {
//   const { groupId, scheduleId } = useParams<{
//     groupId: string;
//     scheduleId: string;
//   }>();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [error, setError] = useState<string>("");

//   const fetchTasks = async () => {
//     if (!groupId || !scheduleId) {
//       setError("グループIDまたはスケジュールIDが無効です");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `http://localhost:3000/api/v1/groups/${groupId}/schedules/${scheduleId}/tasks`,
//         {
//           headers: {
//             "access-token": localStorage.getItem("access-token") || "",
//             client: localStorage.getItem("client") || "",
//             uid: localStorage.getItem("uid") || "",
//           },
//         },
//       );

//       if (!res.ok) {
//         setError("タスクを取得できませんでした（認証が必要です）");
//         setTasks([]);
//         return;
//       }

//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setTasks(data);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("通信エラーが発生しました");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [groupId, scheduleId]);

//   return (
//     <div>
//       <h1>役割一覧</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       <ul>
//         {tasks.map((task) => (
//           <li key={task.id}>
//             <strong>{task.role}</strong> - {task.description} (担当者:{" "}
//             {task.user.name}) - 完了: {task.completed ? "はい" : "いいえ"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// Taskの型定義（必要に応じて調整してください）
interface Task {
  id: number;
  role: string;
  description: string;
  user_id: number | null;
  user_name?: string; // Rails側で user_name を返している場合
  completed: boolean;
}

export default function TaskList() {
  const { groupId, scheduleId } = useParams<{
    groupId: string;
    scheduleId: string;
  }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");

  const fetchTasks = async () => {
    if (!groupId || !scheduleId) {
      setError("グループIDまたはスケジュールIDが無効です");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/groups/${groupId}/schedules/${scheduleId}/tasks`,
        {
          headers: {
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        },
      );

      if (!res.ok) {
        setError("タスクを取得できませんでした（認証が必要です）");
        setTasks([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
      setError("通信エラーが発生しました");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [groupId, scheduleId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">役割・タスク一覧</h1>
        {groupId && scheduleId && (
          <Link
            to={`/groups/${groupId}/schedules/${scheduleId}/tasks/create`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            ＋ タスクを追加
          </Link>
        )}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* タスク一覧 */}
      {tasks.length === 0 && !error ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">まだタスクが登録されていません</p>
          <p className="text-sm text-gray-400">
            最初のタスクを追加してメンバーと役割を分けましょう！
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-xl border transition-all bg-white shadow-sm hover:shadow-md ${
                task.completed
                  ? "border-green-200 bg-green-50/30"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  {/* 役割（タイトル） */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    {task.role}
                    {task.completed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                        完了済
                      </span>
                    )}
                  </h3>

                  {/* 説明文 */}
                  <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap">
                    {task.description || "説明はありません"}
                  </p>
                </div>
              </div>

              {/* フッター情報（担当者など） */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-700">担当者:</span>
                  <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-medium">
                    {task.user_name || "未割当"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link
        to={`/groups/${groupId}/schedules/${scheduleId}`}
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        ← しおりに戻る
      </Link>
    </div>
  );
}
