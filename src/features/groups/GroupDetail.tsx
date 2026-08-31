import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URLのIDを取得するため
import { Link } from "react-router-dom"; // プラン一覧へのリンク用
import { toast } from "react-toastify";

export default function GroupDetail() {
  // ⭕️ ルーティングの設定に合わせて 'groupId' で受け取るように修正！
  const { groupId } = useParams();
  const [group, setGroup] = useState<any>(null); // データを保存するステート

  useEffect(() => {
    // groupId が取得できていない場合は通信しない
    if (!groupId) return;

    const fetchGroupData = async () => {
      try {
        // ⭕️ URLの末尾を groupId に修正
        const response = await fetch(
          `http://localhost:3000/api/v1/groups/${groupId}`,
          {
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              client: localStorage.getItem("client") || "",
              uid: localStorage.getItem("uid") || "",
              userimage: localStorage.getItem("user-image") || "",
            },
          },
        );
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      }
    };

    fetchGroupData();
  }, [groupId]); // ⭕️ 監視対象も groupId に修正

  if (!group) {
    return <div className="p-6 text-gray-500">読み込み中...</div>;
  }

  const shareLink = `${window.location.origin}/groups/join?token=${group.share_token}`;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{group.name} のメンバー一覧</h1>

      <div className="space-y-2">
        {group.users?.map((user: any) => (
          <div
            key={user.id}
            className="p-3 bg-white shadow rounded flex items-center border"
          >
            {/* プロフィール画像エリア */}
            <div className="w-8 h-8 mr-3 shrink-0">
              {user.image ? (
                <img
                  src={
                    user.image.startsWith("http")
                      ? user.image
                      : `http://localhost:3000${user.image}`
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name ? user.name[0] : "👤"}
                </div>
              )}
            </div>

            <p className="font-medium text-gray-800">{user.name}</p>
          </div>
        ))}
      </div>

      {group.users?.length === 0 && (
        <p className="text-gray-400">メンバーはいません</p>
      )}

      {group.share_token && (
        <div className="mt-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              toast.success("招待リンクをコピーしました！");
            }}
            className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition"
          >
            招待リンクをコピー
          </button>
        </div>
      )}

      <div className="mt-6">
        <Link
          to={`/groups/${group.id}/plans`}
          className="block p-2 hover:bg-gray-700 rounded transition"
        >
          📝 プラン一覧
        </Link>
      </div>
    </div>
  );
}
