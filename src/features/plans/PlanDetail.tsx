import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlanEditForm from "./PlanEditForm";
import API_BASE_URL from "../../config/api";

interface PlanItem {
  id?: number;
  content: string;
  time?: string;
  category?: string;
}

interface Plan {
  id: number;
  title: string;
  location: string;
  budget: number;
  time?: string;
  plan_items?: PlanItem[];
}

// ⭕️ 時間帯のキーを日本語ラベルに変換する辞書
const TIME_LABELS: Record<string, string> = {
  "early morning": "早朝☀️",
  morning: "🌅 午前",
  lunch: "🍔 昼食・お昼",
  afternoon: "🏃 午後",
  evening: "🌆 夕方",
  night: "🌙 夜・夕食",
};

// ⭕️ 時系列順に並び替えるための優先度設定
const TIME_ORDER: Record<string, number> = {
  "early morning": 1,
  morning: 2,
  lunch: 3,
  afternoon: 4,
  evening: 5,
  night: 6,
};

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/plans/${id}`, {
      headers: {
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then((data) => setPlan(data))
      .catch((err) => console.error(err));
  }, [id]);

  const clickBack = () => navigate(-1);

  if (!plan) return <p className="p-4 text-center">Loading...</p>;

  // ⭕️ 【超すっきり化】正規表現の解体工場をすべて削除！
  const parsedItems = plan.plan_items
    ? plan.plan_items.map((item: any) => ({
        ...item,
        // Railsの content を使用
        parsedContent: item.content,
        // 🔽 item.time が無ければ DB の category カラムを参照する
        parsedTime: item.time || item.category,
      }))
    : [];
  // ? plan.plan_items.map((item: any) => ({
  //     ...item,
  //     // Railsの新しいtimeカラムとcontentカラムの値をそのまま使うだけ！
  //     parsedContent: item.content,
  //     parsedTime: item.time,
  //   }))
  // : [];

  // ⭕️ 当日のスケジュール用に時系列順にソートする処理
  const timelineItems = [...parsedItems].sort((a, b) => {
    const orderA = TIME_ORDER[a.parsedTime] || 99;
    const orderB = TIME_ORDER[b.parsedTime] || 99;
    return orderA - orderB;
  });

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">プラン詳細</h1>

      {!isEditing ? (
        <>
          {/* 基本概要カード */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            {/* <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              📁 概要
            </h2> */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-2">
                <span className="text-gray-500">タイトル:</span>{" "}
                <span className="font-bold text-gray-800">{plan.title}</span>
              </div>
              <div>
                <span className="text-gray-500">場所:</span>{" "}
                <span className="font-medium text-gray-700">
                  {plan.location}
                </span>
              </div>
              <div>
                <span className="text-gray-500">予算:</span>{" "}
                <span className="font-bold text-amber-600">
                  {Number(plan.budget).toLocaleString()}円
                </span>
              </div>
            </div>
          </div>

          {/* 分けたエリア1：【みんなのやりたいこと（箇条書き）】 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              💡 みんなのやりたいこと
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 font-medium">
              {parsedItems.length > 0 ? (
                parsedItems.map((item: any, index: number) => (
                  <li
                    key={item.id || index}
                    className="hover:text-purple-600 transition"
                  >
                    {item.parsedContent}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm list-none pl-0">
                  登録された項目はありません
                </p>
              )}
            </ul>
          </div>

          {/* 分けたエリア2：【当日のスケジュール（時系列ルート）】 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              📅 当日のスケジュール
            </h2>
            <div className="border-l-2 border-purple-200 ml-3 pl-5 space-y-4">
              {timelineItems.length > 0 ? (
                timelineItems.map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className="relative flex items-center gap-3"
                  >
                    {/* タイムラインの左ポチ */}
                    <div className="absolute -left-[27px] w-2.5 h-2.5 bg-purple-500 rounded-full border border-white" />

                    {/* 時間帯 */}
                    <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded font-bold border border-purple-100 shrink-0 w-24 text-center">
                      {TIME_LABELS[item.parsedTime] || "未設定"}
                    </span>

                    {/* 行動内容 */}
                    <span className="text-sm text-gray-700 font-semibold">
                      {item.parsedContent}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm border-none pl-0">
                  スケジュールはありません
                </p>
              )}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
            >
              編集する
            </button>
            <button
              onClick={clickBack}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              戻る
            </button>
          </div>
        </>
      ) : (
        <PlanEditForm
          plan={plan}
          onCancel={() => setIsEditing(false)}
          onUpdate={(updatedPlan) => {
            setPlan(updatedPlan);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
