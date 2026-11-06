import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ユーザーの型定義
interface User {
  id: number;
  name: string;
}

export default function TaskEdit() {
  const { groupId, scheduleId, taskId } = useParams<{
    groupId: string;
    scheduleId: string;
    taskId: string; // 👈 編集対象のタスクIDをURLから受け取る
  }>();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  // 👥 担当者選択用の状態
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 🔄 1. グループメンバー一覧 と 2. 既存のタスクデータを同時に取得する
  useEffect(() => {
    if (!groupId || !scheduleId || !taskId) return;

    const fetchData = async () => {
      try {
        // グループメンバーとタスク詳細を並行して取得
        const [groupRes, taskRes] = await Promise.all([
          fetch(`http://localhost:3000/api/v1/groups/${groupId}`, {
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              client: localStorage.getItem("client") || "",
              uid: localStorage.getItem("uid") || "",
            },
          }),
          fetch(
            `http://localhost:3000/api/v1/groups/${groupId}/schedules/${scheduleId}/tasks/${taskId}`,
            {
              headers: {
                "access-token": localStorage.getItem("access-token") || "",
                client: localStorage.getItem("client") || "",
                uid: localStorage.getItem("uid") || "",
              },
            },
          ),
        ]);

        if (groupRes.ok) {
          const groupData = await groupRes.json();
          setMembers(groupData.users || []);
        }

        if (taskRes.ok) {
          const taskData = await taskRes.json();
          // 既存のデータをフォームにセット
          setRole(taskData.role || "");
          setDescription(taskData.description || "");
          setSelectedUserId(taskData.user_id ? String(taskData.user_id) : "");
        } else {
          setError("タスク情報の取得に失敗しました");
        }
      } catch (err) {
        console.error("データの取得に失敗しました", err);
        setError("通信エラーが発生しました");
      }
    };

    fetchData();
  }, [groupId, scheduleId, taskId]);

  // 💾 更新保存処理（PATCH）
  const handleUpdateTask = async () => {
    if (!groupId || !scheduleId || !taskId) {
      alert("IDが無効です");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/groups/${groupId}/schedules/${scheduleId}/tasks/${taskId}`,
        {
          method: "PATCH", // 👈 編集なので PATCH
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
              user_id: selectedUserId ? Number(selectedUserId) : null,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("タスクの更新に失敗しました");
      }
      toast.success("タスクが正常に作成されました👤");
      navigate(`/groups/${groupId}/schedules/${scheduleId}/tasks`);
    } catch (error) {
      console.error(error);
      alert("タスクの更新に失敗しました");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">タスクの編集</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          役割
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          説明
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* 担当者を選択するプルダウン */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          担当者（任意）
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">未定（あとで割り当てる）</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleUpdateTask}
          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          更新を保存
        </button>
        <button
          onClick={() =>
            navigate(`/groups/${groupId}/schedules/${scheduleId}/tasks`)
          }
          className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
