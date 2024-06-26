import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const ranges = [
  "0-100",
  "101-200",
  "201-300",
  "301-400",
  "401-500",
  "501-600",
  "601-700",
  "701-800",
  "801-900",
  "901-above",
];

const BarChartStats = ({ month }) => {
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/transactions/bar-chart?month=${month}`
        );
        if (response.ok) {
          const data = await response.json();
          const countsData = data.map((each) => {
            if (ranges.includes(each.range)) return each.count;
            else return 0;
          });
          setCounts([...countsData]);
        }
      } catch (err) {
        console.log("Server Error");
      }
    };
    fetchBarChartData();
  }, [month]);

  return (
    <>
      <h2>Bar Chart Stats - {month}</h2>
      <BarChart
        xAxis={[{ scaleType: "band", data: ranges }]}
        series={[{ data: counts }]}
        width={1300}
        height={300}
      />
    </>
  );
};

export default BarChartStats;
