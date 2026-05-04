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
import { toast } from "react-toastify";

interface Group {
  id: number;
  name: string;
  share_token: string;
}

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [link, setLink] = useState("");
  const [shareToken, setShareToken] = useState("");

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

        saveAuthHeaders(res);
        if (res.status === 401) {
          navigate("/login");
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
        {groups.map((group) => {
          const link = `${window.location.origin}/groups/join?token=${group.share_token}`;
          return (
            <div
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}/plans`)}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
            >
              {group.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(link);
                  toast.success("招待リンクをコピーしました！");
                }}
                className="mt-2 ml-7 bg-blue-500 text-white px-2 py-1 rounded"
              >
                招待リンクをコピー
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
