// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, push,ref, set, onValue, query, orderByChild } from "firebase/database";
import { ref as sref, getStorage, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcRGwzNtzOPAk5kpaocntlU2C0PBh-Qdc",
  authDomain: "mooncake-361822.firebaseapp.com",
  databaseURL: "https://mooncake-361822-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mooncake-361822",
  storageBucket: "mooncake-361822.appspot.com",
  messagingSenderId: "311781459991",
  appId: "1:311781459991:web:9b38a1953dee9aaf01b452",
  measurementId: "G-TQRTQ8DRFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export {app, database, set, push, ref, sref, storage, onValue, uploadBytesResumable, getDownloadURL, query, orderByChild };
