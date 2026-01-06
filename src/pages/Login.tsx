import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function Login () {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await axios.post("http://localhost:3000/api/v1/auth/sign_in", data);
      toast.success("ログインしました");
      navigate("/");
    } catch (error) {
      toast.error("ログインに失敗しました");
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
          <input type="email"
          {...register("email")}
          className="w-full px-3 py-2 mb-4 border rounded focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password"
          {...register("password")}
          className="w-full px-3 py-2 mt-3 border rounded focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <button type="submit"
                  className="
            bg-sky-500
            text-white
            py-3
            mt-5          rounded
            hover:bg-sky-600
            disabled:bg-sky-300
            disabled:cursor-not-allowed
          "
        >Login</button>
      </form>
      </div>
    </div>
  );
};