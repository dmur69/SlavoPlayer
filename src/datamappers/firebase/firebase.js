import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // not database - this is the old version
import "firebase/compat/storage"; // for music upload

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOAPP-7rLsDcAACSyl5cOPwzqHGziOEEw",
  authDomain: "slavoplayer.firebaseapp.com",
  projectId: "slavoplayer",
  storageBucket: "slavoplayer.appspot.com",
  // messagingSenderId: "40514221839",
  appId: "1:40514221839:web:9b630d7bfe54b87843307a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const users = db.collection("users");
const tracks = db.collection("tracks");

export {
  auth,
  db, // db storage for meta data (user, tracks)
  storage, // storage for files / tracks
  users, // user collection in db
  tracks // track collection in db
};
