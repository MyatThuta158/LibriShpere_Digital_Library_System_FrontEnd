import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getSubscriberPredict } from "../../../api/predictionApi";
import {
  storeSubscriber,
  getSubscriber,
} from "../../../api/predictionstoreApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format ISO date string to "YYYY-MM-DD"
const formatDate = (dateString) => {
  if (!dateString) return "";
  // If the string contains "T", assume it's in ISO format and split at "T"
  return dateString.includes("T") ? dateString.split("T")[0] : dateString;
};

function SubscriberPrediction() {
  const [currentData, setCurrentData] = useState({}); // Object mapping plan names to prediction records
  const [availablePlans, setAvailablePlans] = useState([]); // List of unique plan names
  const [selectedPlan, setSelectedPlan] = useState("");
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to parse an accuracy string to a number.
  const parseAccuracy = (acc) => {
    if (typeof acc === "string") {
      return parseFloat(acc.replace("%", ""));
    }
    return acc;
  };

  // Filter stored data: group by SubscriptionPlanName and keep the record with the highest accuracy.
  const filterStoredData = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const plan = item.SubscriptionPlanName;
      if (
        !grouped[plan] ||
        parseAccuracy(item.Accuracy) > parseAccuracy(grouped[plan].Accuracy)
      ) {
        grouped[plan] = item;
      }
    });
    return grouped;
  };

  // Build chart data for the selected plan.
  const buildChartData = (planRecord) => {
    if (!planRecord) return;
    let next7, next14, next28;
    // Check if record comes from ML API (nested predictions) or from DB (flat keys)
    if (planRecord.predictions) {
      next7 = planRecord.predictions.next_7_days;
      next14 = planRecord.predictions.next_14_days;
      next28 = planRecord.predictions.next_28_days;
    } else {
      next7 = planRecord["7DaysReport"];
      next14 = planRecord["14DaysReport"];
      next28 = planRecord["28DaysReport"];
    }
    const chart = {
      labels: ["Next 7 days", "Next 14 days", "Next 28 days"],
      datasets: [
        {
          label: `${selectedPlan} Predicted Values`,
          data: [next7, next14, next28],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    };
    setChartData(chart);
  };

  // Fetch stored predictions on mount.
  useEffect(() => {
    const fetchStoredPrediction = async () => {
      try {
        const response = await getSubscriber();
        if (response && response.data) {
          const filtered = filterStoredData(response.data);
          setCurrentData(filtered);
          const plans = Object.keys(filtered);
          setAvailablePlans(plans);
          if (plans.length > 0) {
            setSelectedPlan(plans[0]);
            buildChartData(filtered[plans[0]]);
          }
        }
      } catch (error) {
        console.error("Error fetching stored prediction data:", error);
      }
    };
    fetchStoredPrediction();
  }, []);

  // Update chart data when the selected plan changes.
  useEffect(() => {
    if (currentData && selectedPlan && currentData[selectedPlan]) {
      buildChartData(currentData[selectedPlan]);
    }
  }, [selectedPlan, currentData]);

  // Handle new prediction fetch, transform data, and store in the database.
  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const res = await getSubscriberPredict();
      // Compute the current date formatted as YYYY-MM-DD.
      const currentDate = new Date().toISOString().split("T")[0];

      // Get AdminId if available.
      const admin = JSON.parse(localStorage.getItem("user"));
      const adminId = admin && admin.id;

      let payload = [];
      // Assume the response is an object with plan names as keys.
      payload = Object.keys(res).map((plan) => ({
        SubscriptionPlanName: plan,
        Accuracy:
          res[plan].metrics && res[plan].metrics.accuracy !== undefined
            ? (res[plan].metrics.accuracy * 100).toFixed(0) + "%"
            : "0%",
        PredictedDate: currentDate,
        "7DaysReport":
          res[plan].predictions && res[plan].predictions.next_7_days != null
            ? res[plan].predictions.next_7_days.toString()
            : null,
        "14DaysReport":
          res[plan].predictions && res[plan].predictions.next_14_days != null
            ? res[plan].predictions.next_14_days.toString()
            : null,
        "28DaysReport":
          res[plan].predictions && res[plan].predictions.next_28_days != null
            ? res[plan].predictions.next_28_days.toString()
            : null,
        AdminId: adminId,
      }));

      // Update local state for display.
      const newData = {};
      payload.forEach((item) => {
        newData[item.SubscriptionPlanName] = {
          predictions: {
            next_7_days: parseInt(item["7DaysReport"]),
            next_14_days: parseInt(item["14DaysReport"]),
            next_28_days: parseInt(item["28DaysReport"]),
          },
          Accuracy: item.Accuracy,
          PredictedDate: item.PredictedDate,
        };
      });
      setCurrentData(newData);
      const plans = Object.keys(newData);
      setAvailablePlans(plans);
      if (plans.length > 0) {
        setSelectedPlan(plans[0]);
        buildChartData(newData[plans[0]]);
      }

      // Store the transformed payload in the database.
      await storeSubscriber({ data: payload });

      // console.log(respond);
      console.log("Prediction data stored successfully.");
    } catch (error) {
      console.error("Error during prediction or storing:", error);
      alert("An error occurred during prediction or storing data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscriber Prediction Information</h2>

      {/* Dynamic dropdown based on unique SubscriptionPlanName */}
      {availablePlans.length > 0 && (
        <div>
          <label htmlFor="plan-select">Select Membership Type: </label>
          <select
            id="plan-select"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            {availablePlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display last predicted date and accuracy for the selected plan */}
      {currentData && selectedPlan && currentData[selectedPlan] && (
        <div>
          <p>
            Last Predicted Date:{" "}
            <strong>
              {formatDate(currentData[selectedPlan].PredictedDate)}
            </strong>
          </p>
          {/* <p>
            Accuracy: <strong>{currentData[selectedPlan].Accuracy}</strong>
          </p> */}
        </div>
      )}

      <button onClick={handlePredict} disabled={isLoading}>
        {isLoading ? "Predicting..." : "Make Predict"}
      </button>

      {/* Render the bar chart if chart data is available */}
      {chartData ? (
        <div style={{ width: "70%", height: "60vh", margin: "0 0" }}>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      ) : (
        <p>No prediction data available.</p>
      )}
    </div>
  );
}

export default SubscriberPrediction;
