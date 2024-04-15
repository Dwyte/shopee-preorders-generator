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
import { ToOrderListSimple } from "./scripts";

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

export interface ToOrderListsItem {
  id: number;
  datetime: string;
  toOrderList: ToOrderListSimple;
}

export const getToOrderLists = async (user: string) => {
  try {
    const docRef = collection(db, "toOrderLists");
    const q = query(docRef, where("user", "==", user));
    const snap = await getDocs(q);

    return snap.docs.map((doc) => doc.data()) as ToOrderListsItem[];
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const addToOrderList = async (
  user: string,
  toOrderList: ToOrderListSimple
) => {
  try {
    const docRef = await addDoc(collection(db, "toOrderLists"), {
      user,
      datetime: new Date().toISOString(),
      toOrderList,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getToOrderListsLocal = (user: string) => {
  return JSON.parse(localStorage.getItem(user) || "[]");
};

const addToOrderListLocal = (user: string, toOrderList: ToOrderListSimple) => {
  const toOrderLists: ToOrderListsItem[] = JSON.parse(
    localStorage.getItem(user) || "[]"
  );

  toOrderLists.push({
    id: toOrderLists.length,
    datetime: new Date().toISOString(),
    toOrderList,
  });

  localStorage.setItem(user, JSON.stringify(toOrderLists));
};
