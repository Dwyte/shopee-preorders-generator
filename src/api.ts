// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
``;
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { GeneratedList, UserGeneratedList } from "./types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_WZT3BDrkfYqSGg4smPNLhWvVe_t31Js",
  authDomain: "shop-preorder-generator.firebaseapp.com",
  projectId: "shop-preorder-generator",
  storageBucket: "gs://shop-preorder-generator.appspot.com",
  messagingSenderId: "782039057009",
  appId: "1:782039057009:web:c8b6e3985140f6e12a51d0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const GENERATED_LISTS_COLLECTION_NAME = "generatedLists";
const USER_SETTINGS_COLLECTION_NAME = "userSettings";

export const getUserGeneratedLists = async (user: string) => {
  try {
    const docRef = collection(db, GENERATED_LISTS_COLLECTION_NAME);
    const q = query(
      docRef,
      where("user", "==", user),
      orderBy("datetime", "desc")
    );
    const snapshots = await getDocs(q);
    const snapshotsData = snapshots.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as UserGeneratedList[];

    return snapshotsData;
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
    id: "",
    user,
    datetime: Date.now(),
    generatedList,
  };

  try {
    const docRef = await addDoc(
      collection(db, GENERATED_LISTS_COLLECTION_NAME),
      newDocData
    );

    newDocData.id = docRef.id;
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return newDocData;
};

export const updateUserGeneratedList = async (
  docId: string,
  newUserGeneratedListDocData: {}
) => {
  const docRef = doc(db, GENERATED_LISTS_COLLECTION_NAME, docId);
  await updateDoc(docRef, {
    ...newUserGeneratedListDocData,
    updateTime: Date.now(),
  });
  console.log("Updated doc", docId);
};

export const deleteUserGeneratedList = async (docId: string) => {
  const docRef = doc(db, GENERATED_LISTS_COLLECTION_NAME, docId);
  await deleteDoc(docRef);
  console.log("Deleted doc", docId);
};

export const uploadFile = async (file: File, directory: string) => {
  // Create Storage Reference
  const storageRef = ref(storage, `${directory}/${file.name}`);
  const metadata = {
    contentType: file.type,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    await file.arrayBuffer(),
    metadata
  );

  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log(downloadURL);
  return downloadURL;
};

export const deleteFIle = async (directory: string) => {
  const storageRef = ref(storage, directory);

  await deleteObject(storageRef);
  console.log("Delete Done!");
};

export const uploadUserDTSFiles = async (user: string, files: File[]) => {
  // Upload new files, and store file directories
  const newDTSFiles = [];
  for (let file of files) {
    await uploadFile(file, `${user}/dts-files`);
    newDTSFiles.push(`${user}/dts-files`);
  }

  // Get Current User Settings
  const userSettingsCollectionRef = collection(
    db,
    USER_SETTINGS_COLLECTION_NAME
  );

  const q = query(userSettingsCollectionRef, where("user", "==", user));
  const userSettings = (await getDocs(q)).docs[0];

  // Delete current DTS Files
  for (let fileDir of userSettings.data().dtsFiles) {
    const storageRef = ref(storage, fileDir);
    await deleteObject(storageRef);
  }

  // Update user settings with new Dts files directories
  const docRef = doc(db, GENERATED_LISTS_COLLECTION_NAME, userSettings.id);
  await updateDoc(docRef, { dtsFiles: newDTSFiles });

  console.log("Updated user settings", user);
};
