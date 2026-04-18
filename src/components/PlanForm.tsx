import React from "react";

interface PlanItem {
  id?: number;
  content: string;
}

interface PlanFormProps {
  title: string;
  location: string;
  budget: number;
  items: PlanItem[];
  onChangeTitle: (value: string) => void;
  onChangeLocation: (value: string) => void;
  onChangeBudget: (value: number) => void;
  onChangeItem: (index: number, value: string) => void;
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  readonly?: boolean;
}

export default function PlanForm({
  title,
  location,
  budget,
  items,
  onChangeTitle,
  onChangeLocation,
  onChangeBudget,
  onChangeItem,
  onAddItem,
  onRemoveItem,
  readonly = false,
}: PlanFormProps) {
  return (
    <form className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          readOnly={readonly}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">場所</label>
        <input
          type="text"
          value={location}
          onChange={(e) => onChangeLocation(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          readOnly={readonly}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">予算</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => onChangeBudget(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
          readOnly={readonly}
        />
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-2">やりたいことリスト</p>
        {items.map((item, index) => (
          <div key={item.id || index} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              value={item.content}
              onChange={(e) => onChangeItem(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-blue-500"
              readOnly={readonly}
            />
            {!readonly && onRemoveItem && (
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
              >
                削除
              </button>
            )}
          </div>
        ))}

        {!readonly && onAddItem && (
          <button
            type="button"
            onClick={onAddItem}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
          >
            + 追加
          </button>
        )}
      </div>
    </form>
  );
}
