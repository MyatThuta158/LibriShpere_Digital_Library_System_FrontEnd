import React, { useState, Suspense } from "react";

const MembershipRevenue = React.lazy(() => import("./MembershipRevenue"));
const TotalRevenueReport = React.lazy(() => import("./TotalRevenueReport"));

function RevenueReport() {
  const [reportType, setReportType] = useState("");

  const renderReport = () => {
    switch (reportType) {
      case "Each Membership":
        return <MembershipRevenue />;
      case "Total Membership":
        return <TotalRevenueReport />;
      default:
        return <MembershipRevenue />;
    }
  };

  return (
    <div>
      <label>Select Report Type: </label>
      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
      >
        <option value="Each Membership">Each Membership</option>
        <option value="Total Membership">Total Membership</option>
      </select>

      <div style={{ marginTop: "20px" }}>
        <Suspense fallback={<div>Loading...</div>}>{renderReport()}</Suspense>
      </div>
    </div>
  );
}

export default RevenueReport;
