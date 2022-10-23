import styles from "../../styles/Home.module.css";
import PageTitle from "../../utils/components/PageTitle";
import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from "react";
// import { getPosts } from "../api/getPosts";
import { database, app, ref, onValue } from "../../firebase";

export function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

export default function Blogs() {
  const post = { title: "Food Order History" };
  const [orders, setOrders] = useState({ columns: [], data: [] });
  const tableColumns = ["Date", "Name", "Order", "Remark", "TNG", "OrderTime"];

  useEffect(() => {
    const orderRef = "food";
    var tableContent = [];
    const formatYmd = (date) => date.toLocaleString("en-CA").slice(0, 10);
    var recent_7_days = [];

    for (var i = 6; i >= 0; i--) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      recent_7_days.push(formatYmd(date));
    }

    recent_7_days.forEach((date) => {
      const dataObj = {};
      const _orderRef = ref(database, orderRef + "/" + date);

      onValue(_orderRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const persons = Object.keys(data);
          persons.forEach((person) => {
            dataObj["Date"] = date;
            dataObj["Name"] = person;
            const order_details = Object.keys(data[person]);
            tableColumns.forEach((c) => {
              if (c == "TNG") {
                if (data[person][c] == "1") dataObj[c] = "✔️​ ";
                else dataObj[c] = "❌​ ";
              } else {
                if (order_details.includes(c)) {
                  if (c == "OrderTime") {
                    dataObj[c] = new Date(parseInt(data[person][c]))
                      .toTimeString()
                      .split(" ")[0];
                  } else dataObj[c] = data[person][c];
                }
              }
            });
            tableContent.push(Object.values(dataObj));
          });
        }
      });
    });

    setOrders({ columns: tableColumns, data: tableContent });
  }, [orders]);

  const options = {
    filterType: "checkbox",
    rowsPerPage: [50],
    rowsPerPageOptions: [1, 5, 10, 20, 50],
    jumpToPage: true,
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "Pages",
        displayRows: "OF",
      },
    },
    onChangePage(currentPage) {
      console.log({ currentPage });
    },
    onChangeRowsPerPage(numberOfRows) {
      console.log({ numberOfRows });
    },
  };

  return (
    <div className={styles.container}>
      <PageTitle page={post} />
      <section id="content">
        <div className="content-wrap">
          <div className="container clearfix">
            <MUIDataTable
              title={"Recent 7 days"}
              data={orders && orders.data}
              columns={orders && orders.columns}
              options={options}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
