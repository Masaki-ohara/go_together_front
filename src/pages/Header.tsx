// // // // import React from "react";

// // // // export default function Header() {
// // // //   return (
// // // //     <header className="h-14 bg-sky-600 text-white flex items-center px-4">
// // // //       <div className="absolute inset-0 flex justify-center ml-4 md:static">
// // // //         ロゴ
// // // //       </div>
// // // //       <div className="hidden md:block ml-4">検索フォーム</div>
// // // //       <div className="flex justify-center ml-4">go_together</div>
// // // //       <a href="/login" className="ml-auto mr-4">
// // // //         ログイン
// // // //       </a>
// // // //       <a href="/signup" className="mr-4 ml-4">
// // // //         ユーザー登録
// // // //       </a>
// // // //     </header>
// // // //   );
// // // // }
// // // import { useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Link } from "react-router-dom";
// // // import { useParams } from "react-router-dom";

// // // export default function Header() {
// // //   const navigate = useNavigate();
// // //   const { groupId } = useParams();
// // //   const userName = localStorage.getItem("name") || "ゲスト";

// // //   // 1. ログイン状態の判定 (localStorageにトークンがあるかどうか)
// // //   const isLoggedIn = !!localStorage.getItem("access-token");

// // //   const handleLogout = () => {
// // //     if (window.confirm("ログアウトしますか？")) {
// // //       localStorage.removeItem("access-token");
// // //       localStorage.removeItem("client");
// // //       localStorage.removeItem("uid");
// // //       localStorage.removeItem("name");
// // //       localStorage.removeItem("user-image");
// // //       // ログインページなどへ遷移
// // //       navigate("/");
// // //     }
// // //   };
// // //   // もし画像URLも保存しているなら
// // //   const userImage = localStorage.getItem("user-image");

// // //   return (
// // //     <header className="h-14 bg-sky-600 text-white flex items-center px-4">
// // //       <div className="absolute inset-0 flex justify-center ml-4 md:static">
// // //         <img
// // //           src={
// // //             userImage
// // //               ? `http://localhost:3000${userImage}`
// // //               : "/default-avatar.png"
// // //           }
// // //           alt={userName}
// // //           className="w-10 h-10 rounded-full object-cover" // ついでに丸く切り抜いてサイズを整える
// // //         />
// // //       </div>
// // //       {/* <div className="absolute inset-0 flex justify-center ml-4 md:static">
// // //         <img src={userImage || "/default-avatar.png"} alt={userName} />
// // //       </div> */}
// // //       <div className="flex items-center gap-2">
// // //         <span className="" mr-2>
// // //           👤 {userName} さん
// // //         </span>
// // //       </div>
// // //       <div className="hidden md:block ml-4">検索フォーム</div>
// // //       <div className="flex justify-center ml-4">go_together</div>
// // //       <nav className="ml-8 flex gap-4 text-sm font-medium">
// // //         {/* groupId が URL に存在するときだけ「プランリスト」を表示 */}
// // //         {groupId && (
// // //           <Link
// // //             to={`/groups/${groupId}/plans`}
// // //             className="hover:bg-sky-700 px-3 py-1 rounded transition"
// // //           >
// // //             {" "}
// // //             プランリスト{" "}
// // //           </Link>
// // //         )}
// // //       </nav>

// // //       <div className="ml-auto flex items-center">
// // //         {isLoggedIn ? (
// // //           // --- ログインしている時の表示 ---
// // //           <button onClick={handleLogout} className="mr-4 ml-4 hover:underline">
// // //             ログアウト
// // //           </button>
// // //         ) : (
// // //           // --- ログインしていない時の表示 ---
// // //           <>
// // //             <a href="/login" className="ml-4 hover:underline">
// // //               ログイン
// // //             </a>
// // //             <a href="/signup" className="mr-4 ml-4 hover:underline">
// // //               ユーザー登録
// // //             </a>
// // //           </>
// // //         )}
// // //       </div>
// // //     </header>
// // //   );
// // // }
// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Link } from "react-router-dom";
// // import { useParams } from "react-router-dom";

// // export default function Header() {
// //   const navigate = useNavigate();
// //   const { groupId } = useParams();

// //   // 💡 原因1の解決：名前、画像、ログイン状態をReactのState（監視対象）にする
// //   const [userName, setUserName] = useState<string>("ゲスト");
// //   const [userImage, setUserImage] = useState<string | null>(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

