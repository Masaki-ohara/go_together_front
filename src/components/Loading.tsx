type Props = {
  isOpen: boolean;
  message?: string;
};

export default function Loading({
  isOpen,
  message = "AIがプランを生成中です...",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      {/* スピナーアニメーション */}
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />

      <p className="text-lg font-bold">{message}</p>
      <p className="text-sm text-gray-200 mt-1">
        これには数秒かかる場合があります
      </p>
    </div>
  );
}
