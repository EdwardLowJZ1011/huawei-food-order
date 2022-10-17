import React, { useState, useEffect } from "react";
import { listAll } from "firebase/storage";
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

export function getMenuImageURL(){
  
  const [menuImage, setmenuImage] = useState([]);

  const getMenuImage = () => {
    const menuRef = ref(database, "menu");
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      const filename = data["filename"];

      const listRef = sref(storage, `food`);
      listAll(listRef).then((res) => {
        res.items.forEach((item) => {
          if (item.name == filename) {
            getDownloadURL(item).then((url) => {
              setmenuImage([url]);
            });
          }
        });
      });
    });
  };

  useEffect(() => {
    getMenuImage();
  }, []);

  return menuImage;
};