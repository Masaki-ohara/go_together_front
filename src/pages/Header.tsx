import React from "react";

export default function Header() {
    return (    
<div className="relative mb-6 flex items-center justify-between gap-6 pt-2 bg-sky-600 h-20">
      <div className="absolute inset-0 flex justify-center ml-4 md:static">ロゴ</div>
      <div className="hidden md:block ml-4">検索フォーム</div>
      <div className="flex justify-center ml-4">go_together</div>
      <div className="ml-auto">ボタン</div>
      <a href="/signup" className="mr-4">ユーザー登録</a>
    </div>
  );
};