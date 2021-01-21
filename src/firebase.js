import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";
// Initialize Firebase
const firebaseSet = firebase.initializeApp(firebaseConfig);
export const storage = firebaseSet.storage();
export const auth = firebaseSet.auth();
export const firestore = firebaseSet.firestore();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp();

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
      comment: [],
    };
    try {
      await userRef.set(data);
    } catch (error) {
      alert("error crating user", error.message);
    }
  }
};
export default firebaseSet;
