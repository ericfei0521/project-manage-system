import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnF_8P9k9V4OgtGFsQrhuJYmCqpvBGo2g",
  authDomain: "the-raven-a298b.firebaseapp.com",
  databaseURL: "https://the-raven-a298b.firebaseio.com",
  projectId: "the-raven-a298b",
  storageBucket: "the-raven-a298b.appspot.com",
  messagingSenderId: "222763002405",
  appId: "1:222763002405:web:e2491e57fd111268966dcc",
  measurementId: "G-CS8NB1M8K5",
};

// Initialize Firebase
const firebaseSet = firebase.initializeApp(firebaseConfig);
export const auth = firebaseSet.auth();
export default firebaseSet;
