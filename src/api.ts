// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { GeneratedList, UserGeneratedList } from "./types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_WZT3BDrkfYqSGg4smPNLhWvVe_t31Js",
  authDomain: "shop-preorder-generator.firebaseapp.com",
  projectId: "shop-preorder-generator",
  storageBucket: "shop-preorder-generator.appspot.com",
  messagingSenderId: "782039057009",
  appId: "1:782039057009:web:c8b6e3985140f6e12a51d0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const GENERATED_LISTS_COLLECTION_NAME = "generatedLists";

export const getUserGeneratedListsLocal = (user: string) => {
  return JSON.parse(localStorage.getItem(user) || "[]");
};

export const addUserGeneratedListLocal = (
  user: string,
  generatedList: GeneratedList
) => {
  const userGeneratedLists: UserGeneratedList[] =
    getUserGeneratedListsLocal(user);

  const newUserGeneratedList = {
    user,
    datetime: new Date().toISOString(),
    generatedList,
  };

  userGeneratedLists.push(newUserGeneratedList);
  localStorage.setItem(user, JSON.stringify(userGeneratedLists));
  return newUserGeneratedList;
};

export const getUserGeneratedLists = async (user: string) => {
  try {
    const docRef = collection(db, GENERATED_LISTS_COLLECTION_NAME);
    const q = query(docRef, where("user", "==", user));
    const snap = await getDocs(q);

    return snap.docs.map((doc) => doc.data()) as UserGeneratedList[];
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const addUserGeneratedList = async (
  user: string,
  generatedList: GeneratedList
) => {
  const newDocData = {
    user,
    datetime: new Date().toISOString(),
    generatedList,
  };

  try {
    const docRef = await addDoc(
      collection(db, GENERATED_LISTS_COLLECTION_NAME),
      newDocData
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return newDocData;
};
