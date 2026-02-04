import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PlanList() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/plans")
      .then((response) => response.json())
      .then((data) => {
        setPlans(data);
      });
  }, []);

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">プランリスト</h1>

      <div className="grid grid-cols-1 gap-4 hover:bg-gray-100 p-4">
        {plans.map((plan, index) => (
          <div key={plan.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-semibold">{index + 1}.</span>
              <Link to={`/plans/${plan.id}`} className="flex-1 text-center">
                <p className="flex-1 text-center">{plan.title}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
