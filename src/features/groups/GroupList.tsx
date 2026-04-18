// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { saveAuthHeaders } from "../../utils/auth";

// type Group = {
//   id: number;
//   name: string;
// };

// export default function GroupList() {
//   const [groups, setGroups] = useState<Group[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:3000/api/v1/groups", {
//       headers: {
//         "access-token": localStorage.getItem("access-token") ?? "",
//         client: localStorage.getItem("client") ?? "",
//         uid: localStorage.getItem("uid") ?? "",
//       },
//     })
//       .then((res) => {
//         saveAuthHeaders(res);
//         return res.json();
//       })
//       .then((data) => setGroups(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="max-w-md mx-auto mt-6">
//       <h1 className="text-2xl font-bold mb-4">グループ一覧</h1>

//       {groups.length === 0 ? (
//         <p>グループがありません</p>
//       ) : (
//         <div className="space-y-3">
//           {groups.map((group) => (
//             <div
//               key={group.id}
//               onClick={() => navigate(`/groups/${group.id}/plans`)}
//               className="p-4 border rounded cursor-pointer hover:bg-gray-100"
//             >
//               {group.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// GroupList.tsx
// PlanList.tsx
// GroupList.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuthHeaders } from "../../utils/auth";

interface Group {
  id: number;
  name: string;
}

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/groups", {
          headers: {
            "access-token": localStorage.getItem("access-token") ?? "",
            client: localStorage.getItem("client") ?? "",
            uid: localStorage.getItem("uid") ?? "",
          },
        });

        saveAuthHeaders(res); // 最新トークンを保存

        if (res.status === 401) {
          navigate("/login"); // 未認証ならログインページへ
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          setError("グループの取得に失敗しました。");
          setGroups([]);
        } else {
          setGroups(data);
        }
      } catch {
        setError("サーバーエラーです。");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [navigate]);

  if (loading) return <p className="text-center mt-6">読み込み中...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
  if (groups.length === 0)
    return (
      <p className="text-center mt-6 text-gray-500">グループはありません</p>
    );

  return (
    <div className="max-w-md mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">グループ一覧</h1>
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => navigate(`/groups/${group.id}/plans`)}
            className="p-4 border rounded cursor-pointer hover:bg-gray-100"
          >
            {group.name}
          </div>
        ))}
      </div>
    </div>
  );
}
