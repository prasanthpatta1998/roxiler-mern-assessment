import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import "../App.css";
import Statistics from "./Statistics";
import BarChartStats from "./BarChartStats";
import { IoIosArrowDown } from "react-icons/io";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Transactions = () => {
  const [data, setData] = useState({
    search: "",
    month: "March",
    page: 1,
  });
  const [transactionsData, setTransactionsData] = useState([]);
  const { search, month, page } = data;

  const fetchTransactionsData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/transactions?search=${search}&page=${page}&perPage=10&month=${month}`
      );
      if (response.ok) {
        const data = await response.json();
        setTransactionsData([...data]);
      }
    } catch (err) {
      console.log(err);
    }
  }, [search, page, month]);

  useEffect(() => {
    const debounceFetchTransactionData = debounce(() => {
      fetchTransactionsData();
    }, 500);

    debounceFetchTransactionData();

    return () => {
      debounceFetchTransactionData.cancel();
    };
  }, [fetchTransactionsData]);

  const handleData = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nextPage = () => setData({ ...data, page: page + 1 });

  const previousPage = () => {
    if (page > 1) setData({ ...data, page: page - 1 });
  };

  return (
    <section className="transaction-container">
      <div className="heading">
        <h1>
          Transaction <br /> Dashboard
        </h1>
      </div>
      <section className="search-container">
        <input
          type="search"
          name="search"
          value={search}
          onChange={(e) => handleData(e)}
          placeholder="Search Transaction"
        />
        <div style={{ position: "relative" }}>
          <select
            name="month"
            value={month}
            onChange={(e) => handleData(e)}
            placeholder="Select Month"
          >
            {monthNames.map((eachOne, i) => (
              <option key={i} value={eachOne}>
                {eachOne}
              </option>
            ))}
          </select>
          <div className="icon-container">
            <IoIosArrowDown />
          </div>
        </div>
      </section>
      {transactionsData?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactionsData.map((eachOne) => {
              return (
                <tr key={eachOne.id}>
                  <td>{eachOne.id}</td>
                  <td>{eachOne.title}</td>
                  <td>{eachOne.description.slice(0, 10)}</td>
                  <td>{eachOne.price}</td>
                  <td>{eachOne.category}</td>
                  <td>{`${eachOne.sold}`}</td>
                  <td>
                    <img height={50} src={eachOne.image} alt={eachOne.title} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="empty-array">There is nothing to view</p>
      )}
      <section className="paginations">
        <p>Page No: {page}</p>
        <div>
          <button onClick={() => nextPage()}>Next</button>-
          <button onClick={() => previousPage()}>Previous</button>
        </div>
        <p>Per Page: 10</p>
      </section>
      <Statistics month={month} />
      <BarChartStats month={month} />
    </section>
  );
};

export default Transactions;
