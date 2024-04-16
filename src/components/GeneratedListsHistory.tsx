import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { UserGeneratedList } from "../types";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface PropType {
  userGeneratedLists: UserGeneratedList[];
  currentUserGeneratedList: UserGeneratedList | null;
  handleSelectedListChange: (event: SelectChangeEvent<string>) => void;
}

const GeneratedListsHistory = (props: PropType) => {
  const label = "Select Date";
  console.log(props.currentUserGeneratedList);

  return (
    <FormControl fullWidth size="small" sx={{ my: 1 }}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={label}
        onChange={props.handleSelectedListChange}
        value={props.currentUserGeneratedList?.datetime.toString() || ""}
      >
        {props.userGeneratedLists.map((generatedList, index) => (
          <MenuItem key={index} value={generatedList.datetime}>
            {new Date(generatedList.datetime).toLocaleString()} (
            {daysOfWeek[new Date(generatedList.datetime).getDay()]})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GeneratedListsHistory;
