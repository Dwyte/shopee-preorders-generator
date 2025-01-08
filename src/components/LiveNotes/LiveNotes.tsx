import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TextareaAutosize from "../TextareaAutosize";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import {
  getNewOrders,
  parseMinerList,
  updateOrderNote,
} from "../../bigsellerAPI";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserSettingsContext from "../../contexts/UserSettingsContext";
import { timestampToDatetimeText } from "../../scripts";
import { LiveNotes } from "../../types";
import {
  addLiveNotes,
  deleteUserLiveNote,
  extractBundleCodes,
  getBundleCodes,
  getLiveNotes,
  saveBundleCodes,
  updateLiveNotes,
} from "../../api";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import UndoIcon from "@mui/icons-material/Undo";
import NoCodeMatchLine from "./NoCodeMatchLine";
import {
  LiveNotesState,
  liveNotesTextAreaPlaceholder,
  newLiveNoteTemplate,
  codeMinersListTemplate,
  parseMinersListText,
  stringifyMinersListJSON,
} from "./liveNotesScripts";

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

  const [intelligentDropText, setIntelligentDropText] = useState("");
  const [canUndo, setCanUndo] = useState(false);

  const [noCodeMatchChats, setNoCodeMatchChats] = useState<string[]>([]);

  useEffect(() => {
    const initializeLiveNotes = async () => {
      console.log(currentUser);
      if (currentUser) {
        const liveNotes = await getLiveNotes(currentUser);
        setUserLiveNotes(liveNotes);

        const bundleCodes = extractBundleCodes(liveNotes);
        saveBundleCodes(currentUser, bundleCodes);
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

  // const handleSendNotesToBigSellerFake = () => {
  //   setCurrentState(LiveNotesState.Loading);
  //   setProgress(0);

  //   setTimeout(() => {
  //     setProgress(100);
  //     setTimeout(() => {
  //       setCurrentState(LiveNotesState.Done);
  //     }, 500);
  //   }, 2000);
  // };

  const handleAddBundleCodeMinersTemplate = async () => {
    setMinersListText((prev) => {
      return (
        prev +
        `${codeMinersListTemplate.codePrefix} ${codeMinersListTemplate.spacesAfterCode}${codeMinersListTemplate.listFooter}\n`
      );
    });

    setTimeout(() => {
      if (minersListTextInput.current) {
        const position =
          minersListTextInput.current.value.length -
          codeMinersListTemplate.spacesAfterCode.length -
          codeMinersListTemplate.listFooter.length -
          1;

        minersListTextInput.current.setSelectionRange(position, position);
        minersListTextInput.current.focus();

        minersListTextInput.current.scrollTop =
          minersListTextInput.current.scrollHeight;
      }
    }, 0);
  };

  const handleIntelligentDropTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    localStorage.setItem("__backup__", minersListText);
    setCanUndo(true);

    // Set state to loading so user can't edit the main text area.
    setCurrentState(LiveNotesState.Loading);

    setIntelligentDropText(e.target.value);

    // Parse miners list text into JSON format so we can easily add lines
    let minersListJSON = parseMinersListText(minersListText);

    // Get the Lines from the new on-change value
    let lines = e.target.value.split("\n");

    // Filter out irrelevant lines that may not be related to mine
    lines = lines.filter((line) => {
      return !(
        line.includes("buying") ||
        line.includes("joined") ||
        line.includes("followed") ||
        line.includes("flex")
      );
    });

    // sort bundleCodes by length descending to avoid finding 2 codes ie. (twinstar and star);
    const bundleCodes = getBundleCodes(currentUser).sort(
      (prev, curr) => curr.length - prev.length
    );

    // Let's store lines that didnt include exact code
    const newNoCodeMatchLines: string[] = [];

    // Loop through the lines
    for (let line of lines) {
      // skip empty lines
      if (line.trim() === "") continue;

      // Look for exact substring match from bundle codes
      let foundCode = false;
      
      // Remove Spaces because we record codes as 1 word and at upper case
      // to handle "mine twin star" not to be confused as star but twinstar
      let _line = line.toUpperCase().split(" ").join("")
      for (let bundleCode of bundleCodes) {
        console.log(_line)

        console.log(_line, bundleCode)
        if (_line.endsWith(bundleCode)) {
          if (bundleCode in minersListJSON) {
            minersListJSON[bundleCode].add(line);
          } else {
            minersListJSON[bundleCode] = new Set([line]);
          }

          foundCode = true;
        }

        if (foundCode) break;
      }

      if (!foundCode) {
        newNoCodeMatchLines.push(line);
      }
    }

    setNoCodeMatchChats(newNoCodeMatchLines);
    setMinersListText(stringifyMinersListJSON(minersListJSON));
    setCurrentState(LiveNotesState.Done);
  };

  const handleUndoRecentChanges = () => {
    const backup = localStorage.getItem("__backup__");
    console.log(backup);
    if (backup !== null) {
      setMinersListText(backup);
      setIntelligentDropText("");
      setCanUndo(false);
    }
  };

  const handleConfirm = () => {
    setIntelligentDropText("");
    setCanUndo(false);
  };

  const handleResolveNoCodeMatchLine = (
    noCodeMatchChat: string,
    exactCode: string
  ) => {
    const minersListJSON = parseMinersListText(minersListText);

    // Add line to exactCode
    if (exactCode.toUpperCase() in minersListJSON) {
      minersListJSON[exactCode].add(noCodeMatchChat);
    } else {
      minersListJSON[exactCode] = new Set([noCodeMatchChat]);
    }

    // Set new Text on Display
    setMinersListText(stringifyMinersListJSON(minersListJSON));

    // Remove line from the Table
    handleDeleteNoCodeMatchLine(noCodeMatchChat)
    console.log(`Added Line ${noCodeMatchChat} to ${exactCode}`);
  };

  const handleDeleteNoCodeMatchLine = (noCodeMatchChat: string) => {
    setNoCodeMatchChats(
      noCodeMatchChats.filter((val) => val !== noCodeMatchChat)
    );
  }

  return (
    <Box>
      {currentState === LiveNotesState.Loading && (
        <LinearProgress sx={{ mb: 2 }} variant="determinate" value={progress} />
      )}
      {currentState === LiveNotesState.Done && (
        <Alert sx={{ mb: 2 }}>Success! {progressText}</Alert>
      )}
      <Stack direction={"column"} spacing={1}>
        <FormControl size="small" sx={{ flex: 1 }}>
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

        <Stack
          direction={"row"}
          spacing={1}
          useFlexGap
          sx={{ flexWrap: "wrap" }}
        >
          <Button
            disabled={currentState === LiveNotesState.Loading}
            startIcon={<AutoFixHighIcon />}
            variant="contained"
            onClick={handleAddBundleCodeMinersTemplate}
          >
            Code-Miners Template
          </Button>

          <div style={{ flex: 1 }}></div>

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
      </Stack>
      <TextareaAutosize
        sx={{ my: 1, resize: "none", cursor: "auto" }}
        minRows={20}
        maxRows={20}
        ref={minersListTextInput}
        placeholder={liveNotesTextAreaPlaceholder}
        onChange={(e) => setMinersListText(e.target.value)}
        value={minersListText}
        disabled={canUndo || currentState === LiveNotesState.Loading}
      />
      Intelligent Drop Area{" "}
      {canUndo && "(Confirm changes before pasting again)"}:
      <TextareaAutosize
        placeholder="Drag and Drop or Paste Buyers Chats Here (Needs exact Code at the end of chat)"
        minRows={5}
        maxRows={5}
        sx={{ resize: "none" }}
        onChange={handleIntelligentDropTextChange}
        value={intelligentDropText}
        disabled={canUndo}
      />
      <Stack direction={"row"}>
        <div style={{ flex: 1 }}>
          {intelligentDropText && (
            <Chip
              size="small"
              label={`${intelligentDropText.split("\n").length} line(s). `}
            ></Chip>
          )}
        </div>
        <Stack spacing={1} direction="row">
          <Button
            startIcon={<UndoIcon />}
            onClick={handleUndoRecentChanges}
            disabled={!canUndo}
          >
            Undo Changes
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!canUndo}
          >
            Confirm Changes
          </Button>
        </Stack>
      </Stack>
      {noCodeMatchChats.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No Exact Code Chats</TableCell>
                <TableCell>Manual Code Input</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {noCodeMatchChats.map((chat) => {
                return (
                  <NoCodeMatchLine
                    key={chat}
                    chat={chat}
                    onAdd={handleResolveNoCodeMatchLine}
                    onDelete={handleDeleteNoCodeMatchLine}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LiveNotesPage;
