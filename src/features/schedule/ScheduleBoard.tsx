import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { Link } from "react-router-dom";

// 1. APIのレスポンス構造に合わせた型定義
type Plan = {
  id: number;
  location?: string;
  budget?: number;
};

type ScheduleItem = {
  id: number;
  content: string;
  start_time: string;
  end_time?: string;
  location?: string;
};

type ScheduleData = {
  id: number;
  title: string;
  date?: string;
  plan_id?: number;
  plan?: Plan; // ⭕️ plan オブジェクトを追加
  schedule_items?: ScheduleItem[];
};

export default function ScheduleBoard() {
  // const { groupId } = useParams<{ groupId: string }>();
  const { groupId, id } = useParams<{ groupId: string; id: string }>();
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);

  useEffect(() => {
    if (!groupId || groupId === "undefined") return;

    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          // `http://localhost:3000/api/v1/groups/${groupId}/schedules`,
          `http://localhost:3000/api/v1/groups/${groupId}/schedules/${id}`,
          {
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              client: localStorage.getItem("client") || "",
              uid: localStorage.getItem("uid") || "",
            },
          },
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("取得したスケジュールデータ:", data);
        setSchedule(data);
      } catch (error) {
        console.error("スケジュールの取得に失敗しました", error);
      }
    };

    fetchSchedule();
  }, [groupId]);

  if (!groupId || groupId === "undefined") {
    return (
      <div className="p-6 text-gray-500">グループIDが指定されていません。</div>
    );
  }

  if (!schedule) return <div className="p-6 text-center">読み込み中...</div>;

  const items = schedule.schedule_items || [];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* 1. タイトル & 場所 & 予算 ヘッダーエリア */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-3">
        <h1 className="text-2xl font-bold text-gray-800">
          📅 {schedule.title || "スケジュールしおり"}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2 border-t">
          {/* ⭕️ 場所の表示 (schedule.plan.location を参照) */}
          {schedule.plan?.location && (
            <div className="flex items-center font-medium text-gray-700">
              📍 <span className="ml-1">場所: {schedule.plan.location}</span>
            </div>
          )}

          {/* ⭕️ 予算の表示 (schedule.plan.budget を参照) */}
          {schedule.plan?.budget !== undefined &&
            schedule.plan?.budget !== null && (
              <div className="flex items-center font-medium text-gray-700">
                💰{" "}
                <span className="ml-1">
                  予算: ¥{schedule.plan.budget.toLocaleString()}
                </span>
              </div>
            )}

          {/* 日付の表示 */}
          {schedule.date && (
            <div className="flex items-center font-medium text-gray-700">
              🗓️{" "}
              <span className="ml-1">
                {new Date(schedule.date).toLocaleDateString("ja-JP")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. したいことリスト（タイムライン形式） */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          ✨ タイムライン / したいこと
        </h2>

        <Link
          to={`/groups/${groupId}/schedules/${id}/tasks`}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          📋 役割・タスク一覧
        </Link>

        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">{item.content}</p>
                  {item.location && (
                    <p className="text-xs text-gray-500">📍 {item.location}</p>
                  )}
                </div>

                {/* ⭕️ start_time と end_time を表示 */}
                <span className="text-xs font-semibold px-3 py-1 bg-sky-100 text-sky-800 rounded-full whitespace-nowrap">
                  ⏰ {item.start_time}
                  {item.end_time ? ` 〜 ${item.end_time}` : ""}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">
            登録された予定がありません。
          </p>
        )}
      </div>

      <BackButton />

      <Link
        to={`/groups/${groupId}/schedules/${id}/tasks/create`}
        className="block mt-6 text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        タスクを追加する
      </Link>
    </div>
  );
}
