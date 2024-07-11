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
import { getNewOrders, parseMinerList, updateOrderNote } from "../bigsellerAPI";
import { useContext, useState } from "react";
import UserSettingsContext from "../contexts/UserSettingsContext";

const LiveNotes = () => {
  const label = "Select Date";
  const [minersListText, setMinersListText] = useState("");
  const [progressText, setProgressText] = useState("");
  const { userSettings } = useContext(UserSettingsContext);

  const handleSendNotesToBigSeller = async () => {
    const COOKIE = userSettings?.bigSellerCookie || "";

    const newOrdersResponse = await getNewOrders(COOKIE);
    if (newOrdersResponse.data === null) {
      alert("Request to BigSeller failed, try resetting cookie.");
      return new Error("Request to BigSeller failed, check cookie.");
    }

    const newOrders = newOrdersResponse.data.page.rows;
    let minerHasCheckoutCount = 0;
    const parsedMinerList = parseMinerList(minersListText);
    for (let order of newOrders) {
      const minedCodes = [];
      for (let minerListItem of parsedMinerList) {
        for (let miners of minerListItem.miners) {
          if (miners.includes(order.buyerUsername)) {
            minedCodes.push(minerListItem.code);
          }
        }
      }

      if (minedCodes.length > 0) {
        minerHasCheckoutCount += 1;
        const orderNote = minedCodes.join(", ");
        await updateOrderNote(order.id, orderNote, COOKIE);
        console.log(`Code for ${order.buyerUsername} is ${orderNote}`);
      }
    }

    console.log(parsedMinerList);

    setProgressText(`
    ${parsedMinerList.length} codes.\n
    ${parsedMinerList.reduce(
      (accum, currentValue) => accum + currentValue.miners.length,
      0
    )} bundles mined.\n
    ${minerHasCheckoutCount} miners has checkout.
    `);
  };

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
      />
      Logs:
      {progressText}
    </Box>
  );
};

export default LiveNotes;
