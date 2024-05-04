import React, { useEffect, useRef, useState } from "react";
import {
  generateListFromFiles,
  validateBigSellerOrdersFile,
  validateDTSFile,
} from "../scripts";
import {
  BigSellerOrdersMetadata,
  DTSFileMetadata,
  GeneratedList,
} from "../types";
import {
  FormControl,
  Button,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Skeleton,
  Alert,
  LinearProgress,
  Box,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import {
  downloadUserDTSFiles,
  getUserSettings,
  uploadUserDTSFiles,
} from "../api";
import UploadedFilePreview from "./UploadedFilePreview";

const hiddenInputStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
};

const ListGeneratorForm = ({
  currentUser,
  handleSubmit,
}: {
  currentUser: string;
  handleSubmit: (a: GeneratedList) => void;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPreviouslyUsedFiles, setHasPreviouslyUsedFiles] = useState(false);
  const [daysToShipFile, setDaysToShipFile] = useState<File[] | null>(null);
  const [bigSellerOrdersFile, setBigSellerOrdersFile] = useState<File[] | null>(
    null
  );
  const [hasNewItemsRecently, setHasNewItemsRecently] = useState(false);

  const dtsFileInputRef = useRef<HTMLInputElement>(null);
  const bigSellerFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeUserSettings = async () => {
      const userSettings = await getUserSettings(currentUser);

      if (userSettings?.hasNewItemsRecently) {
        setHasNewItemsRecently(true);
      }
    };

    setHasNewItemsRecently(false);
    initializeUserSettings();
  }, [currentUser]);

  useEffect(() => {
    const getPreviouslyUsedDTSFiles = async () => {
      const dtsFiles = await downloadUserDTSFiles(currentUser);
      console.log(dtsFiles);
      if (dtsFiles.length > 0) {
        for (let dtsFile of dtsFiles) {
          const metadata = await validateDTSFile(dtsFile);

          if (metadata) {
            console.log("Valid File!");
            Object.defineProperty(dtsFile, "metadata", {
              value: metadata,
              writable: true,
            });
          }
        }

        setDaysToShipFile(dtsFiles);
        setHasPreviouslyUsedFiles(true);
      } else {
        console.log("No previously used files.", currentUser);
        setDaysToShipFile(null);
        setHasPreviouslyUsedFiles(false);
      }

      setTimeout(() => setIsLoading(false), 1000);
    };

    if (currentUser) {
      setIsLoading(true);
      getPreviouslyUsedDTSFiles();
    }
  }, [currentUser]);

  const navigate = useNavigate();

  const handleReset = () => {
    setDaysToShipFile(null);
    setBigSellerOrdersFile(null);
    setHasPreviouslyUsedFiles(false);

    if (dtsFileInputRef.current) {
      dtsFileInputRef.current.value = "";
    }

    if (bigSellerFileInputRef.current) {
      bigSellerFileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[] | null>>,
    validator?: (
      file: File
    ) => Promise<DTSFileMetadata | BigSellerOrdersMetadata | null>
  ) => {
    if (event.target.files === null) {
      setter(null);
      return;
    }

    // Optional validation
    if (validator) {
      for (let file of event.target.files) {
        const metadata = await validator(file);

        if (metadata) {
          console.log("Valid File!");
          Object.defineProperty(file, "metadata", {
            value: metadata,
            writable: true,
          });
        } else {
          console.error("Invalid File!");
        }
      }
    }

    if (event.target.files.length > 0) {
      setter(Array.from(event.target.files));
    } else {
      setter(null);
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsGenerating(true);

    if (daysToShipFile !== null && bigSellerOrdersFile !== null) {
      const generatedList = await generateListFromFiles(
        daysToShipFile,
        bigSellerOrdersFile
      );
      await uploadUserDTSFiles(currentUser, daysToShipFile);
      handleSubmit(generatedList);
      navigate("/history");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth>
        <Typography sx={{ fontWeight: "bold" }}>
          DTS Files from Shopee
          <Tooltip title="Supports multiple files" placement="right">
            <IconButton>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        {isLoading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={128}
            sx={{ borderRadius: 1 }}
          />
        ) : (
          <Button
            sx={{
              my: 1,
              py: 1,
              height: 128,
              border: "dashed 1px",
              fontSize: 16,
              overflow: "hidden",
            }}
            component="label"
            variant="outlined"
            startIcon={daysToShipFile ? null : <FileUploadIcon />}
            color={daysToShipFile ? "success" : "primary"}
          >
            {daysToShipFile ? (
              <Stack sx={{ mt: 1 }} direction="row" spacing={2}>
                {daysToShipFile?.map((file: File) => (
                  <UploadedFilePreview file={file} />
                ))}
              </Stack>
            ) : (
              <>Drag & Drop file(s) here or click</>
            )}
            <input
              type="file"
              accept=".xlsx"
              style={hiddenInputStyle}
              onChange={(event) =>
                handleFileChange(event, setDaysToShipFile, validateDTSFile)
              }
              ref={dtsFileInputRef}
              multiple
            />
          </Button>
        )}

        {!isLoading && hasNewItemsRecently && hasPreviouslyUsedFiles && (
          <Alert sx={{ my: 1 }} severity="success">
            Loaded previously used DTS files from Shopee, click <b>Reset</b> if
            you want to change.
          </Alert>
        )}

        {!isLoading && hasNewItemsRecently && (
          <Alert sx={{ my: 1 }} severity="error">
            Generate a new <b>DTS file</b> from Shopee. New Products has been
            added recently.
          </Alert>
        )}

        <Typography sx={{ fontWeight: "bold" }}>
          New Orders Files from BigSeller
          <Tooltip title="Supports multiple files" placement="right">
            <IconButton>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        {isLoading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={128}
            sx={{ borderRadius: 1 }}
          />
        ) : (
          <Button
            sx={{
              my: 1,
              height: 128,
              border: "dashed 1px",
              fontSize: 16,
            }}
            component="label"
            variant="outlined"
            startIcon={bigSellerOrdersFile ? null : <FileUploadIcon />}
            color={bigSellerOrdersFile ? "success" : "primary"}
          >
            {bigSellerOrdersFile ? (
              <Stack sx={{ mt: 1 }} direction="row" spacing={2}>
                {bigSellerOrdersFile?.map((file: File) => (
                  <UploadedFilePreview file={file} />
                ))}
              </Stack>
            ) : (
              <>Drag & Drop file(s) here or click</>
            )}
            <input
              type="file"
              accept=".xlsx"
              style={hiddenInputStyle}
              onChange={(event) =>
                handleFileChange(
                  event,
                  setBigSellerOrdersFile,
                  validateBigSellerOrdersFile
                )
              }
              ref={bigSellerFileInputRef}
              multiple
            />
          </Button>
        )}
      </FormControl>
      {isGenerating ? (
        <LinearProgress />
      ) : (
        <Stack sx={{ my: 1 }} direction="row-reverse" spacing={1}>
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
      )}
    </form>
  );
};

export default ListGeneratorForm;
