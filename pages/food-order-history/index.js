import styles from "../../styles/Home.module.css";
import PageTitle from "../../utils/components/PageTitle";
import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from "react";
// import { getPosts } from "../api/getPosts";
import { database, app, ref, onValue } from "../../firebase";

export function GetSortOrder(prop) {    
  return function(a, b) {    
      if (a[prop] > b[prop]) {    
          return 1;    
      } else if (a[prop] < b[prop]) {    
          return -1;    
      }    
      return 0;    
  }    
}  

export default function Blogs() {
  const post = { title: "Food Order History" };
  const [orders, setOrders] = useState({ columns: [], data: [] });

  useEffect(() => {
    const orderRef = "food";
    var tableContent = [];
    const formatYmd = (date) => date.toLocaleString('en-CA').slice(0, 10);
    var recent_7_days = [];

    for (var i = 6; i >= 0; i--) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      recent_7_days.push(formatYmd(date));
    }

    recent_7_days.forEach((date) => {
      const dataObj = {};
      const _orderRef = ref(database, orderRef + "/" + date);
      dataObj['Date'] = date;

      onValue(_orderRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const persons = Object.keys(data);
          persons.forEach((person) => {
            dataObj["Name"] = person;
            const order_details = Object.keys(data[person]);
            order_details.forEach((order) => {
              if (order == "TNG") {
                if (data[person][order] == "1") dataObj[order] = "✔️​ ";
                else dataObj[order] = "❌​ ";
              } else {
                dataObj[order] = data[person][order];
              }
            });
            tableContent.push(Object.values(dataObj));
          });
          // tableContent.sort(GetSortOrder('Date'))
          // tableContent.sort(GetSortOrder('OrderTime'))
          delete tableContent['OrderTime'];
          delete dataObj['OrderTime'];
          setOrders({ columns: Object.keys(dataObj), data: tableContent });
        }
      });
    });
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
