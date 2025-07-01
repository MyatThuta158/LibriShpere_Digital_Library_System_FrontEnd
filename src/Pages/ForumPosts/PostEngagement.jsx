import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  postsEngagement,
  totalEngagement,
  showUseruploadedPost,
} from "../../api/forumpostApi"; // Adjust the import path accordingly
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PostEngagement() {
  const [reportData, setReportData] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState("7_days");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [engagementMetrics, setEngagementMetrics] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  // Helper function to render truncated text with a clickable "see more" link
  const renderTruncatedText = (text, postId, wordLimit = 20) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return (
      <>
        {words.slice(0, wordLimit).join(" ")}{" "}
        <Link to={`/community/postdetail/${postId}`} style={{ color: "blue" }}>
          see more
        </Link>
      </>
    );
  };

  // Fetch the user id from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedUserId = user?.id;
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("No userId found in local storage.");
      setLoading(false);
    }
  }, []);

  // Fetch chart report data
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      try {
        const data = await postsEngagement(userId);
        setReportData(data.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  // Fetch overall engagement metrics
  useEffect(() => {
    async function fetchEngagementMetrics() {
      if (!userId) return;
      try {
        const response = await totalEngagement(userId);
        if (response.success) {
          setEngagementMetrics(response.data);
        } else {
          console.error("totalEngagement API call unsuccessful:", response);
        }
      } catch (error) {
        console.error("Error fetching total engagement data:", error);
      }
    }
    fetchEngagementMetrics();
  }, [userId]);

  // Fetch individual user posts
  useEffect(() => {
    async function fetchUserPosts() {
      if (!userId) return;
      try {
        const response = await showUseruploadedPost(userId);
        if (response.success) {
          setUserPosts(response.data);
        } else {
          console.error("Failed to fetch user posts:", response);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    }
    fetchUserPosts();
  }, [userId]);

  // Handle interval change for the chart
  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!reportData) {
    return <div>No report data available.</div>;
  }

  // Chart section: extract the data for the selected interval
  const intervalData = reportData[selectedInterval] || [];
  const labels = intervalData.map((item) => {
    const date = new Date(item.date);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  });
  const dataValues = intervalData.map((item) => item.total_views);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Views",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  // Dynamic ticks limit based on the selected interval
  const getMaxTicksLimit = () => {
    switch (selectedInterval) {
      case "60_days":
        return 30;
      case "28_days":
        return 28;
      case "14_days":
        return 14;
      default:
        return 7;
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Post Engagement (${selectedInterval.replace("_", " ")})`,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: getMaxTicksLimit(),
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Overall metrics for the selected interval
  const currentMetrics = engagementMetrics
    ? engagementMetrics[selectedInterval]
    : null;

  // Calculate maximum views among posts for the progress bar scaling
  const maxViews =
    userPosts.length > 0
      ? Math.max(...userPosts.map((post) => post.PostViews))
      : 0;

  return (
    <div className="container mt-4">
      <h2>Post Engagement Report</h2>
      <div className="mb-3">
        <label htmlFor="intervalSelect">Select Interval: </label>
        <select
          id="intervalSelect"
          value={selectedInterval}
          onChange={handleIntervalChange}
          className="form-select w-auto d-inline-block ms-2"
        >
          <option value="7_days">7 Days</option>
          <option value="14_days">14 Days</option>
          <option value="28_days">28 Days</option>
          <option value="60_days">60 Days</option>
        </select>
      </div>

      {/* Engagement Summary Boxes */}
      <div style={{ overflowX: "hidden" }}>
        <div className="row mb-4">
          {/* Post Views Box */}
          <div
            className="col-md-6"
            style={{ minWidth: "300px", padding: "10px" }}
          >
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">
                  Post Views ({selectedInterval.replace("_", " ")})
                </h5>
                <h2 className="card-text">
                  {currentMetrics ? currentMetrics.total_views : "N/A"}
                </h2>
              </div>
            </div>
          </div>
          {/* User Uploaded Posts Box */}
          <div
            className="col-md-6"
            style={{ minWidth: "300px", padding: "10px" }}
          >
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">
                  User Uploaded Posts ({selectedInterval.replace("_", " ")})
                </h5>
                <h2 className="card-text">
                  {currentMetrics ? currentMetrics.total_posts : "N/A"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", height: "500px" }}>
        <Bar data={chartData} options={options} />
      </div>

      {/* Posts Display Section */}
      <div className="mt-5">
        <h3>Your Posts</h3>
        {userPosts.length > 0 ? (
          <div className="row">
            {userPosts.map((post) => (
              <div key={post.ForumPostId} className="col-md-6 mb-4">
                <div className="card h-100">
                  {/* {post.Photo1 && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${post.Photo1}`}
                      alt={post.Title}
                      className="card-img-top"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                      onError={(e) => {
                        // Hide image if it fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )} */}
                  <div className="card-body">
                    <h5 className="card-title">{post.Title}</h5>
                    <p className="card-text">
                      {renderTruncatedText(post.Description, post.ForumPostId)}
                    </p>
                    <small className="text-muted">
                      Posted on:{" "}
                      {new Date(post.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="card-footer">
                    <div className="mb-2">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: maxViews
                              ? `${(post.PostViews / maxViews) * 100}%`
                              : "0%",
                          }}
                          aria-valuenow={post.PostViews}
                          aria-valuemin="0"
                          aria-valuemax={maxViews}
                        >
                          {post.PostViews} Views
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <Link
                        to={`/community/postdetail/${post.ForumPostId}`}
                        className="btn btn-primary"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default PostEngagement;
