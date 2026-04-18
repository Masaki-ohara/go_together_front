import { Outlet } from "react-router-dom";
import Header from "../pages/Header";
import Sidebar from "../pages/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 上部に固定のヘッダー */}
      <Header />

      <div className="flex flex-1">
        {/* 左側に固定のサイドバー */}
        <Sidebar />

        {/* 右側のメインコンテンツエリア */}
        <main className="flex-1 p-6 bg-gray-50">
          {/* ここに App.tsx で設定した各ページの中身がはめ込まれる */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
