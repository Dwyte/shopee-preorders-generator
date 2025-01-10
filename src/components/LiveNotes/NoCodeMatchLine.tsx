import {
  TableRow,
  TableCell,
  TextField,
  Button,
  Stack,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { NoCodeMatchChats } from "./liveNotesScripts";

type Props = {
  index: number;
  data: NoCodeMatchChats;
  onAdd: (noCodeMatchChat: string, exactCode: string) => void;
  onDelete: (noCodeMatchChat: string) => void;
};

const NoCodeMatchChat = ({ index, data, onAdd, onDelete }: Props) => {
  const [code, setCode] = useState("");

  return (
    <TableRow>
      <TableCell>{index}</TableCell>
      <TableCell>{data.chat}</TableCell>
      <TableCell>
        <Stack spacing={1} direction={"row"} sx={{ minWidth: "225px" }}>
          <Autocomplete
            freeSolo
            sx={{ flex: 1 }}
            options={data.suggestions}
            inputValue={code}
            onInputChange={(e, newInputValue) =>
              setCode(newInputValue.toUpperCase())
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Input Code"
                value={code}
              />
            )}
          />

          <Button
            size="small"
            variant="contained"
            onClick={() => onAdd(data.chat, code)}
          >
            <AddIcon />
          </Button>
        </Stack>
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        <IconButton onClick={() => onDelete(data.chat)}>
          <DeleteForeverIcon color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default NoCodeMatchChat;
