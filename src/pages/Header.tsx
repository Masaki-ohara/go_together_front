import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Header() {
  const { groupId } = useParams();

  const [userName, setUserName] = useState<string>("ゲスト");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const syncUserInfo = () => {
      const token = localStorage.getItem("access-token");
      const name = localStorage.getItem("name");
      const image = localStorage.getItem("user-image");

      setIsLoggedIn(!!token);
      setUserName(name || "ゲスト");

      // null や "undefined" 文字列などを除外してセット
      if (image && image !== "null" && image !== "undefined" && image !== "") {
        setUserImage(image);
      } else {
        setUserImage(null);
      }
    };

    syncUserInfo();

    // ログイン・ログアウト時やストレージ更新時に追従
    window.addEventListener("storage", syncUserInfo);
    window.addEventListener("user-auth-change", syncUserInfo);

    return () => {
      window.removeEventListener("storage", syncUserInfo);
      window.removeEventListener("user-auth-change", syncUserInfo);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.clear();
      setIsLoggedIn(false);
      setUserName("ゲスト");
      setUserImage(null);
      window.location.href = "/";
    }
  };

  // 💡 GroupDetail.tsx と同じ画像URL整形ロジック
  const getImageUrl = () => {
    if (!userImage) return null;
    if (userImage.startsWith("http")) return userImage;
    // 相対パスの場合は http://localhost:3000 を補完
    return `http://localhost:3000${userImage.startsWith("/") ? "" : "/"}${userImage}`;
  };

  const imageUrl = getImageUrl();

  return (
    <header className="h-14 bg-sky-600 text-white flex items-center px-4 justify-between">
      {/* --- 左側：画像と名前のエリア --- */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden border border-sky-400">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 画像読み込みエラーが発生した場合は文字表示へフォールバック
                  console.error("Header画像の読み込みエラー:", imageUrl);
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-sm font-medium">
                {userName ? userName[0].toUpperCase() : "👤"}
              </span>
            )}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
            👤
          </div>
        )}

        <span className="mr-2 font-medium shrink-0">
          {isLoggedIn ? `${userName} さん` : "ゲストさん"}
        </span>
      </div>

      {/* --- 中央：検索フォーム と go_together --- */}
      <div className="flex items-center gap-4">
        <div className="flex justify-center ml-4 font-bold tracking-wider">
          go_together
        </div>

        <nav className="ml-8 flex gap-4 text-sm font-medium">
          {groupId && (
            <Link
              to={`/groups/${groupId}/plans`}
              className="hover:bg-sky-700 px-3 py-1 rounded transition"
            >
              プランリスト
            </Link>
          )}
        </nav>
      </div>

      <nav className="ml-8 flex gap-4 text-sm font-medium">
        <Link
          to={`/mypage`}
          className="hover:bg-sky-700 px-3 py-1 rounded transition"
        >
          マイページ
        </Link>
      </nav>

      {/* --- 右側：ログイン・ログアウトボタン --- */}
      <div className="ml-auto flex items-center">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="mr-4 ml-4 hover:underline cursor-pointer text-sm"
          >
            ログアウト
          </button>
        ) : (
          <div className="flex gap-4 text-sm">
            <a href="/login" className="ml-4 hover:underline">
              ログイン
            </a>
            <a href="/signup" className="mr-4 ml-4 hover:underline">
              ユーザー登録
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
