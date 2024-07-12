import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import TextareaAutosize from "./TextareaAutosize";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { getNewOrders, parseMinerList, updateOrderNote } from "../bigsellerAPI";
import { useContext, useState } from "react";
import UserSettingsContext from "../contexts/UserSettingsContext";

enum LiveNotesState {
  Initial,
  Loading,
  Done,
}

const LiveNotes = () => {
  const label = "Select Date";
  const [minersListText, setMinersListText] = useState("");
  const [progressText, setProgressText] = useState("");
  const [currentState, setCurrentState] = useState<LiveNotesState>(
    LiveNotesState.Initial
  );
  const [progress, setProgress] = useState(0);
  const { userSettings } = useContext(UserSettingsContext);

  const handleSendNotesToBigSeller = async () => {
    setCurrentState(LiveNotesState.Loading);
    setProgress(0);

    const COOKIE = userSettings?.bigSellerCookie || "";

    const newOrdersResponse = await getNewOrders(COOKIE);
    if (newOrdersResponse.data === null) {
      alert("Request to BigSeller failed, try resetting cookie.");
      return new Error("Request to BigSeller failed, check cookie.");
    }

    const newOrders = newOrdersResponse.data.page.rows;
    let ordersNoMinerCodeCount = 0;
    const uniqueMiners = new Set();

    const parsedMinerList = parseMinerList(minersListText);
    for (let i = 0; i < newOrders.length; i++) {
      const order = newOrders[i];

      const minedCodes = [];

      // Check if the current order buyername has mined codes.
      for (let minerListItem of parsedMinerList) {
        for (let miners of minerListItem.miners) {
          if (miners.includes(order.buyerUsername)) {
            minedCodes.push(minerListItem.code);
            uniqueMiners.add(order.buyerUsername);
          }
        }
      }

      if (minedCodes.length > 0) {
        const orderNote = minedCodes.join(", ");
        await updateOrderNote(order.id, orderNote, COOKIE);
        console.log(`Code for ${order.buyerUsername} is ${orderNote}`);
      } else {
        ordersNoMinerCodeCount += 1;
      }

      setProgress(Math.round(((i + 1) / newOrders.length) * 100));
    }

    console.log(parsedMinerList);

    setProgressText(`
    Total ${parsedMinerList.length} codes.\n
    ${parsedMinerList.reduce(
      (accum, currentValue) => accum + currentValue.miners.length,
      0
    )} bundles mined.\n
    ${uniqueMiners.size} unique miners checkout.
    ${ordersNoMinerCodeCount} checkout but no mine.
    `);

    setCurrentState(LiveNotesState.Done);
  };
  console.log(progress);
  return (
    <Box>
      <Stack direction={"row"} spacing={1}>
        <FormControl size="small" sx={{ mt: 2, mb: 1, flex: 1 }} disabled>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label={label}
            value={"Latest"}
          >
            <MenuItem value={"Latest"}>UNDER DEVELOPMENT</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" color="error" disabled>
          <DeleteIcon />
        </Button>
        <Button variant="outlined" color="success" disabled>
          <SaveIcon />
        </Button>

        <Button
          startIcon={<SendIcon />}
          variant="contained"
          color="info"
          onClick={handleSendNotesToBigSeller}
          disabled={currentState === LiveNotesState.Loading}
        >
          SET ORDER NOTES
        </Button>
      </Stack>
      <TextareaAutosize
        sx={{ mt: 1 }}
        minRows={20}
        maxRows={20}
        placeholder="Start typing... "
        onChange={(e) => setMinersListText(e.target.value)}
        value={minersListText}
        disabled={currentState === LiveNotesState.Loading}
      />
      {currentState === LiveNotesState.Loading && (
        <LinearProgress variant="determinate" value={progress} />
      )}

      {currentState === LiveNotesState.Done && (
        <Alert>Success! {progressText}</Alert>
      )}
    </Box>
  );
};

export default LiveNotes;
