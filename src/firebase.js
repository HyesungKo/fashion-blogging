import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

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

export { db, storage }