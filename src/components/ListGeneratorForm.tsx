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

const hiddenInputStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
};

const ListGeneratorForm = ({
  resetCurrentGeneratedList,
  handleSubmit,
}: {
  resetCurrentGeneratedList: () => void;
  handleSubmit: (a: GeneratedList) => void;
}) => {
  const [daysToShipFile, setDaysToShipFile] = useState<FileList | null>(null);
  const [bigSellerOrdersFile, setBigSellerOrdersFile] =
    useState<FileList | null>(null);

  const navigate = useNavigate();
  console.log(daysToShipFile);
  const handleReset = () => {
    setDaysToShipFile(null);
    setBigSellerOrdersFile(null);
    resetCurrentGeneratedList();
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (daysToShipFile !== null && bigSellerOrdersFile !== null) {
      const generatedList = await generateListFromFiles(
        Array.from(daysToShipFile),
        bigSellerOrdersFile[0]
      );

      handleSubmit(generatedList);
      navigate("/history");
    }
  };

  const daysToShipFilesNamePreview = useMemo(() => {
    if (!daysToShipFile) return "Drag & Drop DTS file(s) here or click";
    const fileNames = Array.from(daysToShipFile).map(
      (f) =>
        f.name.substring(0, 3) + "..." + f.name.substring(f.name.length - 8)
    );
    return fileNames.join(", ") + ` (${daysToShipFile.length})`;
  }, [daysToShipFile]);

  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth>
        <Typography sx={{ fontWeight: "bold" }}>
          DTS File from Shopee
          <Tooltip
            title="Supports multiple files for multiple shops"
            placement="right"
          >
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
            onChange={(event) => setDaysToShipFile(event.target.files)}
            multiple
            required
          />
        </Button>

        <Typography sx={{ fontWeight: "bold" }}>
          New Orders File from BigSeller{" "}
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
          {bigSellerOrdersFile?.[0].name ||
            "Drag & Drop Bigseller file here or click"}
          <input
            type="file"
            accept=".xlsx"
            style={hiddenInputStyle}
            onChange={(event) => setBigSellerOrdersFile(event.target.files)}
            required
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
