import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // const onSubmit = async (data: any) => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:3000/api/v1/auth/sign_in",
  //       data,
  //     );

  //     localStorage.setItem("access-token", res.headers["access-token"]);
  //     localStorage.setItem("client", res.headers["client"]);
  //     localStorage.setItem("uid", res.headers["uid"]);

  //     toast.success("ログインしました");
  //     navigate("/");
  //   } catch (error) {
  //     toast.error("ログインに失敗しました");
  //   }
  // };
  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/sign_in",
        data, // { email, password } が直接送られます
      );

      // axiosの場合、ヘッダーは res.headers["key"] で取得します。
      // Rails側で小文字で返ってくることがあるため、確実な方法をとります。
      const headers = res.headers;

      if (headers["access-token"]) {
        localStorage.setItem("access-token", headers["access-token"]);
        localStorage.setItem("client", headers["client"]);
        localStorage.setItem("uid", headers["uid"]);

        const userData = res.data.data;

        // if (res.data && res.data.data && res.data.data.name) {
        //   localStorage.setItem("name", res.data.data.name);
        // } else {
        //   localStorage.setItem("name", res.data.data.email);
        // }

        // toast.success("ログインしました 🎉");
        // navigate("/");
        if (res.data && res.data.data && res.data.data.name) {
          localStorage.setItem("name", res.data.data.name);
        } else {
          localStorage.setItem("name", res.data.data.email);
        }

        // 👇【追加】プロフィール画像も同時に保存してヘッダーに即反映させる
        if (res.data && res.data.data && res.data.data.image) {
          localStorage.setItem("user-image", res.data.data.image);
        }

        toast.success("ログインしました 🎉");

        // 👇【変更】navigate("/") からこれに書き換える！
        window.location.href = "/";
      } else {
        console.error("認証ヘッダーがレスポンスに含まれていません", headers);
        toast.error("ログインは成功しましたが、認証情報を取得できませんでした");
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      toast.error(
        "ログインに失敗しました。メールアドレスかパスワードを確認してください",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          ログイン
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 mb-4 border rounded focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 mt-3 border rounded focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            className="
            bg-sky-500
            text-white
            py-3
            mt-5          rounded
            hover:bg-sky-600
            disabled:bg-sky-300
            disabled:cursor-not-allowed
          "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
