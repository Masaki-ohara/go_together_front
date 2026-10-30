// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export default function TaskCreate() {
//   const { groupId, scheduleId } = useParams<{
//     groupId: string;
//     scheduleId: string;
//   }>();
//   const navigate = useNavigate();
//   const [role, setRole] = useState("");
//   const [description, setDescription] = useState("");

//   const handleCreateTask = async () => {
//     if (!groupId || !scheduleId) {
//       alert("グループIDまたはスケジュールIDが無効です");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/v1/groups/${groupId}/schedules/${scheduleId}/tasks`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "access-token": localStorage.getItem("access-token") || "",
//             client: localStorage.getItem("client") || "",
//             uid: localStorage.getItem("uid") || "",
//           },
//           body: JSON.stringify({
//             task: {
//               role,
//               description,
//             },
//           }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error("タスクの作成に失敗しました");
//       }

//       // タスク作成後、スケジュール詳細ページに遷移
//       navigate(`/groups/${groupId}/schedules/${scheduleId}`);
//     } catch (error) {
//       console.error(error);
//       alert("タスクの作成に失敗しました");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">タスクを作成</h2>
//       <div className="mb-4">
//         <label className="block mb-1">役割</label>
//         <input
//           type="text"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2"
//         />
//       </div>

//       {/* ⭕️ divタグの閉じ方を修正 */}
//       <div className="mb-4">
//         <label className="block mb-1">説明</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2"
//         />
//       </div>

//       <button
//         onClick={handleCreateTask}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         タスクを作成
//       </button>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ユーザーの型定義
interface User {
  id: number;
  name: string;
}

export default function TaskCreate() {
  const { groupId, scheduleId } = useParams<{
    groupId: string;
    scheduleId: string;
  }>();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  // 👥 担当者選択用の状態
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // 🔄 グループのメンバー一覧を画面ロード時に取得する
  useEffect(() => {
    if (!groupId) return;

    const fetchGroupMembers = async () => {
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
        const data = await response.json();
        if (response.ok) {
          setMembers(data.users || []); // グループに所属するユーザー一覧をセット
        }
      } catch (error) {
        console.error("メンバーの取得に失敗しました", error);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  const handleCreateTask = async () => {
    if (!groupId || !scheduleId) {
      alert("グループIDまたはスケジュールIDが無効です");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/groups/${groupId}/schedules/${scheduleId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
          body: JSON.stringify({
            task: {
              role,
              description,
              user_id: selectedUserId ? Number(selectedUserId) : null, // 👈 選択されたユーザーIDを送信（未選択ならnull）
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("タスクの作成に失敗しました");
      }

      navigate(`/groups/${groupId}/schedules/${scheduleId}/tasks`);
    } catch (error) {
      console.error(error);
      alert("タスクの作成に失敗しました");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">タスクを作成</h2>
      <div className="mb-4">
        <label className="block mb-1">役割</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* 👇 担当者を選択するプルダウンを追加 */}
      <div className="mb-4">
        <label className="block mb-1">担当者（任意）</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
        >
          <option value="">未定（あとで割り当てる）</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreateTask}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        タスクを作成
      </button>
    </div>
  );
}
