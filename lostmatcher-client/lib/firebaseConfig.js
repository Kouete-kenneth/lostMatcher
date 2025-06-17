// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCleGojIXjD8yib1u5XDKNG4mAl-ah06cA",
  authDomain: "findit-3a7d0.firebaseapp.com",
  projectId: "findit-3a7d0",
  storageBucket: "findit-3a7d0.appspot.com",
  messagingSenderId: "89064889796",
  appId: "1:89064889796:web:4cb4b1aa79d2577b221891",
  measurementId: "G-BS8QQ9VPBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export{
    storage
}