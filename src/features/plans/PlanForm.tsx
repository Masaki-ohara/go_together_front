import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";

type FormValues = {
  title: string;
  date: Date | null;
  location: string;
  budget: number;
  list1: string;
  time1: string;
  list2: string;
  time2: string;
  list3: string;
  time3: string;
  list4: string;
  time4: string;
  list5: string;
  time5: string;
};

export default function PlanForm() {
  const navigate = useNavigate();

  const { groupId } = useParams<{ groupId: string }>();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");
  // const onSubmit = (data: FormValues) => {
  //   console.log({
  //     ...data,
  //     date: startDate,
  //   });
  // };
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        title: data.title,
        date: data.date,
        location: data.location,
        budget: data.budget,
        lists: [
          { content: data.list1, time: data.time1 },
          { content: data.list2, time: data.time2 },
          { content: data.list3, time: data.time3 },
          { content: data.list4, time: data.time4 },
          { content: data.list5, time: data.time5 },
        ].filter((item) => item.content !== ""),
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/groups/${groupId}/plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }
      toast.success("プランが正常に作成されました 🎉");
      setTimeout(() => {
        navigate(`/groups/${groupId}/plans`);
      }, 1500);
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("プランの作成に失敗しました");
      toast.error("プランの作成に失敗しました");
    }
  };

  const today = new Date().toLocaleDateString("sv-SE");
  const TimeSelect = ({
    name,
    isRequired = false,
    validate,
  }: {
    name: "time1" | "time2" | "time3" | "time4" | "time5";
    isRequired?: boolean;
    validate?: (value: string) => boolean | string;
  }) => (
    <select
      {...register(name, {
        required: isRequired ? "時間帯を選択してください" : false,
        validate: validate,
      })}
      className="bg-gray-300 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200 mt-2"
    >
      <option value="">時間帯を選択してください</option>
      <option value="early morning">早朝☀️</option>
      <option value="morning">🌅 午前</option>
      <option value="lunch">🍔 昼食・お昼</option>
      <option value="afternoon">🏃 午後</option>
      <option value="evening">🌆 夕方</option>
      <option value="night">🌙 夜・夕食</option>
    </select>
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-bold">プラン作成</h2>

      {submitStatus === "success" && (
        <div className="p-4 mb-4 text-green-800 bg-green-200 rounded">
          プランが正常に作成されました！
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 mb-4 text-red-800 bg-red-200 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            日付
            <span className="ml-2 text-white bg-red-500 text-xs px-2 py-0.5 rounded">
              必須
            </span>
          </label>

          <Controller
            name="date"
            control={control}
            rules={{ required: "日付は必須です" }}
            render={({ field }) => (
              <DatePicker
                minDate={today}
                selected={field.value}
                onChange={field.onChange}
                placeholderText="日付を選択してください"
                dateFormat="yyyy/MM/dd"
                className="bg-gray-300 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
              />
            )}
          />

          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-3 text-sm font-medium">
            プラン名
            <span className="mr-2 shrink-0 text-white bg-red-500 text-xs px-2 py-0.5 rounded ml-2">
              必須
            </span>
          </label>
          <input
            type="text"
            placeholder="プラン名（例：お台場デート）"
            {...register("title", {
              required: "プラン名は必須です",
            })}
            className="bg-gray-300 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
          />
          <div>
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-3 text-sm font-medium">
            行きたい場所
            <span className="mr-2 shrink-0 text-white bg-red-500 text-xs px-2 py-0.5 rounded ml-2">
              必須
            </span>
          </label>

          {/* <div className="flex items-center mr-2"> */}

          <input
            type="text"
            placeholder="行きたい場所を入力してください"
            {...register("location", {
              required: "行きたい場所は必須です",
            })}
            className="bg-gray-300 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
          />
          {/* </div> */}

          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <label className="block mb-3 text-sm font-medium">
          予算
          <span className="text-white bg-red-500 text-xs px-2 py-0.5 rounded ml-2">
            必須
          </span>
        </label>
        <input
          type="number"
          placeholder="予算を入力してください"
          {...register("budget", {
            required: "予算は必須です",
            min: { value: 0, message: "0以上で入力してください" },
          })}
          className="bg-gray-300 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
        />
        {errors.budget && (
          <p className="text-red-500 text-sm">{errors.budget.message}</p>
        )}
        <div>
          <label className="block mb-3 text-sm font-medium">
            したいこと①
            <span className="text-white bg-red-500 text-xs px-2 py-0.5 rounded ml-2">
              必須
            </span>
          </label>
          {/* <div className="flex items-center gap-2 mb-1"> */}

          <input
            type="text"
            placeholder="したいことを入力してください"
            {...register("list1", {
              required: "1つ目は必須です",
            })}
            className="bg-gray-300 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
          />
          <TimeSelect name="time1" isRequired={true} />
          {errors.list1 && (
            <p className="text-red-500 text-sm">{errors.list1.message}</p>
          )}
          {errors.time1 && (
            <p className="text-red-500 text-sm">{errors.time1.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-3 text-sm font-medium">したいこと②</label>
          {/* <span className="text-white bg-red-500 text-xs px-2 py-0.5 rounded">
              必須
            </span> */}
          {/* </div> */}

          <input
            type="text"
            placeholder="したいことを入力してください"
            {...register("list2", {
              // ⬇️ ここから追記
              validate: (val) =>
                getValues("time2") && !val
                  ? "したいことも入力してください"
                  : true,
              // ⬆️ ここまで追記
              //   required: "2つ目は必須です",
            })}
            className="bg-gray-300 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
          />
          <TimeSelect
            name="time2"
            validate={(val) =>
              getValues("list2") && !val ? "時間帯も選択してください" : true
            }
          />
          {errors.list2 && (
            <p className="text-red-500 text-sm mt-1">{errors.list2.message}</p>
          )}
          {errors.time2 && (
            <p className="text-red-500 text-sm mt-1">{errors.time2.message}</p>
          )}
          {/* {errors.list2 && (
            <p className="text-red-500 text-sm">
              {errors.list2.message}
            </p>
          )} */}
        </div>

        <div>
          <label className="block mb-3 text-sm font-medium">したいこと③</label>
          {/* <span className="text-white bg-red-500 text-xs px-2 py-0.5 rounded">
              必須
            </span> */}

          <input
            type="text"
            placeholder="したいことを入力してください"
            {...register("list3", {
              validate: (val) =>
                getValues("time3") && !val
                  ? "したいことも入力してください"
                  : true,
              //   required: "3つ目は必須です",
            })}
            className="bg-gray-200 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
          />
          {errors.list3 && (
            <p className="text-red-500 text-sm mt-1">{errors.list3.message}</p>
          )}
          {errors.time3 && (
            <p className="text-red-500 text-sm mt-1">{errors.time3.message}</p>
          )}
          {/* {errors.list3 && (
            <p className="text-red-500 text-sm">
              {errors.list3.message}
            </p>
          )} */}
          <TimeSelect
            name="time3"
            validate={(val) =>
              getValues("list3") && !val ? "時間帯も選択してください" : true
            }
          />
        </div>

        <div>
          <label className="block mb-3 text-sm font-medium">したいこと④</label>
          {/* <span className="text-white bg-red-500 text-xs px-2 py-0.5 rounded">
              必須
            </span> */}

          <input
            type="text"
            placeholder="したいことを入力してください"
            {...register("list4", {
              validate: (val) =>
                getValues("time4") && !val
                  ? "したいことも入力してください"
                  : true,
              //   required: "3つ目は必須です",
            })}
            className="bg-gray-200 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
          />
          {errors.list4 && (
            <p className="text-red-500 text-sm mt-1">{errors.list4.message}</p>
          )}
          {errors.time4 && (
            <p className="text-red-500 text-sm mt-1">{errors.time4.message}</p>
          )}
          {/* {errors.list3 && (
            <p className="text-red-500 text-sm">
              {errors.list3.message}
            </p>
          )} */}
          <TimeSelect
            name="time4"
            validate={(val) =>
              getValues("list4") && !val ? "時間帯も選択してください" : true
            }
          />
        </div>

        <div>
          <label className="block mb-3 text-sm font-medium">したいこと⑤</label>
          {/* <span className="text-white bg-red-500 text-xs px-2 py-0.5 rounded">
              必須
            </span> */}

          <input
            type="text"
            placeholder="したいことを入力してください"
            {...register("list5", {
              validate: (val) =>
                getValues("time5") && !val
                  ? "したいことも入力してください"
                  : true,
              //   required: "3つ目は必須です",
            })}
            className="bg-gray-200 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition duration-200"
          />
          {errors.list5 && (
            <p className="text-red-500 text-sm mt-1">{errors.list5.message}</p>
          )}
          {errors.time5 && (
            <p className="text-red-500 text-sm mt-1">{errors.time5.message}</p>
          )}
          {/* {errors.list3 && (
            <p className="text-red-500 text-sm">
              {errors.list3.message}
            </p>
          )} */}
          <TimeSelect
            name="time5"
            validate={(val) =>
              getValues("list5") && !val ? "時間帯も選択してください" : true
            }
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
      <BackButton />
    </div>
  );
}
