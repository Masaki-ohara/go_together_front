// import React from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { saveAuthHeaders } from "../../utils/auth";
// import { useEffect } from "react";
// interface FormValues {
//   name: string;
// }

// export default function CreateGroup() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("access-token");
//     const uid = localStorage.getItem("uid");
//     const client = localStorage.getItem("client");

//     if (!token || !uid || !client) {
//       // 認証情報が1つでも欠けていたらログイン画面へ
//       navigate("/login");
//     }
//   }, [navigate]);

//   if (res.status === 401) {
//     alert("セッションが切れました。ログインし直してください。");
//     localStorage.clear(); // 古い情報を消す
//     navigate("/login"); // ログイン画面へ
//     return;
//   }

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>();

//   const onSubmit = async (data: FormValues) => {
//     const res = await fetch("http://localhost:3000/api/v1/groups", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "access-token": localStorage.getItem("access-token") || "",
//         client: localStorage.getItem("client") || "",
//         uid: localStorage.getItem("uid") || "",
//       },
//       body: JSON.stringify({
//         group: { name: data.name },
//       }),
//     });

//     saveAuthHeaders(res);

//     const result = await res.json();
//     console.log(result);

//     if (res.ok) {
//       navigate("/groups");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4 mt-4">グループ作成</h1>
//       <p className="text-gray-500 text-sm mb-4">
//         友達と共有するグループを作成します
//       </p>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block mb-1 font-semibold">グループ名</label>
//           <input
//             {...register("name", { required: "グループ名は必須です" })}
//             className="w-full border border-gray-300 rounded px-3 py-2"
//           />
//           {errors.name && (
//             <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           作成
//         </button>
//       </form>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { saveAuthHeaders } from "../../utils/auth";

interface FormValues {
  name: string;
}

export default function CreateGroup() {
  const navigate = useNavigate();

  // ページ表示時にローカルストレージを確認
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    const uid = localStorage.getItem("uid");
    const client = localStorage.getItem("client");

    if (!token || !uid || !client) {
      navigate("/login");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
        },
        body: JSON.stringify({
          group: { name: data.name },
        }),
      });

      if (res.status === 401) {
        // サーバーから「認証不可」が返ってきた場合
        alert("セッションが切れました。もう一度ログインしてください。");
        localStorage.removeItem("access-token");
        localStorage.removeItem("uid");
        localStorage.removeItem("client");
        navigate("/login");
        return;
      }

      // トークンの更新保存
      saveAuthHeaders(res);

      if (res.ok) {
        navigate("/groups");
      } else {
        const result = await res.json();
        console.error("エラーが発生しました:", result);
      }
    } catch (error) {
      console.error("通信に失敗しました:", error);
      alert("通信エラーが発生しました。");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 mt-4">グループ作成</h1>
      <p className="text-gray-500 text-sm mb-4">
        友達と共有するグループを作成します
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">グループ名</label>
          <input
            {...register("name", { required: "グループ名は必須です" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          作成
        </button>
      </form>
    </div>
  );
}
