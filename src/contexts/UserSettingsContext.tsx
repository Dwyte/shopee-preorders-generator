import { createContext } from "react";
import { UserSettings } from "../types";

export default createContext<{
  userSettings: null | UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>;
}>({
  userSettings: null,
  setUserSettings: () => {},
});
