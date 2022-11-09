import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import ImageUploading from "react-images-uploading";
import ModalHandler from "../common/modalHandler";
import {
  app,
  database,
  storage,
  set,
  push,
  ref,
  sref,
  onValue,
  uploadBytesResumable,
  getDownloadURL,
} from "../../firebase";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { NorthWest } from "@mui/icons-material";

export default function Modal(props) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 1;
  const [startDate, setStartDate] = useState(new Date());
  const [name, setName] = useState();
  const [order, setOrder] = useState();
  const [remark, setRemark] = useState();
  const [TNG, setTNG] = useState();
  const [percent, setPercent] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [nameExisted, setNamExisted] = useState(false);

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    // console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const cal_Order = (orders) =>{
      var veg = 0
      var meal = 0
      var amount = 0
      for (var i = 0; i <= orders.length; i++){
          if (parseInt(orders.charAt(i))){
              var order = parseInt(orders.charAt(i))
              veg += order >= 1 && order <= 3 ? 1 : 0
              meal += order >= 4 && order <= 6 ? 1 : 0
          }
      }

      amount = veg == 1 && meal == 1 ? 8 : veg == 2 && meal == 1 ? 9 : 0
      
      setPayAmount(amount)
      setOrder(orders)

  }

  const recordLatestUploadMenu = (filename) => {
    const d = new Date();
    let time = d.getTime();
    const menuRef = ref(database, `cafe/${props.cafe}`);

    set(menuRef, { filename: filename, uploadtime: time , paymentImage: 'IMG-20221108-WA0001.jpg'}).then(() => {
      alert("upload successfully");
    });
  };

  const uploadMenu = () => {
    const unique_id = uuid();
    const small_id = unique_id.slice(0, 8);
    // console.log(images[0]);
    const menuid = small_id + images[0].file.name;
    const storageRef = sref(storage, `food/${menuid}`);
    const uploadTask = uploadBytesResumable(storageRef, images[0].file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          ModalHandler("uploadModal");
          recordLatestUploadMenu(menuid);
        });
      }
    );
  };

  const submitForm =  async (e) => {
    e.preventDefault();
    const _confirm = true;
    const formatYmd = (date) => date.toLocaleString('en-CA').slice(0, 10);
    // console.log(formatYmd(startDate))
    const data = props.cafe == 'Khasiat' ?{
      "Order": order ? order : '',
      "Remark": remark ? remark : '',
      "TNG": TNG ? TNG : '0',
      "OrderTime": new Date().getTime()
    }: {
      "Order": order ? order : '',
      "Remark": remark ? remark : '',
      "TNG": TNG ? TNG : '0',
      "OrderTime": new Date().getTime(),
      "Amount": payAmount
    }

    const orderRef = ref(database, "food");

    // data[] = _Order
    const loc = `food/${props.cafe}/` + formatYmd(startDate) + '/'+ name;
    const _orderRef = ref(database, loc);
    onValue(_orderRef, (snapshot) => {
      const _data = snapshot.val();
      console.log(data)
      if (_data){
        setNamExisted(true);
      }else{
        setNamExisted(false);
      }
    });

    if (nameExisted){
      _confirm = confirm('Name Existed, are you sure to overwrite the previous record?')
    }
    
    if (_confirm){
      // console.log(data)
      set(_orderRef, data).then(() => {
        console.log('Done')
      }).catch(function(error){
        console.log(error)
      });
  
      setName('');
      setOrder('');
      setRemark('');
      setTNG('');
      setPayAmount(0);

      document.querySelector('#template-terms').checked = false;
      setNamExisted(false);
    }
    
  };

  return (
    <>
      <div id="paymentModal" className="payment-image-modal">
        <span
          className="close"
          onClick={(e) => ModalHandler('paymentModal')}
        >
          &times;
        </span>
        <img
          className="payment-image-modal-content"
          src={props.paymentImage.length == 0 ? "" : props.paymentImage[0]}
          alt={'TNG Payment'}
        />
        <div id="caption"></div>
      </div>

      <div id="enlargeMenu" className="menu-image-modal">
        <span
          className="close"
          onClick={(e) => ModalHandler('enlargeMenu')}
        >
          &times;
        </span>
        <img
          className="menu-image-modal-content"
          src={props.menuImage.length == 0 ? "" : props.menuImage[0]}
          alt={'menu'}
        />
        <div id="caption"></div>
      </div>

      <div id="uploadModal" className="modalcss">
        <div className="modal-content">
          <div id="modalheaderid" className="modal-header">
            Upload Menu
            <span
              className="close-x"
              onClick={(e) => ModalHandler("uploadModal")}
            >
              &times;
            </span>
            <h2 id="modalheader"></h2>
          </div>
          <div className="modal-body" id="modal-body-content">
            <div style={{ "text-align": "center" }}>
              <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper">
                    {imageList.length > 0 ? (
                      imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <span
                            style={{ "margin-left": "32%" }}
                            onClick={() => onImageRemove(index)}
                          >
                            <font
                              style={{ color: "red", "font-style": "bold" }}
                            >
                              x
                            </font>
                          </span>
                          <div>
                            <img
                              src={image["data_url"]}
                              alt=""
                              width="220"
                              height="220"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <img height={220} width={220} />
                    )}
                    <div className="show-more-btn">
                      <a
                        className="link-button"
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Choose File
                      </a>{" "}
                      <a className="link-button" onClick={(e) => uploadMenu()}>
                        Submit
                      </a>
                    </div>
                  </div>
                )}
              </ImageUploading>
            </div>
          </div>
          <div className="modal-footer" id="modalfooterid">
            <p>Have a nice day, Enjoying your lunch..</p>
          </div>
        </div>
      </div>
      <div id="orderModal" className="modalcss">
        <div className="modal-content">
          <div id="modalheaderid" className="modal-header">
            Food Order
            <span
              className="close-x"
              onClick={(e) => ModalHandler("orderModal")}
            >
              &times;
            </span>
            <h2 id="modalheader"></h2>
          </div>
          <div className="modal-body" id="modal-body-content">
            <div className="card-body">
              <div className="form-widget">
                <div className="form-result"></div>
                <form
                  className="row mb-0"
                  id="template-orderform"
                  // name="template-orderform"
                  onSubmit={submitForm}>
                  <div className="col-12 form-group mb-10">
                    <label htmlFor="template-order-date">Date:</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </div>
                  <div className="col-20 form-group mb-3">
                    <label htmlFor="template-order-name">
                      Name:<font style={{ color: "red" }}>*</font>{" "}
                    </label>
                    <input
                      type="text"
                      id="template-order-name"
                      // name="template-order-name"
                      className="form-control input-sm required"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 form-group mb-3">
                    <label htmlFor="template-order-food">
                      Food Order: <font style={{ color: "red" }}>*</font>
                    </label>
                    <input
                      type="text"
                      id="template-order-food"
                      // name="template-order-food"
                      className="form-control input-sm required"
                      value={order}
                      onChange={(e) => {props.cafe == 'LaLa'? cal_Order(e.target.value) : setOrder(e.target.value)}}
                      required
                    />
                  </div>
                  <div className="col-12 form-group mb-4">
                    <label htmlFor="template-messages">
                      Remark:<font style={{ color: "red" }}>*</font>{" "}
                    </label>
                    <input
                      type="text"
                      id="template-messages"
                      // name="template-messages"
                      className="form-control input-sm required"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </div>
                  {props.cafe == 'LaLa' && (<>
                    <div className="col-12 form-group mb-4">
                      <div className="contact-checkbox">
                        <font>Pay Amount: </font><b>RM {payAmount}</b> <i><font style={{'font-size': '12px'}}>(estimated)</font></i>
                      </div>
                    </div>
                  </>)}
                  <div className="col-12 form-group mb-4">
                    <div className="contact-checkbox">
                      <input
                        type="checkbox"
                        id="template-terms"
                        // name="template-terms"
                        onChange={(e) => setTNG(e.target.checked ? 1 : 0)}
                      />
                      <label
                        htmlFor="template-terms"
                        className="form-terms"
                        style={{ "padding-left": "10px" }}
                      >
                        <font style={{ color: "red" }}>*</font> Done Payment Via
                        TNG
                      </label>
                    </div>

                    <br></br>
                  </div>
                  <div className="col-12 form-group mb-0">
                    <button
                      type="submit"
                      className="button button-rounded w-100 nott ls0 m-0"
                      id="template-contactform-submit"
                      onClick={(e)=>ModalHandler("paymentModal")}
                      // name="template-contactform-submit"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-footer" id="modalfooterid">
            <p>Have a nice day, Enjoying your lunch..</p>
          </div>
        </div>
      </div>
    </>
  );
}
