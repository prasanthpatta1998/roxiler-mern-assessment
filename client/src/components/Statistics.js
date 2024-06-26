import React, { useEffect, useState } from "react";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/transactions/statistics?month=${month}`
        );
        if (response.ok) {
          const data = await response.json();
          setStatistics(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatisticsData();
  }, [month]);
  return (
    <>
      <h2>Statistics - {month}</h2>
      <article>
        <div>
          <p className="total-sale">Total Sale</p>
          <p>{statistics.totalSaleAmount}</p>
        </div>
        <div>
          <p className="total-sale">Total sole items</p>
          <p>{statistics.totalSoldItems}</p>
        </div>
        <div>
          <p className="total-sale">Total not sold items </p>
          <p>{statistics.totalNotSoldItems}</p>
        </div>
      </article>
    </>
  );
};

export default Statistics;
