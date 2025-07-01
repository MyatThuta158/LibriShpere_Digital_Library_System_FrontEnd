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
import { storeRevenue, getRevenue } from "../../../api/predictionstoreApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.includes("T") ? dateString.split("T")[0] : dateString;
};

function SubscriberRevenuePrediction() {
  const [currentData, setCurrentData] = useState({});
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseAccuracy = (acc) => {
    if (typeof acc === "string") {
      return parseFloat(acc.replace("%", ""));
    }
    return acc;
  };

  const filterStoredData = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const revenueType = item.SubscriptionPlanName;
      if (
        !grouped[revenueType] ||
        parseAccuracy(item.Accuracy) >
          parseAccuracy(grouped[revenueType].Accuracy)
      ) {
        grouped[revenueType] = item;
      }
    });
    return grouped;
  };

  const buildChartData = (typeRecord) => {
    if (!typeRecord) return;
    let next7, next14, next28;

    if (typeRecord.predictions) {
      next7 = typeRecord.predictions.next_7_days;
      next14 = typeRecord.predictions.next_14_days;
      next28 = typeRecord.predictions.next_28_days;
    } else {
      next7 = typeRecord["7DaysReport"];
      next14 = typeRecord["14DaysReport"];
      next28 = typeRecord["28DaysReport"];
    }

    setChartData({
      labels: ["Next 7 days", "Next 14 days", "Next 28 days"],
      datasets: [
        {
          label: `${selectedType} Revenue Prediction`,
          data: [next7, next14, next28],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    });
  };

  // Fetch stored predictions on mount
  useEffect(() => {
    const fetchStoredRevenue = async () => {
      try {
        const response = await getRevenue();
        if (response?.data) {
          const filtered = filterStoredData(response.data);
          setCurrentData(filtered);
          const types = Object.keys(filtered);
          setAvailableTypes(types);
          if (types.length > 0) {
            setSelectedType(types[0]);
            buildChartData(filtered[types[0]]);
          }
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchStoredRevenue();
  }, []);

  // Rebuild chart when selection or data changes
  useEffect(() => {
    if (currentData[selectedType]) {
      buildChartData(currentData[selectedType]);
    }
  }, [selectedType, currentData]);

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const res = await getSubscriberPredict();
      const currentDate = new Date().toISOString().split("T")[0];
      const admin = JSON.parse(localStorage.getItem("user"));
      const adminId = admin?.id;

      const payload = Object.keys(res).map((planName) => ({
        SubscriptionPlanName: planName,
        Accuracy: res[planName].metrics?.accuracy
          ? `${(res[planName].metrics.accuracy * 100).toFixed(0)}%`
          : "0%",
        PredictedDate: currentDate,
        "7DaysReport":
          res[planName].predictions?.next_7_days?.toString() || "0",
        "14DaysReport":
          res[planName].predictions?.next_14_days?.toString() || "0",
        "28DaysReport":
          res[planName].predictions?.next_28_days?.toString() || "0",
        AdminId: adminId,
      }));

      const newData = {};
      payload.forEach((item) => {
        newData[item.SubscriptionPlanName] = {
          SubscriptionPlanName: item.SubscriptionPlanName,
          Accuracy: item.Accuracy,
          PredictedDate: item.PredictedDate,
          "7DaysReport": parseInt(item["7DaysReport"], 10),
          "14DaysReport": parseInt(item["14DaysReport"], 10),
          "28DaysReport": parseInt(item["28DaysReport"], 10),
        };
      });

      setCurrentData(newData);
      setAvailableTypes(Object.keys(newData));
      if (Object.keys(newData).length > 0) {
        setSelectedType(Object.keys(newData)[0]);
      }

      await storeRevenue({ data: payload });
      console.log("Predictions stored successfully");
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Error generating predictions");
    } finally {
      setIsLoading(false);
    }
  };

  // 1) Define chart options with a tooltip callback that adds '$'
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y; // parsed.y holds the bar value :contentReference[oaicite:0]{index=0}
            return `$${value}`; // prepend dollar sign :contentReference[oaicite:1]{index=1}
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Revenue Predictions</h2>

      {availableTypes.length > 0 && (
        <div>
          <label>Select Membership Type: </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentData[selectedType] && (
        <p>
          Last Predicted Date:{" "}
          <strong>{formatDate(currentData[selectedType].PredictedDate)}</strong>
        </p>
      )}

      <button onClick={handlePredict} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Predictions"}
      </button>

      {chartData ? (
        <div style={{ width: "70%", height: "60vh" }}>
          {/* 2) Pass chartOptions into the Bar component */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>No revenue prediction data available</p>
      )}
    </div>
  );
}

export default SubscriberRevenuePrediction;
