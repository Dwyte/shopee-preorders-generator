import { createContext } from "react";
import { UserSettings } from "../types";

export default createContext<{
  currentUser: string;
  userSettings: null | UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>;
}>({
  currentUser: "",
  userSettings: null,
  setUserSettings: () => {},
});
