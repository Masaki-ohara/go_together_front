export default function AiPlanForm() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">AI Plan Form</h2>
      <form className="flex flex-col gap-2">
        <label htmlFor="planName">Plan Name:</label>
        <input
          type="text"
          id="planName"
          name="planName"
          className="border p-2 rounded"
        />

        <label htmlFor="planDescription">Plan Description:</label>
        <textarea
          id="planDescription"
          name="planDescription"
          className="border p-2 rounded"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
