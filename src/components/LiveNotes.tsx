import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import TextareaAutosize from "./TextareaAutosize";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";

const LiveNotes = () => {
  const label = "Select Date";

  return (
    <Box>
      <Stack direction={"row"} spacing={1}>
        <FormControl size="small" sx={{ mt: 2, mb: 1, flex: 1 }}>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label={label}
            value={"Latest"}
          >
            <MenuItem value={"Latest"}>Latest</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" color="error">
          <DeleteIcon />
        </Button>
        <Button variant="outlined" color="success">
          <SaveIcon />
        </Button>

        <Button startIcon={<SendIcon />} variant="contained" color="info">
          Post
        </Button>
      </Stack>

      <TextareaAutosize
        sx={{ mt: 1 }}
        minRows={10}
        placeholder="Start typing... "
      />
    </Box>
  );
};

export default LiveNotes;
