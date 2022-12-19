import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
<<<<<<< HEAD
import { getStorage } from "firebase/storage";
=======
import { getStorage } from "firebase/storage"
import { getAuth }  from "firebase/auth";
>>>>>>> 9840bf7c45422810c6bf5b9e3f376eb36f46fce6

const firebaseConfig = {
  apiKey: "AIzaSyBD1VNUKdFIG1fcAJmdxY04UphjV80NWH0",
  authDomain: "fashionstyle-f8229.firebaseapp.com",
  databaseURL: "https://fashionstyle-f8229-default-rtdb.firebaseio.com",
  projectId: "fashionstyle-f8229",
  storageBucket: "fashionstyle-f8229.appspot.com",
  messagingSenderId: "935521268704",
  appId: "1:935521268704:web:92a8d64920630d06a07185",
  measurementId: "G-Z1RFD7JHJE"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };