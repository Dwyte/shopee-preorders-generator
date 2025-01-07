// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Storage for storing files
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getBlob,
  getMetadata,
} from "firebase/storage";

// Firestore for storing JSON Documents like MongoDB
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
import {
  GeneratedList,
  LiveNotes,
  UserGeneratedList,
  UserSettings,
} from "./types";

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
const LIVE_NOTES_COLLECTION_NAME = "liveNotes";

const generatedListsCollection = collection(
  db,
  GENERATED_LISTS_COLLECTION_NAME
);

const userSettingsCollection = collection(db, USER_SETTINGS_COLLECTION_NAME);

const liveNotesCollection = collection(db, LIVE_NOTES_COLLECTION_NAME);

/**
 *
 * @param user the name of the user
 * @returns array of the user's generated lists
 */
export const getUserGeneratedLists = async (user: string) => {
  try {
    const q = query(
      generatedListsCollection,
      where("user", "==", user),
      orderBy("datetime", "desc")
    );

    const results = await getDocs(q);
    const resultsData = results.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as UserGeneratedList[];

    return resultsData;
  } catch (e) {
    alert("Something went wrong.");
    console.error("Error getting documents: ", e);
    return [];
  }
};

/**
 *
 * @param user the name of the current user uploading a generated list.
 * @param generatedList the new generated list to be added to the database
 * @returns the saved document of the generated list from the database
 */
export const addUserGeneratedList = async (
  user: string,
  generatedList: GeneratedList
) => {
  const newUserGeneratedList = {
    id: "",
    user,
    datetime: Date.now(),
    generatedList,
  };

  try {
    const newDoc = await addDoc(generatedListsCollection, newUserGeneratedList);

    // Get Id, so we can return newUserGeneratedList with the id generated from DB
    newUserGeneratedList.id = newDoc.id;

    console.log("Document written with ID: ", newDoc.id);
  } catch (e) {
    alert("Something went wrong.");
    console.error("Error adding document: ", e);
  }

  return newUserGeneratedList;
};

/**
 *
 * @param docId the docId of the userGeneratedList to update/modify
 * @param newUserGeneratedListDocData the new version of the userGeneratedList after the changes
 */
export const updateUserGeneratedList = async (
  docId: string,
  newUserGeneratedListDocData: {}
) => {
  const docRef = doc(db, GENERATED_LISTS_COLLECTION_NAME, docId);
  await updateDoc(docRef, {
    ...newUserGeneratedListDocData,
    // Everytime it updates, set a new updateTime
    updateTime: Date.now(),
  });
  console.log("Updated doc", docId);
};

/**
 *
 * @param docId the id of the userGeneratedList to delete
 */
export const deleteUserGeneratedList = async (docId: string) => {
  const docRef = doc(db, GENERATED_LISTS_COLLECTION_NAME, docId);
  await deleteDoc(docRef);
  console.log("Deleted doc", docId);
};

/**
 *
 * @param file the file to upload
 * @param directory where to store the file
 * @returns the download url
 */
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
  console.log(`${file.name} uploaded: `, downloadURL);
  return downloadURL;
};

/**
 *
 * @param directory the file directory to delete
 */
