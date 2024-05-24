import { createContext } from "react";
import { UserSettings } from "../types";

export default createContext<UserSettings | null>(null);
