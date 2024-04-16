import React, { useState } from "react";
import { generateListFromFiles } from "../scripts";
import { GeneratedList } from "../types";
import { FormControl, Button, Typography, Stack } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const hiddenInputStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
};

const ListGeneratorForm = ({
  handleSubmit,
}: {
  handleSubmit: (a: GeneratedList) => void;
}) => {
  const [daysToShipFile, setDaysToShipFile] = useState<File | null>(null);
  const [bigSellerOrdersFile, setBigSellerOrdersFile] = useState<File | null>(
    null
  );

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setter(file);
    }
  };

  const handleReset = () => {
    setDaysToShipFile(null);
    setBigSellerOrdersFile(null);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (daysToShipFile !== null && bigSellerOrdersFile !== null) {
      const generatedList = await generateListFromFiles(
        daysToShipFile,
        bigSellerOrdersFile
      );

      handleSubmit(generatedList);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth>
        <Typography>DTS File from Shopee</Typography>

        <Button
          sx={{ my: 1, height: 64, border: "dashed 1px" }}
          component="label"
          variant="outlined"
          startIcon={<FileUploadIcon />}
          color={daysToShipFile ? "success" : "primary"}
        >
          {daysToShipFile?.name || "Upload Days-to-Ship file"}
          <input
            type="file"
            accept=".xlsx"
            style={hiddenInputStyle}
            onChange={(event) => handleFileChange(event, setDaysToShipFile)}
          />
        </Button>

        <Typography>New Orders File from BigSeller </Typography>

        <Button
          sx={{ my: 1, height: 64, border: "dashed 1px" }}
          component="label"
          variant="outlined"
          startIcon={<FileUploadIcon />}
          color={bigSellerOrdersFile ? "success" : "primary"}
        >
          {bigSellerOrdersFile?.name || "Upload Bigseller Orders file"}
          <input
            type="file"
            accept=".xlsx"
            style={hiddenInputStyle}
            onChange={(event) =>
              handleFileChange(event, setBigSellerOrdersFile)
            }
          />
        </Button>
      </FormControl>

      <Stack direction="row-reverse" spacing={1}>
        <Button
          variant="contained"
          type="submit"
          endIcon={<SendSharpIcon />}
          color="success"
          disabled={!(daysToShipFile && bigSellerOrdersFile)}
        >
          Generate
        </Button>
        <Button
          variant="outlined"
          endIcon={<RestartAltIcon />}
          color="error"
          disabled={!(daysToShipFile || bigSellerOrdersFile)}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Stack>
    </form>
  );
};

export default ListGeneratorForm;