export const deleteFIle = async (directory: string) => {
  try {
    const storageRef = ref(storage, directory);
    await deleteObject(storageRef);

    console.log("Delete Done!");
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param user the name of user
 * @returns the user's userSettings
 */
export const getUserSettings = async (user: string) => {
  const q = query(userSettingsCollection, where("user", "==", user));
  const userSettings = (await getDocs(q)).docs[0];

  // HOT FIX
  return { ...userSettings.data(), id: userSettings.id } as UserSettings;
};

/**
 *
 * @param user the name of the current logged in user
 * @param files the DTS files to upload
 * @returns null
 */
export const uploadUserDTSFiles = async (user: string, files: File[]) => {
  if (!user || !files) {
    console.error("Invalid arguments: ", user, files);
    return;
  }

  // Get Current User Settings
  const userSettings = await getUserSettings(user);

  // Delete current DTS Files
  for (let fileDir of userSettings.dtsFiles) {
    await deleteFIle(fileDir);
  }

  // Upload new files, and store file directories
  const newDTSFiles = [];
  for (let file of files) {
    await uploadFile(file, `dts-files/${user}`);
    newDTSFiles.push(`dts-files/${user}/${file.name}`);
  }

  // Update user settings with new Dts files directories
  console.log(USER_SETTINGS_COLLECTION_NAME, userSettings.id);
  const docRef = doc(db, USER_SETTINGS_COLLECTION_NAME, userSettings.id);
  await updateDoc(docRef, { dtsFiles: newDTSFiles });

  console.log("Updated user settings", user, files);
};

/**
 *
 * @param user the current logged in user
 * @param newValue the new value for hasNewItemsRecently settings
 */
export const setUserHasNewItemsRecently = async (
  user: string,
  newValue: boolean
) => {
  const userSettings = await getUserSettings(user);

  const docRef = doc(db, USER_SETTINGS_COLLECTION_NAME, userSettings.id);
  await updateDoc(docRef, { hasNewItemsRecently: newValue });
};

export const updateSupplierCodeMapping = async (
  user: string,
  newSupplierCodeMapping: { [key: string]: string }
) => {
  const userSettings = await getUserSettings(user);
  const docRef = doc(db, USER_SETTINGS_COLLECTION_NAME, userSettings.id);
  await updateDoc(docRef, { supplierCodeMapping: newSupplierCodeMapping });
};

export const updateUserBigSellerCookie = async (
  user: string,
  newBigSellerCookie: string
) => {
  const userSettings = await getUserSettings(user);
  const docRef = doc(db, USER_SETTINGS_COLLECTION_NAME, userSettings.id);
  await updateDoc(docRef, { bigSellerCookie: newBigSellerCookie });
};

/**
 * @param user the name of the user to download the dts files
 * @returns array of File object containing the DTS files of the user argument
 */
export const downloadUserDTSFiles = async (user: string) => {
  const userSettings = await getUserSettings(user);
  const userDTSFiles = [];

  for (let fileDir of userSettings.dtsFiles) {
    try {
      const storageRef = ref(storage, fileDir);
      const fileMetadata = await getMetadata(storageRef);
      // const downloadURL = await getDownloadURL(storageRef);
      const fileBlob = await getBlob(storageRef);
      const fileDirSplit = fileDir.split("/");
      const fileName = fileDirSplit[fileDirSplit.length - 1];
      console.log("OMG", fileMetadata.generation);
      const dtsFile = new File([fileBlob], fileName, {
        lastModified: parseInt(
          fileMetadata.generation.substring(
            0,
            fileMetadata.generation.length - 3
          )
        ),
      });

      userDTSFiles.push(dtsFile);
    } catch (error) {
      console.error(error);
    }
  }

  return userDTSFiles;
};

/**
 *
 * @param user
 * @param liveNotes
 * @returns
 */
export const addLiveNotes = async (user: string, liveNotes: string) => {
  const newLiveNotes: LiveNotes = {
    user,
    datetime: Date.now(),
    liveNotes,
  } as LiveNotes;

  const newDoc = await addDoc(liveNotesCollection, newLiveNotes);
  newLiveNotes.id = newDoc.id;

  return newLiveNotes;
};

/**
 *
 * @param user
 * @param liveNotes
 * @returns
 */
export const updateLiveNotes = async (docId: string, newLiveNote: string) => {
  const docRef = doc(db, LIVE_NOTES_COLLECTION_NAME, docId);
  await updateDoc(docRef, {
    liveNotes: newLiveNote,
  });
  console.log("Updated doc", docId);
};

/**
 *
 * @param user
 * @param liveNotes
 * @returns
 */
export const getLiveNotes = async (user: string) => {
  const q = query(
    liveNotesCollection,
    where("user", "==", user),
    orderBy("datetime", "desc")
  );

  const results = await getDocs(q);
  const resultsData = results.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as LiveNotes[];

  return resultsData;
};

/**
 *
 * @param docId the id of the userGeneratedList to delete
 */
export const deleteUserLiveNote = async (docId: string) => {
  const docRef = doc(db, LIVE_NOTES_COLLECTION_NAME, docId);
  await deleteDoc(docRef);
  console.log("Deleted doc", docId);
};

export const extractBundleCodes = (liveNotes: LiveNotes[]) => {
  const bundleCodes = new Set<string>([]);
  for (let liveNote of liveNotes) {
    // Get all lines
    let lines = liveNote.liveNotes.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i].trim();

      if (currentLine.includes("CODE:")) {
        // Remove common metadata added to code. only [A-Z and dash]
        const bundleCode = currentLine
          .toUpperCase()
          .replace("CODE:", "")
          .replace("SOLD", "")
          .replace("OUT", "")
          .replace("MINERS", "")
          .replace(/[^a-zA-Z-]/g, "")
          .trim();

        if (bundleCode) {
          bundleCodes.add(bundleCode);
        }
      }
    }
  }

  return Array.from(bundleCodes);
};

/**
 * Replaces the current bundleCodes saved [localstorage]
 * @param bundleCodes
 */
export const saveBundleCodes = (user: string, bundleCodes: string[]) => {
  localStorage.setItem(`bundleCodes-${user}`, JSON.stringify(bundleCodes));
};

export const getBundleCodes = (user: string): string[] => {
  const bundleCodes = localStorage.getItem(`bundleCodes-${user}`);
  if (bundleCodes) {
    return JSON.parse(bundleCodes);
  }
  return [];
};
