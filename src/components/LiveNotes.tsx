import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import TextareaAutosize from "./TextareaAutosize";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { getNewOrders, parseMinerList, updateOrderNote } from "../bigsellerAPI";
import { useContext, useEffect, useRef, useState } from "react";
import UserSettingsContext from "../contexts/UserSettingsContext";
import { timestampToDatetimeText } from "../scripts";
import { LiveNotes } from "../types";
import {
  addLiveNotes,
  deleteUserLiveNote,
  getLiveNotes,
  updateLiveNotes,
} from "../api";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

enum LiveNotesState {
  Initial,
  Loading,
  Done,
}

const liveNotesTextAreaPlaceholder = `Use the following format:
CODE: <Enter Code Here> (Space after "CODE:" is important)
<miner/buyer 1>        
<miner/buyer 2>        
<miner/buyer 3>

CODE: <Enter Code Here>
<miner/buyer 1>       
<miner/buyer 2>    

CODE: <Enter Code Here>
<miner/buyer 1>

(Click NEW CODE-MINERS TEMPLATE to autofill the following format)
`

const newLiveNoteTemplate: LiveNotes = {
  id: "",
  user: "",
  liveNotes: "",
  datetime: -1,
};

const LiveNotesPage = () => {
  const label = "Select Date";
  const [currentUserLiveNote, setCurrentLiveNote] =
    useState<LiveNotes>(newLiveNoteTemplate);
  const [userLiveNotes, setUserLiveNotes] = useState<LiveNotes[]>([]);
  const [minersListText, setMinersListText] = useState("");
  const [progressText, setProgressText] = useState("");
  const [currentState, setCurrentState] = useState<LiveNotesState>(
    LiveNotesState.Initial
  );
  const [progress, setProgress] = useState(0);
  const { currentUser, userSettings } = useContext(UserSettingsContext);

  const minersListTextInput = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const initializeLiveNotes = async () => {
      console.log(currentUser);
      if (currentUser) {
        const liveNotes = await getLiveNotes(currentUser);
        setUserLiveNotes(liveNotes);
      }
    };

    initializeLiveNotes();
  }, []);

  const handleDelete = async () => {
    setCurrentState(LiveNotesState.Loading);
    if (currentUserLiveNote.id !== "") {
      await deleteUserLiveNote(currentUserLiveNote.id);

      setUserLiveNotes((prev) => {
        return prev.filter((v) => v.id !== currentUserLiveNote.id);
      });
      setMinersListText("");
      setCurrentLiveNote(newLiveNoteTemplate);
    } else {
      setCurrentLiveNote(newLiveNoteTemplate);
    }
    setProgressText("Live Note Deleted!");
    setCurrentState(LiveNotesState.Done);
  };

  const handleSelectedLiveNotesChange = (event: SelectChangeEvent<string>) => {
    const userLiveNote = userLiveNotes.find(
      (v) => v.datetime === parseInt(event.target.value)
    );

    if (userLiveNote) {
      setCurrentLiveNote(userLiveNote);
      setMinersListText(userLiveNote.liveNotes);
    } else {
      setCurrentLiveNote(newLiveNoteTemplate);
      setMinersListText(newLiveNoteTemplate.liveNotes);
    }
  };

  const saveNewUserLiveNote = async () => {
    const newUserLiveNote = await addLiveNotes(currentUser, minersListText);
    setUserLiveNotes((prev) => {
      return [newUserLiveNote, ...prev];
    });
    setCurrentLiveNote(newUserLiveNote);
  };

  const updateUserLiveNote = async () => {
    await updateLiveNotes(currentUserLiveNote.id, minersListText);
    setCurrentLiveNote((prev) => ({ ...prev, liveNotes: minersListText }));
    setUserLiveNotes((prev) => {
      return prev.map((value) => {
        if (value.id === currentUserLiveNote.id)
          return { ...value, liveNotes: minersListText };
        return value;
      });
    });
  };

  const handleSave = async () => {
    setCurrentState(LiveNotesState.Loading);
    if (currentUserLiveNote.datetime === -1) {
      await saveNewUserLiveNote();
    } else {
      await updateUserLiveNote();
    }
    setCurrentState(LiveNotesState.Done);
    setProgressText("Changes saved.");
  };

  const handleSendNotesToBigSeller = async () => {
    setCurrentState(LiveNotesState.Loading);
    setProgress(0);

    const COOKIE = userSettings?.bigSellerCookie || "";

    const newOrdersResponse = await getNewOrders(COOKIE);
    if (newOrdersResponse.data === null) {
      alert("Request to BigSeller failed, try resetting cookie.");
      setCurrentState(LiveNotesState.Initial);
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

    setProgressText(`
    Total ${parsedMinerList.length} codes.\n
    ${parsedMinerList.reduce(
      (accum, currentValue) => accum + currentValue.miners.length,
      0
    )} bundles mined.\n
    ${uniqueMiners.size} unique miners checkout.
    ${ordersNoMinerCodeCount} checkout but no mine.
    `);

    if (currentUserLiveNote.datetime === -1) {
      await saveNewUserLiveNote();
    } else {
      await updateUserLiveNote();
    }

    setCurrentState(LiveNotesState.Done);
  };

  const handleSendNotesToBigSellerFake = () => {
    setCurrentState(LiveNotesState.Loading);
    setProgress(0);

    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setCurrentState(LiveNotesState.Done);

      }, 500)
    }, 2000);
  }

  const handleAddBundleCodeMinersTemplate = async () => {
    setMinersListText((prev) => {
      return prev + "CODE: \n\n\n\n\n\n\n\n-------------------------\n";
    });

    setTimeout(() => {
      if (minersListTextInput.current) {
        const position = minersListTextInput.current.value.length - 34;
        minersListTextInput.current.setSelectionRange(position, position);
        minersListTextInput.current.focus();

        minersListTextInput.current.scrollTop =
          minersListTextInput.current.scrollHeight;
      }
    }, 0);
  };

  return (
    <Box>
      {currentState === LiveNotesState.Loading && (
        <LinearProgress sx={{mb: 2}} variant="determinate" value={progress} />
      )}

      {currentState === LiveNotesState.Done && (
        <Alert sx={{mb: 2}}>Success! {progressText}</Alert>
      )}

      <Stack direction={"row"} spacing={1}>
        <FormControl size="small" sx={{ mt: 2, mb: 1, flex: 1 }}>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label={label}
            value={currentUserLiveNote.datetime.toString()}
            onChange={handleSelectedLiveNotesChange}
          >
            <MenuItem value={newLiveNoteTemplate.datetime}>NEW LIST</MenuItem>
            {userLiveNotes.map((liveNote, index) => (
              <MenuItem key={index} value={liveNote.datetime}>
                {timestampToDatetimeText(liveNote.datetime)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={
            currentState === LiveNotesState.Loading ||
            minersListText.length === 0
          }
        >
          <DeleteIcon />
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={
            currentState === LiveNotesState.Loading ||
            minersListText.length === 0 ||
            currentUserLiveNote.liveNotes === minersListText
          }
          onClick={handleSave}
        >
          <SaveIcon />
        </Button>

        <Button
          startIcon={<SendIcon />}
          variant="contained"
          color="info"
          onClick={handleSendNotesToBigSeller}
          disabled={
            currentState === LiveNotesState.Loading ||
            minersListText.length === 0
          }
        >
          SET ORDER NOTES
        </Button>
      </Stack>

      <TextareaAutosize
        sx={{ mt: 1 }}
        minRows={20}
        maxRows={20}
        ref={minersListTextInput}
        placeholder={liveNotesTextAreaPlaceholder}
        onChange={(e) => setMinersListText(e.target.value)}
        value={minersListText}
        disabled={currentState === LiveNotesState.Loading}
      />

      <Button
        startIcon={<AutoFixHighIcon />}
        variant="contained"
        onClick={handleAddBundleCodeMinersTemplate}
      >
        Code-Miners Template
      </Button>
    </Box>
  );
};

export default LiveNotesPage;
