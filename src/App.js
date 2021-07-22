import React, { useState, useEffect } from "react";
import fetch from './mockData/mockCustomerData';
import { useTable } from 'react-table'
import "./App.css";
import _ from 'lodash';

function calculateRewardPoints(customerData) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", 
    "May", "Jun", "Jul", "Aug", 
    "Sep", "Oct", "Nov", "Dec"];
  const transactionPoints = customerData.map(transaction => {
    let points = 0;
    let over100 = transaction.amountSpent - 100;

    if (over100 > 0) {
      points += (over100 * 2);
    }

    if (transaction.amountSpent > 50) {
      points += 50;
    }

    const month = new Date(transaction.transctionDate).getMonth();
    return { ...transaction, points, month };
  });

  let byCustomer = {};
  let totalPointsByCustomer = {};

  transactionPoints.map(transactionPoints => {
    
    let { customerId, customerName, month, points } = transactionPoints;

    if (!byCustomer[customerId]) {
      byCustomer[customerId] = [];
    }

    if (!totalPointsByCustomer[customerName]) {
      totalPointsByCustomer[customerName] = 0;
    }
    totalPointsByCustomer[customerName] += points;

    if (byCustomer[customerId][month]) {
      byCustomer[customerId][month].points += points;
      byCustomer[customerId][month].monthNumber = month;
      byCustomer[customerId][month].numTransactions++;
    }
    else {
      byCustomer[customerId][month] = {
        customerId,
        customerName,
        monthNumber: month,
        month: months[month],
        numTransactions: 1,
        points
      }
    }
  });

  let total = [];
  for (var custKey in byCustomer) {
    byCustomer[custKey].forEach(cRow => {
      total.push(cRow);
    });
  }

  let totalCustomerSpent = [];
  for (custKey in totalPointsByCustomer) {
    debugger;
    totalCustomerSpent.push({
      customerName: custKey,
      points: totalPointsByCustomer[custKey]
    });
  }

  return {
    summaryByCustomer: total,
    transactionPoints,
    totalPointsByCustomer: totalCustomerSpent
  };
}

const columns = [
  {
    Header: 'Customer Name',
    accessor: 'customerName'
  },
  {
    Header: 'Transaction Month',
    accessor: 'month'
  },
  {
    Header: "No of Transactions",
    accessor: 'numTransactions'
  },
  {
    Header: 'Reward Points',
    accessor: 'points'
  }
];

const pointsColumn = [
  {
    Header: 'Customer Name',
    accessor: 'customerName'
  },
  {
    Header: 'Total Reward Points',
    accessor: 'points'
  }
];

function App() {
  const [transactionData, setTransactionData] = useState([]);
  const [customrData, setCustomerData] = useState([]);
  const firstTable = useTable({
    columns,
    data: transactionData,
  })

  const secondTable = useTable({
    columns: pointsColumn,
    data: customrData,
  })

  useEffect(() => {
    fetch().then((data) => {
      const results = calculateRewardPoints(data);
      setTransactionData(results.summaryByCustomer);
      setCustomerData(results.totalPointsByCustomer)
    });
  }, []);

  if (transactionData == null) {
    return <div>Empty Data</div>;
  }

  return (<div>
    <div className="container">
      <div className="row">
        <div className="col-10">
          <h2 className="Header">Customer Total points by Month</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <table {...firstTable.getTableProps()}>
            <thead>
              {firstTable.headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...firstTable.getTableBodyProps()}>
              {firstTable.rows.map((row, i) => {
                firstTable.prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div className="container">
      <div className="row">
        <div className="col-10">
          <h2>Total Points Earned By Customer</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <table {...secondTable.getTableProps()}>
            <thead>
              {secondTable.headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...secondTable.getTableBodyProps()}>
              {secondTable.rows.map((row, i) => {
                secondTable.prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;