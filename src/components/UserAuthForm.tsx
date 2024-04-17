import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const USERS = ["CJ", "Shia", "Jenna", "Freya", "Xander"];

const UserAuthForm = (props: {
  currentUser: string;
  handleUserChange: (event: SelectChangeEvent<string>) => void;
}) => {
  const label = props.currentUser
    ? "Change User/Shop Owner"
    : "Select User/Shop Owner";

  return (
    <FormControl size="small" fullWidth sx={{ my: 1 }}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.currentUser}
        label={label}
        onChange={props.handleUserChange}
      >
        {USERS.map((user, index) => (
          <MenuItem key={index} value={user}>
            {user}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UserAuthForm;
