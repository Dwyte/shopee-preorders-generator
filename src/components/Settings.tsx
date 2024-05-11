import { Divider, Stack, Switch, Typography } from "@mui/material";
import { getUserSettings, setUserHasNewItemsRecently } from "../api";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "../contexts/ThemeContext";

const Settings = ({ currentUser }: { currentUser: string }) => {
  const [hasNewItemsRecently, setHasNewItemsRecently] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const initializeUserSettings = async () => {
      const userSettings = await getUserSettings(currentUser);
      console.log(userSettings);
      if (userSettings?.hasNewItemsRecently) {
        setHasNewItemsRecently(true);
      }
    };

    setHasNewItemsRecently(false);
    initializeUserSettings();
  }, [currentUser]);

  return (
    <div>
      <Stack direction="row" alignItems="center">
        <Typography sx={{ flex: 1 }} fontWeight="bold" variant="h6">
          Enable New DTS Info file Reminder
        </Typography>

        <Switch
          checked={hasNewItemsRecently}
          onChange={() => {
            setHasNewItemsRecently(!hasNewItemsRecently);
            setUserHasNewItemsRecently(currentUser, !hasNewItemsRecently);
          }}
        />
      </Stack>
      <Typography variant="subtitle1">
        Enable this if you recently uploaded new products. This will show an
        reminder to generate a new one DTS file from Shopee. This will be
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
    </div>
  );
};

export default Settings;