// //   // 💡 画面表示時やLocalStorage更新時に最新データを同期する
// //   useEffect(() => {
// //     const handleStorageChange = () => {
// //       const token = localStorage.getItem("access-token");
// //       const name = localStorage.getItem("name");
// //       const image = localStorage.getItem("user-image");

// //       setIsLoggedIn(!!token);
// //       setUserName(name || "ゲスト");
// //       setUserImage(image);
// //     };

// //     handleStorageChange();
// //     window.addEventListener("storage", handleStorageChange);
// //     return () => window.removeEventListener("storage", handleStorageChange);
// //   }, []);

// //   const handleLogout = () => {
// //     if (window.confirm("ログアウトしますか？")) {
// //       localStorage.removeItem("access-token");
// //       localStorage.removeItem("client");
// //       localStorage.removeItem("uid");
// //       localStorage.removeItem("name");
// //       localStorage.removeItem("user-image");

// //       setIsLoggedIn(false);
// //       setUserName("ゲスト");
// //       setUserImage(null);

// //       navigate("/");
// //     }
// //   };

// //   return (
// //     <header className="h-14 bg-sky-600 text-white flex items-center px-4 justify-between">
// //       {/* 💡 原因3の解決：absoluteを排除し、左端に画像と名前をきれいに並べる */}
// //       <div className="flex items-center gap-3 shrink-0">
// //         {isLoggedIn && userImage ? (
// //           <img
// //             src={
// //               userImage
// //                 ? userImage.startsWith("http")
// //                   ? userImage // 💡 httpから始まってたらそのまま使う
// //                   : `http://localhost:3000${userImage}` // 💡 スラッシュから始まってたらドメインを足す
// //                 : "/default-avatar.png"
// //             }
// //             alt={userName || "user"}
// //             className="w-10 h-10 rounded-full object-cover shrink-0"
// //           />
// //         ) : (
// //           // <img
// //           //   src={`http://localhost:3000${userImage}`}
// //           //   alt={userName}
// //           //   className="w-10 h-10 rounded-full object-cover shrink-0"
// //           // />
// //           <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
// //             👤
// //           </div>
// //         )}
// //         <div className="flex items-center gap-2">
// //         {/* mr-2 をしっかり className の中に引っ越しさせました */}
// //         <span className="mr-2 font-medium">
// //           {isLoggedIn ? `${userName} さん` : "ゲストさん"}
// //         </span>
// //       </div>

// //       {/* --- 中央のコンテンツ（元の配置を維持） --- */}
// //       <div className="flex items-center gap-4">
// //         <div className="hidden md:block ml-4 text-sm bg-sky-700 px-3 py-1 rounded">
// //           検索フォーム
// //         </div>
// //         <div className="ml-4 font-bold tracking-wider">go_together</div>

// //         <nav className="ml-8 flex gap-4 text-sm font-medium">
// //           {groupId && (
// //             <Link
// //               to={`/groups/${groupId}/plans`}
// //               className="hover:bg-sky-700 px-3 py-1 rounded transition"
// //             >
// //               プランリスト
// //             </Link>
// //           )}
// //         </nav>
// //       </div>

// //       {/* --- 右側のコンテンツ（元の配置を維持） --- */}
// //       <div className="ml-auto flex items-center shrink-0">
// //         {isLoggedIn ? (
// //           <button
// //             onClick={handleLogout}
// //             className="mr-4 ml-4 hover:underline cursor-pointer"
// //           >
// //             ログアウト
// //           </button>
// //         ) : (
// //           <>
// //             <a href="/login" className="ml-4 hover:underline">
// //               ログイン
// //             </a>
// //             <a href="/signup" className="mr-4 ml-4 hover:underline">
// //               ユーザー登録
// //             </a>
// //           </>
// //         )}
// //       </div>
// //     </header>
// //   );
// // }
// import { useEffect, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";

// export default function Header() {
//   const navigate = useNavigate();
//   const { groupId } = useParams();

//   const [userName, setUserName] = useState<string>("ゲスト");
//   const [userImage, setUserImage] = useState<string | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const token = localStorage.getItem("access-token");
//       const name = localStorage.getItem("name");
//       const image = localStorage.getItem("user-image");

