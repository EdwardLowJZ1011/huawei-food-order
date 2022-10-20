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
  const [nameExisted, setNamExisted] = useState(false);

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const recordLatestUploadMenu = (filename) => {
    const d = new Date();
    let time = d.getTime();
    const menuRef = ref(database, "menu");

    set(menuRef, { filename: filename, uploadtime: time }).then(() => {
      alert("upload successfully");
    });
  };

  const uploadMenu = () => {
    const unique_id = uuid();
    const small_id = unique_id.slice(0, 8);
    console.log(images[0]);
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
    console.log(formatYmd(startDate))
    const data = {
      "Order": order ? order : '',
      "Remark": remark ? remark : '',
      "TNG": remark ? remark : '0',
      "OrderTime": new Date().getTime()
    }

    const orderRef = ref(database, "food");

    // data[] = _Order
    const loc = "food/" + formatYmd(startDate) + '/'+ name;
    const _orderRef = ref(database, loc);
    onValue(_orderRef, (snapshot) => {
      const _data = snapshot.val();
      if (_data){
        setNamExisted(true);
      }else{
        setNamExisted(false);
      }
    });

    if (nameExisted){
      _confirm = confirm('Name Existed, are you sure to overwrite the previous record?')
    }
    console.log(_confirm)
    
    if (_confirm){
      console.log(data)
      set(_orderRef, data).then(() => {
        console.log('Done')
      }).catch(function(error){
        console.log(error)
      });
  
      setName('');
      setOrder('');
      setRemark('');
      setTNG('');
      document.querySelector('#template-terms').checked = false;
    }
    
  };

  return (
    <>
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
                      onChange={(e) => setOrder(e.target.value)}
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
                      // name="template-contactform-submit"
                    >
                      Send
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
