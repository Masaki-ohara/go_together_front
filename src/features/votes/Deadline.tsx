import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";

export default function Deadline() {
  const { groupId } = useParams<{ groupId: string }>(); // 💡 URLから :groupId を取得
  const navigate = useNavigate();
  const [deadline, setDeadline] = React.useState("");

  // 決定ボタンを押したときの処理（ここから関数がスタート）
  const handleSetDeadline = async () => {
    if (!deadline) {
      alert("期限を選択してください。");
      return;
    }

    try {
      // 📡 RailsのGroup更新API（PUT /api/v1/groups/:id）を叩く
      const res = await fetch(
        `http://localhost:3000/api/v1/groups/${groupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
          body: JSON.stringify({
            group: {
              deadline: deadline, // 👈 選択した日付を送信
            },
          }),
        },
      );

      if (!res.ok) {
        alert("期限の設定に失敗しました。");
        return;
      }

      alert(`投票期限を ${deadline} に設定しました！`);

      // 🚀 設定が終わったら、プランリスト画面に戻す
      navigate(`/groups/${groupId}/plans`);
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました。");
    }
  };
  // 日本時間の今日の日付（YYYY-MM-DD）を取得
  const today = new Date().toLocaleDateString("sv-SE");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">投票期限設定</h1>
      <label className="block mb-2 text-sm font-semibold text-gray-600">
        期限日
      </label>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        min={today} // 日本時間で正しく今日以降を制限
        className="w-64 border border-gray-300 rounded px-3 py-2 mb-4 cursor-pointer"
      />
      <button
        onClick={handleSetDeadline} // クリックイベントを追加
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        期限を設定
      </button>
      <BackButton />
    </div>
  );
}
