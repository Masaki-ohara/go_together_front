import React from "react";
import { useNavigate } from "react-router-dom";

// 💡 外部からボタンの文字やスタイルを少し変えられるように設計します
interface BackButtonProps {
  label?: string; // ボタンの文字（省略したら「戻る」になります）
  className?: string; // 追加したいスタイルがあれば渡せるようにします
}

export default function BackButton({
  label = "戻る",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // 💡 どこからでも一歩前の画面に戻る
      className={`mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors shadow w-full sm:w-auto ${className}`}
    >
      {label}
    </button>
  );
}
