import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";

interface PlanVote {
  id: number;
  title: string;
  vote_count: number;
  voted_by_current_user: boolean;
}

interface GroupData {
  id: number;
  name?: string;
  deadline?: string;
}

export default function Vote() {
  const { groupId } = useParams();
  const [plans, setPlans] = useState<PlanVote[]>([]);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const todayStr = new Date().toLocaleDateString("sv-SE");
  const navigate = useNavigate();

  const isExpired = group?.deadline ? todayStr > group.deadline : false;
  const clickBack = () => navigate(-1);

  // 🎯 RailsのAPIを叩いて投票する関数
  const handleVote = async (planId: number) => {
    // 💡 2. 押した瞬間に、画面の数値を即座に「+1」する（これで変わります！）
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              vote_count: plan.vote_count + 1,
              voted_by_current_user: true,
            }
          : plan,
      ),
    );

    try {
      // 📡 3. バックグラウンドで Rails へPOSTリクエストを送る
      const response = await fetch(
        `http://localhost:3000/api/v1/plans/${planId}/votes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        },
      );

      // ⭕ 成功時（1回目）の処理の中にメッセージ表示を組み込む
      if (response.ok) {
        setSuccess(true); // ✨ ここで初めてメッセージを表示する！
        setTimeout(() => setSuccess(false), 3000); // 3秒後に消すタイマーもここへ移動
      }

      // 💡 4. 万が一 Rails 側で保存に失敗した場合は、数値を「-1」して元に戻す
      if (!response.ok) {
        // clearTimeout(timeoutId);
        setSuccess(false);

        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan.id === planId
              ? {
                  ...plan,
                  vote_count: Math.max(0, plan.vote_count - 1),
                  voted_by_current_user: false,
                }
              : plan,
          ),
        );

        const errorData = await response.json();
        alert(
          errorData.errors ? errorData.errors.join(", ") : "投票に失敗しました",
        );
      }
    } catch (error) {
      console.error("投票通信エラー:", error);
      clearTimeout(timeoutId);
      setSuccess(false);

      // 通信切断などのエラー時も数値を元に戻す
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                vote_count: Math.max(0, plan.vote_count - 1),
                voted_by_current_user: false,
              }
            : plan,
        ),
      );
    }
  };

  useEffect(() => {
    if (!groupId) return;

    const fetchVotePlans = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/groups/${groupId}`,
          {
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              client: localStorage.getItem("client") || "",
              uid: localStorage.getItem("uid") || "",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const formattedPlans = (data.plans || []).map((p: any) => ({
            id: p.id,
            title: p.title || p.name || p.location || "名称未設定のプラン",
            vote_count: p.vote_count || 0,
            voted_by_current_user: p.voted_by_current_user || false,
          }));

          // グループ情報も同時にセットして期限切れ判定を動かす
          setGroup({
            id: data.id,
            name: data.name,
            deadline: data.deadline,
          });

          setPlans(formattedPlans);
        }
      } catch (error) {
        console.error("投票データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotePlans();
  }, [groupId]);

  if (loading) {
    return <div className="p-6 text-gray-500">投票データを読み込み中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {group?.name ? `${group.name} の投票対象一覧` : "投票対象一覧"}
      </h1>

      {/* ⏰ 投票締め切り日の表示 */}
      {group?.deadline && (
        <p className="text-sm text-red-500 mb-4">
          投票締め切り: {group.deadline.substring(0, 10)}{" "}
          {isExpired && "（締め切られました）"}
        </p>
      )}

      <div className="space-y-4">
        {/* サクセスメッセージ */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg font-medium text-center shadow-sm">
            ✨ 投票が完了しました！
          </div>
        )}

        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-4 bg-white shadow rounded border flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{plan.title}</h2>
              <p className="text-sm text-gray-500">投票数: {plan.vote_count}</p>
            </div>

            <button
              disabled={isExpired}
              className={`px-4 py-2 rounded text-white transition ${
                isExpired
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={() => handleVote(plan.id)}
            >
              {isExpired ? "⏳ 締め切られました" : "👍 投票する"}
            </button>
          </div>
        ))}
      </div>

      <BackButton />
    </div>
  );
}
