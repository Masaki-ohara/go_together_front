import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API_BASE_URL from "../config/api";

type Group = {
  id: number;
  name: string;
  users?: unknown[];
};

export default function Sidebar() {
  const [groups, setGroups] = useState<Group[]>([]);
  const location = useLocation();

  useEffect(() => {
    // ログインしている場合のみ取得
    const fetchGroups = async () => {
      try {
        const accessToken = localStorage.getItem("access-token");
        const client = localStorage.getItem("client");
        const uid = localStorage.getItem("uid");

        // 認証情報がない場合は取得しない
        if (!accessToken || !client || !uid) {
          setGroups([]);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/groups`, {
          headers: {
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
        });

        if (!response.ok) {
          console.error("グループ取得エラー:", response.status);
          return;
        }

        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("グループの取得に失敗しました", error);
      }
    };

    fetchGroups();
  }, [location.pathname]);

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <nav>
        <p className="text-gray-400 text-xs uppercase mb-2">所属グループ</p>

        <ul className="space-y-2">
          {groups.length > 0 ? (
            groups.map((group) => (
              <li key={group.id}>
                <Link
                  to={`/groups/${group.id}`}
                  className="block p-2 hover:bg-gray-700 rounded transition"
                >
                  📁 {group.name}
                  <span className="ml-2 text-xs text-gray-400">
                    ({group.users?.length || 0})
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              所属中のグループはありません
            </p>
          )}
        </ul>
      </nav>

      <div className="mt-8">
        <Link
          to="/creategroup"
          className="text-sm text-blue-400 hover:underline"
        >
          + 新規グループ作成
        </Link>
      </div>
    </aside>
  );
}
