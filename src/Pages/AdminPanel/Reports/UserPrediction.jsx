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
import { getUserPredict } from "../../../api/predictionApi";
import {
  storeUserprediction,
  getUserprediction,
} from "../../../api/predictionstoreApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function UserPrediction() {
  const [currentData, setCurrentData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Build chart data based on the data structure.
  // It handles both new prediction data (with nested predictions) and stored data.
  const buildChartData = (data) => {
    let next7, next14, next28;
    if (data.predictions) {
      // Data from the prediction API call
      next7 = data.predictions.next_7_days;
      next14 = data.predictions.next_14_days;
      next28 = data.predictions.next_28_days;
    } else {
      // Data from the stored prediction (using report keys)
      next7 = data["7DaysReport"];
      next14 = data["14DaysReport"];
      next28 = data["28DaysReport"];
    }
    const chart = {
      labels: ["Next 7 days", "Next 14 days", "Next 28 days"],
      datasets: [
        {
          label: "Predicted Values",
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

  // Fetch stored prediction data when the component mounts.
  useEffect(() => {
    const fetchStoredPrediction = async () => {
      try {
        const response = await getUserprediction();
        if (response && response.data) {
          // Merge the top-level last_information_date with the stored data.
          const storedData = {
            ...response.data,
            last_information_date: response.last_information_date,
          };
          setCurrentData(storedData);
          buildChartData(storedData);
        }
      } catch (error) {
        console.error("Error fetching stored prediction data:", error);
      }
    };

    fetchStoredPrediction();
  }, []);

  // Handle the prediction process.
  const handlePredict = async () => {
    setIsLoading(true);
    try {
      // Call the prediction API (which might take some time).
      const res = await getUserPredict();
      // Update currentData with the new prediction result.
      setCurrentData(res);
      buildChartData(res);

      // Automatically store the new prediction in the database.
      const admin = JSON.parse(localStorage.getItem("user"));
      const adminId = admin && admin.id;

      console.log("adminid", adminId);
      if (!adminId) {
        alert("Admin ID not found in local storage.");
        return;
      }

      const accuracy = res.metrics.accuracy.toString() * 100;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const payload = {
        // Convert values to strings as required by your API.
        Accuracy: accuracy.toString() + "%",
        PredictedDate: formattedDate, // Ensure this date format matches your backend validation.
        "7DaysReport": res.predictions.next_7_days.toString(),
        "14DaysReport": res.predictions.next_14_days.toString(),
        "28DaysReport": res.predictions.next_28_days.toString(),
        AdminId: adminId,
      };

      await storeUserprediction(payload);
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
      <h2>User Prediction Information</h2>

      {/* Display last predicted date and accuracy if available */}
      {currentData && (
        <div>
          <p>
            Last Predicted Date:{" "}
            <strong>
              {currentData.last_information_date || currentData.PredictedDate}
            </strong>
          </p>
          <p>
            Accuracy:{" "}
            <strong>
              {currentData.Accuracy ||
                (currentData.metrics && currentData.metrics.accuracy)}
            </strong>
          </p>
        </div>
      )}
      <button onClick={handlePredict} disabled={isLoading}>
        {isLoading ? "Predicting..." : "Make Predict"}
      </button>

      {/* Display the bar chart if data is available */}
      {chartData ? (
        <Bar data={chartData} options={{ responsive: true }} />
      ) : (
        <p>No prediction data available.</p>
      )}
    </div>
  );
}

export default UserPrediction;
