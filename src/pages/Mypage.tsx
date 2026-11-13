import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type ProfileFormValues = {
  name: string;
  email: string;
  image?: FileList;
};

export default function Mypage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>();

  // 🔄 1. ページ読み込み時に現在のプロフィール情報を取得してフォームにセットする
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/auth/validate_token",
          {
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              client: localStorage.getItem("client") || "",
              uid: localStorage.getItem("uid") || "",
            },
          },
        );

        if (!res.ok) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }

        const data = await res.json();
        const user = data.data; // devise-token-auth のレスポンス構造に合わせて調整

        // フォームの初期値をセット
        setValue("name", user.name || "");
        setValue("email", user.email || "");

        // 既存のアイコン画像があればセット
        if (user.image) {
          const imageUrl =
            typeof user.image === "string" ? user.image : user.image.url;
          setCurrentImage(imageUrl);
        }
      } catch (err) {
        console.error(err);
        toast.error("ユーザー情報の読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  // 新しく画像が選択されたときのプレビュー生成
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 💾 2. 更新保存処理（PATCH / PUT）
  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/auth", {
        method: "PUT", // devise-token-auth の場合は PUT または PATCH
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
          // 注意: FormDataを使う場合 "Content-Type": "application/json" は設定しない（ブラウザが自動でboundaryを設定するため）
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.errors?.full_messages?.join(", ") || "更新に失敗しました",
        );
      }

      // 💡 ローカルストレージの表示用データを更新
      if (result.data) {
        if (result.data.name) {
          localStorage.setItem("name", result.data.name);
        }
        const newImg = result.data.image?.url || result.data.image;
        if (newImg) {
          localStorage.setItem("user-image", newImg);
          setCurrentImage(newImg);
        }
      }

      // 💡 ヘッダー等の他のコンポーネントに変更を通知するイベントを発火！
      window.dispatchEvent(new Event("user-auth-change"));

      setPreview(null); // プレビューをクリア
      toast.success("プロフィールを更新しました 🎉");

      // 💡 トーストやストレージ更新のあとに画面遷移する
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "サーバーエラーが発生しました");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          マイページ（プロフィール編集）
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* プロフィール画像アップロード・プレビュー部分 */}
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="relative w-24 h-24 group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-sky-500 bg-gray-50 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="New Preview"
                    className="w-full h-full object-cover"
                  />
                ) : currentImage ? (
                  <img
                    src={currentImage}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-sky-500 p-2 rounded-full text-white cursor-pointer hover:bg-sky-600 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register("image")}
                  onChange={(e) => {
                    register("image").onChange(e);
                    handleImageChange(e);
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">アイコン画像を変更</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名前
            </label>
            <input
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sky-500"
              {...register("name", { required: "名前は必須です" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sky-500"
              {...register("email", {
                required: "メールは必須です",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-sky-500 text-white py-2 rounded hover:bg-sky-600 disabled:bg-sky-300 transition-colors font-medium shadow-sm"
          >
            {isSubmitting ? "保存中..." : "変更を保存する"}
          </button>
        </form>
      </div>
    </div>
  );
}
