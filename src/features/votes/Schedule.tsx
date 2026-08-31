import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

// ⭕️ 時間帯の日本語変換辞書を復活
const TIME_LABELS: Record<string, string> = {
  "early morning": "早朝☀️",
  morning: "🌅 午前",
  lunch: "🍔 昼食",
  afternoon: "🏃 午後",
  evening: "🌆 夕方",
  night: "🌙 夜食",
};

export default function Schedule() {
  const location = useLocation();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>(location.state?.plan);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { groupId } = useParams<{ groupId: string }>();

  useEffect(() => {
    if (!plan?.id) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/v1/plans/${plan.id}`, {
      headers: {
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlan(data);
        const planItems = data.plan_items || [];
        setItems(sortItemsByTime(planItems));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 開始時間で昇順ソート
  const sortItemsByTime = (itemList: any[]) => {
    return [...itemList].sort((a, b) => {
      const timeA = a.start_time || a.time || "";
      const timeB = b.start_time || b.time || "";
      if (!timeA) return 1;
      if (!timeB) return -1;
      return timeA.localeCompare(timeB);
    });
  };

  const handleTimeChange = (
    index: number,
    field: "start_time" | "end_time",
    value: string,
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "start_time") {
      setItems(sortItemsByTime(updated));
    } else {
      setItems(updated);
    }
  };

  const handleSave = async () => {
    if (!groupId) {
      toast.error("グループIDが見つかりません");
      return;
    }

    setSaving(true);
    try {
      // 💡 スケジュール用のAPI（/api/v1/groups/:groupId/schedules）にPOST送信する
      const response = await fetch(
        `http://localhost:3000/api/v1/groups/${groupId}/schedules`,
        {
          method: "POST", // SchedulesController#create を呼び出す
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
          body: JSON.stringify({
            // 💡 送信データを "schedule" と "schedule_items_attributes" にする
            schedule: {
              title: plan?.title || "確定スケジュール",
              date: plan?.date,
              schedule_items_attributes: items.map((item) => ({
                start_time: item.start_time || "",
                end_time: item.end_time || "",
                content: item.content || "",
              })),
            },
          }),
        },
      );

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.error("保存失敗詳細:", errJson);
        throw new Error("保存に失敗しました");
      }

      toast.success("スケジュールを保存しました ✨");
      navigate(`/groups/${groupId}/plans`);
    } catch (error) {
      console.error(error);
      toast.error("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };
  // const handleSave = async () => {
  //   setSaving(true);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/api/v1/groups/${groupId}/schedules`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "access-token": localStorage.getItem("access-token") || "",
  //           client: localStorage.getItem("client") || "",
  //           uid: localStorage.getItem("uid") || "",
  //         },
  //         body: JSON.stringify({
  //           plan: {
  //             plan_items_attributes: items.map((item) => ({
  //               id: item.id,
  //               start_time: item.start_time || item.time,
  //               end_time: item.end_time,
  //               content: item.content,
  //             })),
  //           },
  //         }),
  //       },
  //     );

  //     if (!response.ok) throw new Error("保存に失敗しました");
  //     toast.success("スケジュールを保存しました ✨");
  //     navigate(`/groups/${groupId}/plans`);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("保存に失敗しました");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-400 font-medium animate-pulse">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-5">
      {/* メインカード */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        {/* ヘッダーエリア */}
        <div className="border-b border-gray-100 pb-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              📅 確定スケジュール
            </span>
            {plan?.date && (
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {plan.date}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-800 pt-2">
            🥇 {plan?.title || "無題のプラン"}
          </h1>
        </div>

        {/* タイムライン表示エリア */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            当日のルート・時間設定
          </h2>

          {items.length > 0 ? (
            <div className="relative border-l-2 border-purple-100 ml-3 pl-4 space-y-4">
              {items.map((item: any, index: number) => {
                let content = item.content;
                let startTime = item.start_time || item.time;
                let endTime = item.end_time;
                let categoryKey = item.category || item.time; // 時間帯ラベル判定用

                if (typeof content === "string" && content.includes("=>")) {
                  try {
                    const parsed = JSON.parse(content.replace(/=>/g, ":"));
                    content = parsed.content;
                    startTime = parsed.start_time || parsed.time;
                    endTime = parsed.end_time;
                    categoryKey = parsed.category || parsed.time;
                  } catch (e) {
                    content = item.content;
                  }
                }

                // 辞書に一致すれば日本語ラベル、無ければそのまま表示
                const labelText =
                  TIME_LABELS[categoryKey] ||
                  (categoryKey && !categoryKey.includes(":")
                    ? categoryKey
                    : null);

                return (
                  <div
                    key={item.id || index}
                    className="relative flex flex-col sm:flex-row sm:items-center gap-2.5 bg-gray-50/80 hover:bg-purple-50/40 p-3 rounded-xl border border-gray-100 transition-colors"
                  >
                    {/* タイムラインの丸ポチ */}
                    <div className="absolute -left-[23px] top-4 sm:top-auto w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow-sm" />

                    {/* ⭕️ 1. 時間帯ラベル（復活！） */}
                    {labelText && (
                      <span className="text-xs font-bold text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-md shrink-0 w-fit">
                        {labelText}
                      </span>
                    )}

                    {/* ⭕️ 2. 開始時間 〜 終了時間の入力範囲 */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <label className="display-flex text-xs font-semibold text-gray-500 shrink-0">
                        開始時間
                      </label>
                      <input
                        type="time"
                        value={startTime || ""}
                        onChange={(e) =>
                          handleTimeChange(index, "start_time", e.target.value)
                        }
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <span className="text-gray-400 text-xs font-bold">
                        〜
                      </span>
                      <label className="text-xs font-semibold text-gray-500 shrink-0">
                        終了時間
                      </label>
                      {/* ⭕️ 2. 終了時間の入力欄 */}
                      <input
                        type="time"
                        value={endTime || ""}
                        onChange={(e) =>
                          handleTimeChange(index, "end_time", e.target.value)
                        }
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* ⭕️ 3. スケジュール内容 */}
                    <span className="text-sm font-medium text-gray-800 flex-1 break-all sm:ml-1">
                      {content}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-xs italic">
                詳細スケジュールが未登録です
              </p>
            </div>
          )}
        </div>

        {/* 保存ボタン */}
        {items.length > 0 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
          >
            {saving ? "保存中..." : "スケジュールを確定・保存"}
          </button>
        )}
      </div>

      {/* 戻るボタン */}
      <button
        onClick={() => navigate(-1)}
        className="w-full bg-white hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl border border-gray-200 transition-colors text-sm shadow-sm"
      >
        前の画面に戻る
      </button>
    </div>
  );
}
