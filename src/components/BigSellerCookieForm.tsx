import { useContext, useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

import UserSettingsContext from "../contexts/UserSettingsContext";
import { updateUserBigSellerCookie } from "../api";

const BigSellerCookieForm = () => {
  const { currentUser, userSettings, setUserSettings } =
    useContext(UserSettingsContext);

  const [cookie, setCookie] = useState(userSettings?.bigSellerCookie || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await updateUserBigSellerCookie(currentUser, cookie);

    setUserSettings((prev) => {
      if (!prev) return prev;
      return { ...prev, bigSellerCookie: cookie };
    });

    setIsEditing(false);
  };

  return (
    <div>
      <Stack direction="row" alignItems="center">
        <Typography sx={{ flex: 1 }} fontWeight="bold" variant="h6">
          BigSeller Authorization Cookie
        </Typography>
        {isEditing && (
          <Button
            size="small"
            color="success"
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        )}

        {!isEditing && (
          <Button
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            variant="contained"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </Button>
        )}
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle1">
          Used for posting Live notes to Order Notes from BigSeller.
        </Typography>
      </Stack>

      <TextField
        fullWidth
        size="small"
        placeholder="Paste Cookie here..."
        onChange={(e) => {
          setCookie(e.target.value);
        }}
        disabled={!isEditing}
        value={cookie}
      />
    </div>
  );
};

export default BigSellerCookieForm;
