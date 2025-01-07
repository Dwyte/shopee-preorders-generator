import { TableRow, TableCell, TextField, Button, Stack } from "@mui/material";
import { useState } from "react";

const NoCodeMatchChat = ({ chat, onAdd }: { chat: string, onAdd: (noCodeMatchChat: string, exactCode: string) => void }) => {
  const [code, setCode] = useState("");

  return (
    <TableRow key={chat}>
      <TableCell>{chat}</TableCell>
      <TableCell>TBD</TableCell>
      <TableCell>
        <Stack spacing={1} direction={"row"}>
          <TextField
            size="small"
            placeholder="Input Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button variant="contained" onClick={() => onAdd(chat, code)}>Add</Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default NoCodeMatchChat;