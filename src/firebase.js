import firebase from "firebase/app";
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
export const firestore = firebaseSet.firestore();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp();
export const timetoDate = (e) => {
  return e.firebase.firestore.Timestamp.toDate();
};

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export const createNewUser = async (userAuth) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const onsnapShot = await userRef.get();

  if (!onsnapShot.exists) {
    const createAt = new Date();
    const data = {
      displayName: userAuth.displayName,
      email: userAuth.email,
      userID: userAuth.uid,
      createAt: createAt,
    };
    try {
      await userRef.set(data);
    } catch (error) {
      alert("error crating user", error.message);
    }
  }
};
export default firebaseSet;
