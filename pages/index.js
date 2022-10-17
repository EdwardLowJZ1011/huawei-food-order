import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import MUIDataTable from "mui-datatables";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import PageTitle from "../utils/components/PageTitle";
import ModalHandler from "../utils/common/modalHandler";
import {
  database,
  ref,
  onValue,
} from "../firebase";
import "react-datepicker/dist/react-datepicker.css";

export default function Home(props) {
  const post = { title: "Daily Lunch Order" };
  const [orders, setOrders] = useState({ columns: [], data: [] });

  useEffect(() => {
    const orderRef = "food";
    var tableContent = [];
    const formatYmd = (date) => date.toLocaleString('en-CA').slice(0, 10);
    var date = formatYmd(new Date());
    const _orderRef = ref(database, orderRef + "/" + date);
    onValue(_orderRef, (snapshot) => {
      const data = snapshot.val();
      const dataObj = {};
      if (data) {
        const persons = Object.keys(data);
        persons.forEach((person) => {
          dataObj['Name'] = person
          const order_details = Object.keys(data[person])
          order_details.forEach((order) =>{
            if (order == 'TNG'){
              if (data[person][order]=='1')
                dataObj[order] = '✔️​ ';
              else
                dataObj[order] = '❌​ ';
            }else{
              dataObj[order] = data[person][order];
            }
            
          });
          tableContent.push(Object.values(dataObj))
        });
        setOrders({ columns: Object.keys(dataObj), data: tableContent });
      }
    });
  }, [orders]);

  const options = {
    rowsPerPage: [5],
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
    <div classNameName={styles.container}>
      <div></div>
      <PageTitle page={post} />
      <section id="content">
        <div className="content-wrap">
          <div className="container clearfix">
            <h5>
              <Link href="/food-order-history">
                <a className="history-link">
                  {" "}
                  &gt;&gt;&gt; Food Order History{" "}
                </a>
              </Link>
            </h5>
            <br />
            <div className="image-container">
              <h3>Food Menu</h3>
              <img
                height={300}
                width={300}
                src={props.menuImage.length == 0 ? "" : props.menuImage[0]}
                onClick={(e) => {
                  ModalHandler("enlargeMenu");
                }}
              />
              <br />
              <br />
              <div className="show-more-btn">
                <a
                  className="link-button"
                  onClick={(e) => ModalHandler("uploadModal")}
                >
                  {" "}
                  Upload{" "}
                </a>{" "}
                <font> </font>
                <a
                  className="link-button"
                  onClick={(e) => ModalHandler("orderModal")}
                >
                  +Order
                </a>
              </div>
            </div>
            <br />
            <MUIDataTable
              title={"Today's Order List"}
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
