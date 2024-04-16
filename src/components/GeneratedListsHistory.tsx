import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { UserGeneratedList } from "../types";

interface PropType {
  userGeneratedLists: UserGeneratedList[];
  handleSelectedListChange: (event: SelectChangeEvent<string>) => void;
}

const GeneratedListsHistory = (props: PropType) => {
  const label = "History";

  return (
    <FormControl fullWidth size="small" sx={{ my: 1 }}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={label}
        onChange={props.handleSelectedListChange}
      >
        {props.userGeneratedLists.map((generatedList, index) => (
          <MenuItem value={index}>{generatedList.datetime}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GeneratedListsHistory;
