// import { useForm } from "react-hook-form";
// import type { SubmitHandler } from "react-hook-form";

// // フォームの入力型の定義（バックエンドへ送るパラメータ構造に合わせる）
// type AiPlanFormData = {
//   location: string;
//   budget: string;
//   theme: string;
//   date: string;
//   itemCount: string;
// };

// export default function AiPlanForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<AiPlanFormData>({
//     defaultValues: {
//       location: "",
//       budget: "",
//       theme: "",
//       date: "",
//       itemCount: "3", // デフォルト値を「充実(3個)」等にしておくと親切です
//     },
//   });

//   const onSubmit: SubmitHandler<AiPlanFormData> = async (data) => {
//     console.log("送信データ:", data);
//     // TODO: ここで バックエンド（API）へ POST リクエストを送信
//     // 例: await api.post(`/groups/${groupId}/ai_plans`, { ai_plan: data });

//   try {
//   const response = await fetch(
//     `http://localhost:3000/api/v1/groups/${groupId}/ai_plans`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "access-token": localStorage.getItem("access-token") || "",
//         client: localStorage.getItem("client") || "",
//         uid: localStorage.getItem("uid") || "",
//       },
//  body: JSON.stringify({
//         location: data.location,
//         budget: data.budget,
//         theme: data.theme,
//         date: data.date,
//         item_count: data.itemCount, // ⭕️ itemCount を item_count としても送れるように変換
//       }),
//     }
//       )};

//   if (!response.ok) {
//     throw new Error("AIプランの作成に失敗しました");
//   }

//   const result = await response.json();
//   console.log("AIプラン作成結果:", result);

//   return (
//     <div className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded shadow-sm">
//       <h2 className="text-lg font-semibold">AI プラン作成</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//         {/* 1. 目的地 / 場所 */}
//         <div className="flex flex-col gap-1">
//           <label htmlFor="location" className="text-sm font-medium">
//             目的地・場所 <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="location"
//             type="text"
//             placeholder="例: 京都、渋谷"
//             className={`border p-2 rounded ${errors.location ? "border-red-500" : "border-gray-300"}`}
//             {...register("location", { required: "目的地を入力してください" })}
//           />
//           {errors.location && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.location.message}
//             </p>
//           )}
//         </div>

//         {/* 2. 予算 */}
//         <div className="flex flex-col gap-1">
//           <label htmlFor="budget" className="text-sm font-medium">
//             予算（円）
//           </label>
//           <input
//             id="budget"
//             type="number"
//             placeholder="例: 10000"
//             className="border border-gray-300 p-2 rounded"
//             {...register("budget")}
//           />
//         </div>

//         {/* 3. テーマ・雰囲気 */}
//         <div className="flex flex-col gap-1">
//           <label htmlFor="theme" className="text-sm font-medium">
//             テーマ・雰囲気
//           </label>
//           <input
//             id="theme"
//             type="text"
//             placeholder="例: カフェ巡り、歴史散策"
//             className="border border-gray-300 p-2 rounded"
//             {...register("theme")}
//           />
//         </div>

//         {/* 4. プラン日付 */}
//         <div className="flex flex-col gap-1">
//           <label htmlFor="date" className="text-sm font-medium">
//             日付 <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="date"
//             type="date"
//             className={`border p-2 rounded ${errors.date ? "border-red-500" : "border-gray-300"}`}
//             {...register("date", { required: "日付を選択してください" })}
//           />
//           {errors.date && (
//             <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
//           )}
//         </div>

//         {/* 5. スポット数（やりたいことの数） */}
//         <div className="flex flex-col gap-1">
//           <label htmlFor="itemCount" className="text-sm font-medium">
//             1日の予定数（ペース） <span className="text-red-500">*</span>
//           </label>
//           <select
//             id="itemCount"
//             className={`border p-2 rounded ${errors.itemCount ? "border-red-500" : "border-gray-300"}`}
//             {...register("itemCount", { required: "予定数を選択してください" })}
//           >
//             <option value="">選択してください</option>
//             <option value="1">ゆっくり (1個)</option>
//             <option value="2">のんびり (2個)</option>
//             <option value="3">充実 (3個)</option>
//             <option value="4">アクティブ (4個)</option>
//             <option value="5">ハード (5個)</option>
//           </select>
//           {errors.itemCount && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.itemCount.message}
//             </p>
//           )}
//         </div>

