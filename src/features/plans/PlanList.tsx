import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { saveAuthHeaders } from "../../utils/auth";

interface Plan {
  id: number;
  title: string;
}

export default function PlanList() {
  const { groupId } = useParams<{ groupId: string }>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string>("");
  const [groupDeadline, setGroupDeadline] = useState<string>("");
  const [round, setRound] = useState<number>(1);
  const navigate = useNavigate();

  // 1. プラン一覧取得関数
  const fetchPlans = async () => {
    if (!groupId || isNaN(Number(groupId))) {
      setError("グループIDが無効です");
      return;
    }

    const numericGroupId = Number(groupId);

    try {
      const res = await fetch(
        // `http://localhost:3000/api/v1/groups/${numericGroupId}/plans`,
        `http://localhost:3000/api/v1/groups/${numericGroupId}`,
        {
          headers: {
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        },
      );

      if (!res.ok) {
        setError("プランを取得できませんでした（認証が必要です）");
        setPlans([]);
        return;
      }

      saveAuthHeaders(res);

      const data = await res.json();

      if (data && typeof data === "object") {
        setGroupDeadline(data.deadline || "");

        if (data.schedules_count !== undefined) {
          setRound(data.schedules_count + 1);
        }

        if (Array.isArray(data.plans)) {
          const formattedPlans = data.plans.map((p: any) => ({
            id: p.id,
            title: p.title,
          }));
          setPlans(formattedPlans);
        } else {
          setPlans([]);
        }
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error(err);
      setError("通信エラーが発生しました");
    }
  };

  // 2. 初回＆groupId変更時の読み込み処理
  useEffect(() => {
    fetchPlans();
  }, [groupId]);

  // 3. 削除処理関数
  const handleDelete = async (planId: number) => {
    if (!window.confirm("このプランを削除してもよろしいですか？")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/v1/plans/${planId}`, {
        method: "DELETE",
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
        },
      });
      if (res.ok) {
        saveAuthHeaders(res);
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
      } else {
        alert("削除に失敗しました");
      }
    } catch (err) {
      console.error("削除エラー:", err);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-6 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800">
          📝 第{round}回 投票候補のプラン一覧
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <p className="text-sm text-gray-600 font-medium">
            グループの投票締め切り日
          </p>
          <div className="mb-4 font-bold text-gray-800">
            {groupDeadline
              ? groupDeadline.substring(0, 10)
              : "設定されていません。"}
          </div>
        </div>

        {plans.length === 0 && !error ? (
          <p className="text-gray-500">プランがありません</p>
        ) : (
          plans.map((plan, index) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md border border-gray-100 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-gray-400 font-bold text-sm min-w-[24px]">
                  {index + 1}
                </span>
                <Link to={`/plans/${plan.id}`} className="flex-1 group">
                  <p className="text-left text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    {plan.title}
                  </p>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(plan.id)}
                className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-100 transition-colors font-medium"
              >
                削除
              </button>
            </div>
          ))
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(`/groups/${groupId}/plans/new`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors shadow"
          >
            ＋ プラン作成
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(`/groups/${groupId}/ai_plans/new`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors shadow"
          >
            ＋ AIプラン作成
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Link
            to={`/groups/${groupId}/deadline`}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors shadow text-center"
          >
            ⏰ グループの締め切り設定ページへ
          </Link>

          <Link
            to={`/groups/${groupId}/vote`}
            className="bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-sky-600 transition-colors shadow text-center"
          >
            🗳️ グループの投票ページへ
          </Link>

          <Link
            to={`/groups/${groupId}/vote/ranking`}
            className="bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition-colors shadow text-center"
          >
            🏆 投票結果ランキングページへ
          </Link>
        </div>
      </div>
    </div>
  );
}
