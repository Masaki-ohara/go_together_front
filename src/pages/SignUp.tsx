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
    <div>
      <h1>ユーザー登録</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="名前"
          {...register("name", { required: "名前は必須です" })}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

        <input
          type="email"
          placeholder="メールアドレス"
          {...register("email", { required: "メールは必須です",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "正しいメールアドレスを入力してください"
            }
        })}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

        <input
          type="password"
          placeholder="パスワード"
          {...register("password", { required: "パスワードは必須です", 
            minLength: { value: 8, message: "パスワードは8文字以上である必要があります" }})}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

        <input
          type="password_confirmation"
          placeholder="パスワード確認"
          {...register("password_confirmation", { required: "確認パスワードは必須です" })}
        />
        {errors.password_confirmation && <p style={{ color: "red" }}>{errors.password_confirmation.message}</p>}

        <input
          type="file"
          accept="image/*"
          {...register("image")}
        />

        
        <button className="bg-sky-500 disabled:hover:bg-sky-500 ..." type="submit">登録</button>
      </form>
    </div>
  );
}
