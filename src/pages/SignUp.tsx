// import React from 'react';
// import { useState } from 'react';
// import { useForm } from "react-hook-form";


// export default function SignUp() {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors }
//     } = useForm();
//     // const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [passwordConfirmation, setPasswordConfirmation] = useState('');
//     const [image, setImage] = useState<File | null>(null);
//     const handlesubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // formData.append("name", name);
//         formData.append("email", email);
//         formData.append("password", password);
//         formData.append("password_confirmation", passwordConfirmation);



//         if (image) {
//             formData.append("image", image);
//         }

//         try {
//             const res = await fetch("http://localhost:3000/api/v1/auth", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 console.error("登録失敗");
//                 return;
//             }

//             const data = await res.json();
//             console.log("登録成功:", data);
//         } catch (error) {
//             console.error("エラー:", error);
//         }
//     };

//     return (
//         <div>
//             <h1>ユーザー登録</h1>
//             <form onSubmit={handlesubmit}>
//                 <input
//                     // type="name"
//                     // placeholder="名前"
//                     // value={name}
//                     // onChange={(e) => setName(e.target.value)}
//                     //  {...register("", { required: "名前は必須です" })}
//                     placeholder="名前"
//                     {...register("name", { required: "名前は必須です" })}
//                 />
//                 {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
            
//                 {/* {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>} */}
//                 <input
//                     type="file"
//                     placeholder="プロフィール画像"
//                     accept="image./*"
//                     onChange={(e) => {
//                         if (e.target.files && e.target.files[0]) {
//                             setImage(e.target.files[0]);
//                         }
//                     }
//                     } />
//                 <input
//                     type="email"
//                     placeholder="メールアドレス"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="パスワード"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="パスワード確認"
//                     value={passwordConfirmation}
//                     onChange={(e) => setPasswordConfirmation(e.target.value)}
//                 />
//                 <button type="submit">登録</button>
//             </form>
//         </div>
//     );
// }
import React from 'react';
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
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

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
    console.log(result);



    if (!res.ok) {
      // ❌ 失敗時は遷移しない
      toast.error(result.message || "登録に失敗しました");
      return;
    }

    // ✅ 成功したら
    toast.success("ユーザー登録が完了しました 🎉");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {
    toast.error("サーバーエラーが発生しました");
  }
};

  return (
    
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        ユーザー登録
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
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

        <input
          type="file"
          className="w-full"
          accept="image/*"
          {...register("image")}
        />

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
