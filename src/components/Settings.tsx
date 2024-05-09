import { Divider, Stack, Switch, Typography } from "@mui/material";

const Settings = () => {
  return (
    <div>
      <Stack direction="row" alignItems="center">
        <Typography sx={{ flex: 1 }} fontWeight="bold" variant="h6">
          Enable New DTS Info file Reminder
        </Typography>

        <Switch />
      </Stack>
      <Typography variant="subtitle1">
        This will remove the currently saved DTS File and will show an alert to
        user to generate a new one from Shopee. The Reminder will be
        automatically disabled once a new DTS file has been used. Enable this if
        you recently uploaded new products.
      </Typography>
      <Divider sx={{ mt: 1 }} />
    </div>
  );
};

export default Settings;
