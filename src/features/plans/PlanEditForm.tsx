import React, { useState } from "react";

export default function PlanEditForm({ plan, onCancel, onUpdate }: any) {
  const [title, setTitle] = useState(plan.title);
  const [location, setLocation] = useState(plan.location);
  const [budget, setBudget] = useState(plan.budget);
  const [items, setItems] = useState(plan.plan_items || []);

  const addItem = () => {
    if (items.length >= 5) {
      alert("やりたいことは5個までです！");
      return;
    }
    setItems([...items, { content: "" }]);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].content = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (!window.confirm("本当に削除しますか？")) return;

    const newItems = [...items];

    if (newItems[index].id) {
      newItems[index]._destroy = true;
    } else {
      newItems.splice(index, 1);
    }

    const Items = newItems.filter((item) => !item._destroy);

    if (Items.length < 1) {
      alert("やりたいことは最低1個必要です！");
      return;
    }

    setItems(newItems);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    if (!title || !location || !budget) {
      alert("全て入力してください");
      return;
    }
    if (items.some((item) => !item.content)) {
      alert("やりたいことリスト全て入力してください");
      return;
    }

    e.preventDefault();
    try {
      const payload = {
        title,
        location,
        budget,
        plan_items_attributes: items.map((item) => ({
          id: item.id,
          content: item.content,
          _destroy: item._destroy,
        })),
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/plans/${plan.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: payload,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      const updatedPlan = await response.json();
      onUpdate(updatedPlan);
      onCancel();
    } catch (error) {
      console.error("プランの更新に失敗しました", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">タイトル</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <div className="w-20"></div>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">場所</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <div className="w-20"></div>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">予算</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <div className="w-20"></div>
          </div>
        </div>
        <p className="text-gray-400 text-sm">やりたいことリスト</p>

        {items
          .filter((item) => !item._destroy)
          .map((item, index) => (
            <div key={item.id || index} className="flex gap-2 items-center">
              <input
                type="text"
                value={item.content || ""}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].content = e.target.value;
                  setItems(newItems);
                }}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-blue-500"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="w-20 border border-red-500 text-red-500 px-3 py-2 rounded hover:bg-red-500 hover:text-white transition"
                >
                  削除
                </button>
              </div>
            </div>
          ))}

        <button
          type="button"
          onClick={addItem}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
        >
          + 追加
        </button>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </form>
    </>
  );
}
