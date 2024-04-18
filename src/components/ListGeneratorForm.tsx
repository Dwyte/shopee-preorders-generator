import React, { useMemo, useState } from "react";
import { generateListFromFiles } from "../scripts";
import { GeneratedList } from "../types";
import {
  FormControl,
  Button,
  Typography,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

const displayFileNames = (fileList: File[] | null) => () => {
  if (!fileList) return "Drag & Drop file(s) here or click";
  const fileNames = Array.from(fileList).map(
    (f) => f.name.substring(0, 8) + "..." + f.name.substring(f.name.length - 8)
  );
  return fileNames.join(", ") + ` (${fileList.length})`;
};

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
  const [daysToShipFile, setDaysToShipFile] = useState<File[] | null>(null);
  const [bigSellerOrdersFile, setBigSellerOrdersFile] = useState<File[] | null>(
    null
  );

  const navigate = useNavigate();
  const handleReset = () => {
    setDaysToShipFile(null);
    setBigSellerOrdersFile(null);
    // resetCurrentGeneratedList();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[] | null>>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setter(Array.from(event.target.files));
    } else {
      setter(null);
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (daysToShipFile !== null && bigSellerOrdersFile !== null) {
      const generatedList = await generateListFromFiles(
        daysToShipFile,
        bigSellerOrdersFile
      );

      handleSubmit(generatedList);
      navigate("/history");
    }
  };

  const daysToShipFilesNamePreview = useMemo(displayFileNames(daysToShipFile), [
    daysToShipFile,
  ]);

  const bigsellerOrdersFilesNamePreview = useMemo(
    displayFileNames(bigSellerOrdersFile),
    [bigSellerOrdersFile]
  );

  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth>
        <Typography sx={{ fontWeight: "bold" }}>
          DTS File from Shopee
          <Tooltip title="Supports multiple files" placement="right">
            <IconButton>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Button
          sx={{
            my: 1,
            height: 128,
            border: "dashed 1px",
            fontSize: 16,
          }}
          component="label"
          variant="outlined"
          startIcon={<FileUploadIcon />}
          color={daysToShipFile ? "success" : "primary"}
        >
          {daysToShipFilesNamePreview}
          <input
            type="file"
            accept=".xlsx"
            style={hiddenInputStyle}
            onChange={(event) => handleFileChange(event, setDaysToShipFile)}
            multiple
            required
          />
        </Button>

        <Typography sx={{ fontWeight: "bold" }}>
          New Orders Files from BigSeller
          <Tooltip title="Supports multiple files" placement="right">
            <IconButton>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Button
          sx={{
            my: 1,
            height: 128,
            border: "dashed 1px",
            fontSize: 16,
          }}
          component="label"
          variant="outlined"
          startIcon={<FileUploadIcon />}
          color={bigSellerOrdersFile ? "success" : "primary"}
        >
          {bigsellerOrdersFilesNamePreview}
          <input
            type="file"
            accept=".xlsx"
            style={hiddenInputStyle}
            onChange={(event) =>
              handleFileChange(event, setBigSellerOrdersFile)
            }
            required
            multiple
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
