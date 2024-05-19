// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAulnM5Kk-Hd0HZt0h6DaC5iTmEQykAAeI",
  authDomain: "jsbtn-f6633.firebaseapp.com",
  projectId: "jsbtn-f6633",
  storageBucket: "jsbtn-f6633.appspot.com",
  messagingSenderId: "822174011990",
  appId: "1:822174011990:web:a2ca5f05f54c679648a1f7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export { auth, db, firestore };