//         {/* 送信ボタン（ローディング制御付き） */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-2 rounded mt-2 font-medium transition"
//         >
//           {isSubmitting ? "AIプラン生成中..." : "AIプランを作成する"}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

type AiPlanFormData = {
  location: string;
  budget: string;
  theme: string;
  date: string;
  itemCount: string;
};

export default function AiPlanForm() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AiPlanFormData>({
    defaultValues: {
      location: "",
      budget: "",
      theme: "",
      date: "",
      itemCount: "3",
    },
  });

  const onSubmit: SubmitHandler<AiPlanFormData> = async (data) => {
    console.log("送信データ:", data);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/groups/${groupId}/ai_plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
          body: JSON.stringify({
            location: data.location,
            budget: data.budget,
            theme: data.theme,
            date: data.date,
            item_count: data.itemCount,
          }),
        },
      );

      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(
      //       errorData.console.error || "AIプランの作成に失敗しました",
      //     );
      //   }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // JSONパース失敗時も空オブジェクトを返して落とさない

        // errorData?.error や errorData?.message など柔軟に取得
        const errorMessage =
          errorData?.error ||
          errorData?.message ||
          (Array.isArray(errorData?.errors)
            ? errorData.errors.join(", ")
            : null) ||
          "AIプランの作成に失敗しました";

        throw new Error(errorMessage);
      }
      const result = await response.json();
      console.log("AIプラン作成結果:", result);
      // navigate(`/groups/${groupId}/plans`);
      toast.success("プランが正常に作成されました 🎉");
      setTimeout(() => {
        navigate(`/groups/${groupId}/plans`);
      }, 1500);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert(error instanceof Error ? error.message : "エラーが発生しました");
    }
  };

  return (
    <div className=" flex flex-col gap-4 max-w-md mx-auto p-4 border rounded shadow-sm">
      <Loading isOpen={isSubmitting} />
      <h2 className="text-lg font-semibold">AI プラン作成</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* 1. 目的地 / 場所 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="location" className="text-sm font-medium">
            目的地・場所 <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            placeholder="例: 京都、渋谷"
            className={`border p-2 rounded ${errors.location ? "border-red-500" : "border-gray-300"}`}
            {...register("location", { required: "目的地を入力してください" })}
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="budget" className="text-sm font-medium">
            予算（円）
          </label>
          <input
            id="budget"
            type="number"
            placeholder="例: 10000"
            className="border border-gray-300 p-2 rounded"
            {...register("budget")}
          />
          {errors.budget && (
            <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>
          )}
        </div>

        {/* 3. テーマ・雰囲気 */}
        <div className="flex flex-col gao-1">
          <label htmlFor="theme" className="text-sm font-medium">
            テーマ・雰囲気
          </label>
          <input
            id="theme"
            type="text"
            placeholder="例: カフェ巡り、歴史散策"
            className={`border p-2 rounded ${errors.theme ? "border-red-500" : "border-gray-300"}`}
            {...register("theme", {
              required: "テーマ・雰囲気を入力してください",
            })}
          />
          {errors.theme && (
            <p className="text-red-500 text-xs mt-1">{errors.theme.message}</p>
          )}
        </div>

        {/* 4. プラン日付 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium">
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            className={`border p-2 rounded ${errors.date ? "border-red-500" : "border-gray-300"}`}
            {...register("date", { required: "日付を選択してください" })}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* 5. スポット数（やりたいことの数） */}
        <div className="flex flex-col gap-1">
          <label htmlFor="itemCount" className="text-sm font-medium">
            1日の予定数（ペース） <span className="text-red-500">*</span>
          </label>
          <select
            id="itemCount"
            className={`border p-2 rounded ${errors.itemCount ? "border-red-500" : "border-gray-300"}`}
            {...register("itemCount", { required: "予定数を選択してください" })}
          >
            <option value="">選択してください</option>
            <option value="1">ゆっくり (1個)</option>
            <option value="2">のんびり (2個)</option>
            <option value="3">充実 (3個)</option>
            <option value="4">アクティブ (4個)</option>
            <option value="5">ハード (5個)</option>
          </select>
          {errors.itemCount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.itemCount.message}
            </p>
          )}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-2 rounded mt-2 font-medium transition"
        >
          {isSubmitting ? "AIプラン生成中..." : "AIプランを作成する"}
        </button>
      </form>
    </div>
  );
}
