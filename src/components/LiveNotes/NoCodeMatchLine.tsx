import {
  TableRow,
  TableCell,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const NoCodeMatchChat = ({
  index,
  chat,
  onAdd,
  onDelete,
}: {
  index: number;
  chat: string;
  onAdd: (noCodeMatchChat: string, exactCode: string) => void;
  onDelete: (noCodeMatchChat: string) => void;
}) => {
  const [code, setCode] = useState("");

  return (
    <TableRow key={chat}>
      <TableCell>{index}</TableCell>
      <TableCell>{chat}</TableCell>
      <TableCell>
        <Stack spacing={1} direction={"row"}>
          <TextField
            size="small"
            placeholder="Input Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button size="small" variant="contained" onClick={() => onAdd(chat, code)}>
            <AddIcon />
          </Button>
        </Stack>
      </TableCell>
      <TableCell sx={{textAlign: "center"}}>
        <IconButton onClick={() => onDelete(chat)}>
          <DeleteForeverIcon color="error"/>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default NoCodeMatchChat;
