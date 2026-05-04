// src/features/groups/JoinGroup.tsx
// import { useParams, useNavigate } from "react-router-dom";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function JoinGroup() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!token) {
      alert("招待トークンが見つかりません。");
      return;
    }
    const res = await fetch("http://localhost:3000/api/v1/groups/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (res.ok) {
      // alert({ group: "に参加しました！" });
      // navigate("/groups");
      alert(`${data.group_name} に参加しました！`);
      navigate("/groups");
    } else {
      alert("失敗しました");
      navigate("/login");
    }
  };

  return (
    <div>
      <h1>グループに参加</h1>
      <button onClick={handleJoin}>参加する</button>
    </div>
  );
}
