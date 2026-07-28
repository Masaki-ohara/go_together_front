import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const [groups, setGroups] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    // ログインしている場合のみ取得
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/groups", {
          headers: {
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        }
      } catch (error) {
        console.error("グループの取得に失敗しました", error);
      }
    };

    fetchGroups();
  }, [location]);

  return (
    // return <aside className="w-64 bg-gray-200 p-4">Sidebar</aside>;
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">サイドバー</h2>

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
