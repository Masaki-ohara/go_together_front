import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type FormValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  image?: FileList;
};

export default function SignUp() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null); // プレビュー用のURL
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // 画像が選択された瞬間にプレビューを生成する
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // ブラウザ内限定のURLを作る
    }
  };
  // const {
  //   formState: { errors },
  // } = useForm<FormValues>();

  // const onSubmit = async (data: FormValues) => {
  //   const formData = new FormData();

  //   formData.append("name", data.name);
  //   formData.append("email", data.email);
  //   formData.append("password", data.password);
  //   formData.append("password_confirmation", data.password_confirmation);

  //   if (data.image && data.image[0]) {
  //     formData.append("image", data.image[0]);
  //   }
  //   try {
  //     const res = await fetch("http://localhost:3000/api/v1/auth", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const result = await res.json();
  //     console.log(result);

  //     if (!res.ok) {
  //       toast.error(result.message || "登録に失敗しました");
  //       return;
  //     }
  //     localStorage.setItem(
  //       "access-token",
  //       res.headers.get("access-token") || "",
  //     );
  //     localStorage.setItem("client", res.headers.get("client") || "");
  //     localStorage.setItem("uid", res.headers.get("uid") || "");
  //     localStorage.setItem(
  //       "access-token",
  //       res.headers.get("access-token") || "",
  //     );

  //     if (result.data && result.data.name) {
  //       localStorage.setItem("name", result.data.name);
  //     }
  //     if (result.data && result.data.image) {
  //       localStorage.setItem("user-image", result.data.image);
  //     }
  //     toast.success("ユーザー登録が完了しました 🎉");

  //     setTimeout(() => {
  //       navigate("/");
  //     }, 1500);
  //   } catch (err) {
  //     toast.error("サーバーエラーが発生しました");
  //   }
  // };
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      // 🔎 登録ボタンを押した直後、ブラウザのコンソール（F12）でこのログの中身を確認してください！
      console.log("バックエンドからのレスポンス:", result);

      if (!res.ok) {
        toast.error(result.message || "登録に失敗しました");
        return;
      }

      // トークン系の保存
      localStorage.setItem(
        "access-token",
        res.headers.get("access-token") || "",
      );
      localStorage.setItem("client", res.headers.get("client") || "");
      localStorage.setItem("uid", res.headers.get("uid") || "");

      // 名前の保存
      if (result.data && result.data.name) {
        localStorage.setItem("name", result.data.name);
      }

      // 💡 画像の保存ロジックを強化
      if (result.data) {
        // Railsの設計によって image、avatar、image_url などキー名が変わるため、どれがあっても拾えるようにします
        const imageUrl =
          result.data.image || result.data.avatar || result.data.image_url;

        if (imageUrl) {
          localStorage.setItem("user-image", imageUrl);
        } else {
          console.warn("レスポンス内に画像URLのキーが見つかりませんでした。");
        }
      }

      toast.success("ユーザー登録が完了しました 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("サーバーエラーが発生しました");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          ユーザー登録
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sky-500"
            placeholder="名前"
            {...register("name", { required: "名前は必須です" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sky-500"
            placeholder="メールアドレス"
            {...register("email", {
              required: "メールは必須です",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "正しいメールアドレスを入力してください",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sky-500"
            placeholder="パスワード"
            {...register("password", {
              required: "パスワードは必須です",
              minLength: { value: 8, message: "パスワードは8文字以上です" },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sky-500"
            placeholder="パスワード確認"
            {...register("password_confirmation", {
              required: "確認パスワードは必須です",
            })}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm">
              {errors.password_confirmation.message}
            </p>
          )}
          {/* プロフィール画像のアップロード部分 */}
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative w-24 h-24 group">
              {/* プレビュー画像または初期アイコン */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-sky-500 bg-gray-50 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>

              {/* 重ねて表示するアップロードボタン（おしゃれポイント） */}
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
                    register("image").onChange(e); // react-hook-form用の処理
                    handleImageChange(e); // プレビュー用の処理
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">プロフィール画像を選択</p>
          </div>

          <button
            type="submit"
            className="
            bg-sky-500
            text-white
            py-2
            rounded
            hover:bg-sky-600
            disabled:bg-sky-300
            disabled:cursor-not-allowed
          "
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
}
