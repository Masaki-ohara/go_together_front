import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { saveAuthHeaders } from "../../utils/auth";

interface ScheduleItem {
  id: number;
  date?: string; // 予定日（バックエンドの構造に合わせて調整してください）
  title?: string;
}

interface Schedule {
  id: number;
  plan: {
    id: number;
    title: string;
  };
  created_at: string;
  // もし schedule 自体に日付やデータがある場合はここに追加
}

export default function ScheduleList() {
  const { groupId } = useParams<{ groupId: string }>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // 1. 確定スケジュール一覧の取得
  const fetchSchedules = async () => {
    if (!groupId || isNaN(Number(groupId))) {
      setError("グループIDが無効です");
      return;
    }

    const numericGroupId = Number(groupId);

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/groups/${numericGroupId}/schedules`,
        {
          headers: {
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        },
      );

      if (!res.ok) {
        setError("確定したしおり一覧を取得できませんでした");
        setSchedules([]);
        return;
      }

      saveAuthHeaders(res);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSchedules(data);
      } else if (data && Array.isArray(data.schedules)) {
        setSchedules(data.schedules);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      console.error(err);
      setError("通信エラーが発生しました");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [groupId]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-6 border-b pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🕒 これまでの確定しおり一覧
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            グループで確定した過去の旅行・お出かけの予定一覧です。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {error && <p className="text-red-500">{error}</p>}

        {schedules.length === 0 && !error ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">
              まだ確定したしおりがありません
            </p>
            <p className="text-xs text-gray-400 mt-1">
              投票でプランを決定し、スケジュールを確定させましょう！
            </p>
          </div>
        ) : (
          schedules.map((schedule, index) => {
            // 第何回目かを計算（古い順、あるいは配列のインデックス等から逆算）
            const roundNum = index + 1;
            const planTitle = schedule.plan?.title || "名称未設定のプラン";
            const confirmedDate = schedule.created_at
              ? schedule.created_at.substring(0, 10)
              : "";

            return (
              <div
                key={schedule.id}
                className="bg-white rounded-lg shadow-sm p-5 transition-all duration-200 hover:shadow-md border border-gray-200 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    第{roundNum}回 確定しおり
                  </span>
                  <span className="text-xs text-gray-400">
                    確定日: {confirmedDate}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mt-1">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">
                      {planTitle}
                    </h2>
                  </div>

                  <Link
                    to={`/groups/${groupId}/schedules/${schedule.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shrink-0 text-center"
                  >
                    しおりを見る →
                  </Link>
                </div>
              </div>
            );
          })
        )}

        {/* 戻るボタン */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(`/groups/${groupId}/plans`)}
            className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full shadow-sm"
          >
            ← 投票候補プラン一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
