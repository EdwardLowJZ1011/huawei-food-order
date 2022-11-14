import React, { useState, useEffect } from "react";
import ModalHandler from "../common/modalHandler";
import getMenuImageURL from "../common/getMenuImage";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import MUIDataTable from "mui-datatables";
import { database, ref, onValue, query, orderByChild } from "../../firebase";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "./Modal";

export default function Cafe(props) {
  const [orders, setOrders] = useState({ columns: [], data: [] });
  const [cafe, SetCafe] = useState("LaLa");
  const [menuImage, setmenuImage] = useState([]);
  const [paymentImage, setPaymentImage] = useState([]);
  
  const tableColumns = cafe == 'LaLa' ? ["Name", "Order","Level", "Remark", "Amount","TNG", "OrderTime"] : ["Name", "Order", "Level", "Remark", "TNG", "OrderTime"] ;
  
  function bblSort(arr){
      var orderTimeIndex = tableColumns.indexOf('OrderTime')
      for(var i = 0; i < arr.length; i++){
        for(var j = 0; j < ( arr.length - i -1 ); j++){
          if(arr[j][orderTimeIndex] > arr[j+1][orderTimeIndex]){
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j+1] = temp
          }
        }
      }

      for(var i = 0; i < arr.length; i++)
        arr[i][orderTimeIndex] = 
        new Date(arr[i][orderTimeIndex]).toTimeString().split(" ")[0];

      return arr
  
  }

  const getOrderDetail = () => { 
    const orderSqc = []
    const orderRef = `food/${cafe}`;
    const formatYmd = (date) => date.toLocaleString("en-CA").slice(0, 10);
    var date = formatYmd(new Date());
    const _orderRef = ref(database, orderRef + "/" + date);
    
    onValue(_orderRef, (snapshot) => {
      const data = snapshot.val();
      const dataObj = {};

      if (data) {
        const persons = Object.keys(data);
        persons.forEach((person) => {
          const dataObj = {};
          dataObj["Name"] = person;
          var order_details = Object.keys(data[person]);
          tableColumns.forEach((c) => {
            if (c == "TNG") {
              if (data[person][c] == "1") dataObj[c] = "✔️​ ";
              else dataObj[c] = "❌​ ";
            } else if (c == "Amount") {
              dataObj[c] = "RM"+data[person][c];
            } else {
              if (order_details.includes(c)) {
                if (c == "OrderTime") {
                  dataObj[c] = parseInt(data[person][c])
                } else if (c == 'Level'){
                  dataObj[c] = "L"+data[person][c]
                }
                else dataObj[c] = data[person][c];
              }else if(!Object.keys(dataObj).includes(c)){
                  dataObj[c] = '';
              }
            }
          });
          orderSqc.push(Object.values(dataObj));
        });
        orderSqc = bblSort(orderSqc)
      }
    });
    // orderSqc = await bblSort(orderSqc)
    // console.log('orderSqc', orderSqc.length)
    setOrders({ columns: tableColumns, data: orderSqc });
    
  }

  useEffect(() => {
    getOrderDetail()
    getMenuImageURL(menuImage, setmenuImage, cafe, 'filename');
    getMenuImageURL(paymentImage, setPaymentImage, cafe, 'paymentImage');
  }, [cafe]);

  const renderTabs = () => {
    return (
      <Tabs defaultActiveKey={cafe}
        id="controlled-tab-example"
        className="mb-3"
        activeKey={cafe}
        onSelect={(k) => SetCafe(k)}
      >
        <Tab eventKey="LaLa" title="LaLa Restaurant">
        </Tab>
        <Tab eventKey='Khasiat' title="Khasiat">
        </Tab>
        
      </Tabs>
    );
  };
  const options = {
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

  const generateTable = () => {
    return (
      <>
        <div className="image-container">
          <h3>Food Menu</h3>
          <img
            height={520}
            width={520}
            src={menuImage.length == 0 ? "" : menuImage[0]}
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
        <h3>Total Orders: {orders.data.length}</h3>
        <MUIDataTable
          title={"Today's Order List"}
          data={orders && orders.data}
          columns={orders && orders.columns}
          options={options}
        />
      </>
    );
  };

  return (
    <>
      <Modal menuImage={menuImage} paymentImage={paymentImage} cafe={cafe} />
      {renderTabs()}
      {generateTable()}
    </>
  );
}