//       setIsLoggedIn(!!token);
//       setUserName(name || "ゲスト");
//       setUserImage(image);
//     };

//     handleStorageChange();

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     if (window.confirm("ログアウトしますか？")) {
//       localStorage.removeItem("access-token");
//       localStorage.removeItem("client");
//       localStorage.removeItem("uid");
//       localStorage.removeItem("name");
//       localStorage.removeItem("user-image");

//       setIsLoggedIn(false);
//       setUserName("ゲスト");
//       setUserImage(null);

//       window.location.href = "/";
//     }
//   };

//   return (
//     <header className="h-14 bg-sky-600 text-white flex items-center px-4 justify-between">
//       {/* --- 左側：画像と名前のエリア --- */}
//       <div className="flex items-center gap-3">
//         {isLoggedIn ? (
//           <img
//   src={
//     userImage
//       ? userImage.startsWith("http")
//         ? userImagez
//         : `http://localhost:3000${userImage}`
//       : "/default-avatar.png"
//   }
//   alt={userName}
//   className="w-10 h-10 rounded-full object-cover shrink-0"
//   onError={(e) => {
//     const target = e.target as HTMLImageElement;
//     // 💡 すでにデフォルト画像URLになっている場合は、ループを止めるために処理を抜ける
//     if (target.src.endsWith("/default-avatar.png")) {
//       return;
//     }
//     target.src = "/default-avatar.png";
//   }}
// />

//           /* <img
//             src={
//               userImage
//                 ? userImage.startsWith("http")
//                   ? userImage // httpから始まってたらそのまま使う
//                   : `http://localhost:3000${userImage}` // スラッシュから始まってたらドメインを足す
//                 : "/default-avatar.png"
//             }
//             alt={userName}
//             className="w-10 h-10 rounded-full object-cover shrink-0"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = "/default-avatar.png";
//             }}
//           />
//         ) : (
//           <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
//             👤
//           </div>
//         )} */}

//         {/* 💡 mr-2 の警告が出ないようにしっかり className 内に修正しました */}
//         <span className="mr-2 font-medium shrink-0">
//           {isLoggedIn ? `${userName} さん` : "ゲストさん"}
//         </span>
//       </div>

//       {/* --- 中央：検索フォーム と go_together --- */}
//       <div className="flex items-center gap-4">
//         <div className="hidden md:block ml-4 text-sm bg-sky-700 px-3 py-1 rounded">
//           検索フォーム
//         </div>
//         <div className="flex justify-center ml-4 font-bold tracking-wider">
//           go_together
//         </div>

//         <nav className="ml-8 flex gap-4 text-sm font-medium">
//           {groupId && (
//             <Link
//               to={`/groups/${groupId}/plans`}
//               className="hover:bg-sky-700 px-3 py-1 rounded transition"
//             >
//               プランリスト
//             </Link>
//           )}
//         </nav>
//       </div>

//       {/* --- 右側：ログイン・ログアウトボタン --- */}
//       <div className="ml-auto flex items-center">
//         {isLoggedIn ? (
//           <button
//             onClick={handleLogout}
//             className="mr-4 ml-4 hover:underline cursor-pointer text-sm"
//           >
//             ログアウト
//           </button>
//         ) : (
//           <div className="flex gap-4 text-sm">
//             <a href="/login" className="ml-4 hover:underline">
//               ログイン
//             </a>
//             <a href="/signup" className="mr-4 ml-4 hover:underline">
//               ユーザー登録
//             </a>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
// import { useEffect, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";

// export default function Header() {
//   const navigate = useNavigate();
//   const { groupId } = useParams();

//   const [userName, setUserName] = useState<string>("ゲスト");
//   const [userImage, setUserImage] = useState<string | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const token = localStorage.getItem("access-token");
//       const name = localStorage.getItem("name");
//       const image = localStorage.getItem("user-image");

//       setIsLoggedIn(!!token);
//       setUserName(name || "ゲスト");
//       setUserImage(image);
//     };

//     handleStorageChange();

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     if (window.confirm("ログアウトしますか？")) {
//       localStorage.removeItem("access-token");
//       localStorage.removeItem("client");
//       localStorage.removeItem("uid");
//       localStorage.removeItem("name");
//       localStorage.removeItem("user-image");

//       setIsLoggedIn(false);
//       setUserName("ゲスト");
//       setUserImage(null);

//       window.location.href = "/";
//     }
//   };

//   // 💡 画像のフルURLを安全に生成する関数
//   const getImageUrl = () => {
//     if (!userImage) return "/default-avatar.png";
//     if (userImage.startsWith("http")) return userImage;

//     // 先頭のスラッシュの有無を考慮して結合する
//     const cleanPath = userImage.startsWith("/") ? userImage : `/${userImage}`;
//     return `http://localhost:3000${cleanPath}`;
//   };

//   return (
//     <header className="h-14 bg-sky-600 text-white flex items-center px-4 justify-between">
//       {/* --- 左側：画像と名前のエリア --- */}
//       <div className="flex items-center gap-3">
//         {isLoggedIn ? (
//           <img
//             src={getImageUrl()}
//             alt={userName}
//             className="w-10 h-10 rounded-full object-cover shrink-0"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               // すでにデフォルト画像なら無限ループを防ぐため終了
//               if (target.src.endsWith("/default-avatar.png")) {
//                 return;
//               }
//               console.log("画像の読み込みに失敗したURL:", target.src); // 🔎 デバッグ用
//               target.src = "/default-avatar.png";
//             }}
//           />
//         ) : (
//           <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
//               👤
//           </div>
//         )}

//         <span className="mr-2 font-medium shrink-0">
//           {isLoggedIn ? `${userName} さん` : "ゲストさん"}
//         </span>
//       </div>

//       {/* --- 中央：検索フォーム と go_together --- */}
//       <div className="flex items-center gap-4">
//         <div className="hidden md:block ml-4 text-sm bg-sky-700 px-3 py-1 rounded">
//           検索フォーム
//         </div>
//         <div className="flex justify-center ml-4 font-bold tracking-wider">
//           go_together
//         </div>

//         <nav className="ml-8 flex gap-4 text-sm font-medium">
//           {groupId && (
//             <Link
//               to={`/groups/${groupId}/plans`}
//               className="hover:bg-sky-700 px-3 py-1 rounded transition"
//             >
//               プランリスト
//             </Link>
//           )}
//         </nav>
//       </div>

//       {/* --- 右側：ログイン・ログアウトボタン --- */}
//       <div className="ml-auto flex items-center">
//         {isLoggedIn ? (
//           <button
//             onClick={handleLogout}
//             className="mr-4 ml-4 hover:underline cursor-pointer text-sm"
//           >
//             ログアウト
//           </button>
//         ) : (
//           <div className="flex gap-4 text-sm">
//             <a href="/login" className="ml-4 hover:underline">
//               ログイン
//             </a>
//             <a href="/signup" className="mr-4 ml-4 hover:underline">
//               ユーザー登録
//             </a>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [userName, setUserName] = useState<string>("ゲスト");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("access-token");
      const name = localStorage.getItem("name");
      const image = localStorage.getItem("user-image");

      setIsLoggedIn(!!token);
      setUserName(name || "ゲスト");
      // "null" という文字列で入ってしまっているケースも考慮
      setUserImage(image === "null" ? null : image);
    };

    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      localStorage.removeItem("name");
      localStorage.removeItem("user-image");

      setIsLoggedIn(false);
      setUserName("ゲスト");
      setUserImage(null);

      window.location.href = "/";
    }
  };

  // 安全に画像URLを生成する関数
  const getImageUrl = () => {
    if (!userImage) return null; // 画像がない場合はnullを返す
    if (userImage.startsWith("http")) return userImage;
    const cleanPath = userImage.startsWith("/") ? userImage : `/${userImage}`;
    return `http://localhost:3000${cleanPath}`;
  };

  const imageUrl = getImageUrl();

  return (
    <header className="h-14 bg-sky-600 text-white flex items-center px-4 justify-between">
      {/* --- 左側：画像と名前のエリア --- */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // バックエンドの画像読み込み自体に失敗した場合は、文字アバターに切り替える
                  setUserImage(null);
                }}
              />
            ) : (
              // 💡 画像パスが null の場合は、名前の最初の一文字を表示（お洒落で確実な回避策）
              <span className="text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
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
        <div className="hidden md:block ml-4 text-sm bg-sky-700 px-3 py-1 rounded">
          検索フォーム
        </div>
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
