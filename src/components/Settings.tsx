import { Divider, Stack, Switch, Typography } from "@mui/material";
import { setUserHasNewItemsRecently } from "../api";
import { Dispatch, SetStateAction, useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { UserSettings } from "../types";
import SupplierCodeMapping from "./SupplierCodeMappingForm";

type Props = {
  userSettings: UserSettings | null;
  setUserSettings: Dispatch<SetStateAction<UserSettings | null>>;
};

const Settings = ({ userSettings, setUserSettings }: Props) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleHasNewItemsRecently = () => {
    setUserSettings((prev) => {
      if (prev === null) return prev;

      setUserHasNewItemsRecently(prev.user, !prev.hasNewItemsRecently);

      return { ...prev, hasNewItemsRecently: !prev.hasNewItemsRecently };
    });
  };

  return (
    userSettings && (
      <div>
        <Stack direction="row" alignItems="center">
          <Typography sx={{ flex: 1 }} fontWeight="bold" variant="h6">
            Enable New DTS Info file Reminder
          </Typography>

          <Switch
            checked={userSettings.hasNewItemsRecently}
            onChange={toggleHasNewItemsRecently}
          />
        </Stack>
        <Typography variant="subtitle1">
          Enable this if you recently uploaded new products. This will show an
          reminder to generate a new one DTS file fro m Shopee. This will be
          automatically disabled once a new DTS file has been used.
        </Typography>
        <Divider sx={{ mt: 1 }} />

        <Stack direction="row" alignItems="center">
          <Typography sx={{ flex: 1 }} fontWeight="bold" variant="h6">
            Dark Mode
          </Typography>

          <Switch checked={theme === "dark"} onChange={toggleTheme} />
        </Stack>
        <Typography variant="subtitle1">
          Turn on for Dark mode, off for Light Mode.
        </Typography>

        <Divider sx={{ mt: 1 }} />
        <SupplierCodeMapping />
      </div>
    )
  );
};

export default Settings;
