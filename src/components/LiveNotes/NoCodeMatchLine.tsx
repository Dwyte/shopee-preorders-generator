import {
  TableRow,
  TableCell,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const NoCodeMatchChat = ({
  chat,
  onAdd,
  onDelete,
}: {
  chat: string;
  onAdd: (noCodeMatchChat: string, exactCode: string) => void;
  onDelete: (noCodeMatchChat: string) => void
}) => {
  const [code, setCode] = useState("");

  return (
    <TableRow key={chat}>
      <TableCell>{chat}</TableCell>
      <TableCell>
        <Stack spacing={1} direction={"row"}>
          <TextField
            size="small"
            placeholder="Input Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button variant="contained" onClick={() => onAdd(chat, code)}>
            Add
          </Button>
        </Stack>
      </TableCell>
      <TableCell>
        <Button color="error" variant="outlined" onClick={() => onDelete(chat)}>
          <DeleteForeverIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default NoCodeMatchChat;
