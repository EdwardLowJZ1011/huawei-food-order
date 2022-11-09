import { useState } from "react";
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

const getMenuImageURL = (menuImage, setMenuImage, cafe, name) => {

  const menuRef = ref(database, `cafe/${cafe}`);
  onValue(menuRef, (snapshot) => {
    const data = snapshot.val();
    const filename = data[name];
    const listRef = sref(storage, `food`);
    listAll(listRef).then((res) => {
      res.items.forEach((item) => {
        if (item.name == filename) {
          getDownloadURL(item).then((url) => {
            setMenuImage([url]);
          });
        }
      });
    });
  });

  return menuImage;
};

export default getMenuImageURL;
