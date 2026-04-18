// import React from "react";

// export default function Header() {
//   return (
//     <header className="h-14 bg-sky-600 text-white flex items-center px-4">
//       <div className="absolute inset-0 flex justify-center ml-4 md:static">
//         ロゴ
//       </div>
//       <div className="hidden md:block ml-4">検索フォーム</div>
//       <div className="flex justify-center ml-4">go_together</div>
//       <a href="/login" className="ml-auto mr-4">
//         ログイン
//       </a>
//       <a href="/signup" className="mr-4 ml-4">
//         ユーザー登録
//       </a>
//     </header>
//   );
// }
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  // 1. ログイン状態の判定 (localStorageにトークンがあるかどうか)
  const isLoggedIn = !!localStorage.getItem("access-token");

  // 2. ログアウト処理
  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      // ログインページなどへ遷移
      navigate("/login");
    }
  };

  return (
    <header className="h-14 bg-sky-600 text-white flex items-center px-4">
      <div className="absolute inset-0 flex justify-center ml-4 md:static">
        ロゴ
      </div>
      <div className="hidden md:block ml-4">検索フォーム</div>
      <div className="flex justify-center ml-4">go_together</div>
      <nav className="ml-8 flex gap-4 text-sm font-medium">
        {/* groupId が URL に存在するときだけ「プランリスト」を表示 */}
        {groupId && (
          <Link
            to={`/groups/${groupId}/plans`}
            className="hover:bg-sky-700 px-3 py-1 rounded transition"
          >
            {" "}
            プランリスト{" "}
          </Link>
        )}
      </nav>

      <div className="ml-auto flex items-center">
        {isLoggedIn ? (
          // --- ログインしている時の表示 ---
          <button onClick={handleLogout} className="mr-4 ml-4 hover:underline">
            ログアウト
          </button>
        ) : (
          // --- ログインしていない時の表示 ---
          <>
            <a href="/login" className="ml-4 hover:underline">
              ログイン
            </a>
            <a href="/signup" className="mr-4 ml-4 hover:underline">
              ユーザー登録
            </a>
          </>
        )}
      </div>
    </header>
  );
}
