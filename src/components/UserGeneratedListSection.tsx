import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { UserGeneratedList } from "../types";
import UserGeneratedListItem from "./UserGeneratedListItem";
import { useEffect, useState } from "react";
import { updateUserGeneratedList } from "../api";
import { disectSupplierCode, timestampToDatetimeText } from "../scripts";
import DeleteIcon from "@mui/icons-material/Delete";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CloseIcon from "@mui/icons-material/Close";

interface PropType {
  currentUserGeneratedList: UserGeneratedList;
  handleDeleteUserGeneratedList: (id: string) => Promise<void>;
}

const UserGeneratedListSection = (props: PropType) => {
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [snackBarText, setSnackBarText] = useState("Default Snackbar Text");
  const [unsavedChanges, setUnsavedChanges] = useState<{} | null>(null);
  const [currentTimeoutId, setCurrentTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  const [generatedListDraft, setGeneratedListDraft] = useState(
    props.currentUserGeneratedList.generatedList
  );

  const [sortedGeneratedList, setSortedGeneratedList] = useState(
    [] as string[]
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const sortedGeneratedList = Object.keys(
      props.currentUserGeneratedList.generatedList
    ).sort((a, b) => {
      const ad = disectSupplierCode(a);
      const bd = disectSupplierCode(b);

      // First, sort by color
      if (ad.color < bd.color) return -1;
      if (ad.color > bd.color) return 1;

      // If colors are the same, sort by name
      if (ad.name < bd.name) return -1;
      if (ad.name > bd.name) return 1;

      return 0; // If colors and names are equal
    });

    setSortedGeneratedList(sortedGeneratedList);
  }, [props.currentUserGeneratedList]);

  useEffect(() => {
    setGeneratedListDraft(props.currentUserGeneratedList.generatedList);
  }, [props.currentUserGeneratedList]);

  const handleSnackbarClose = () => {
    setIsSnackBarOpen(false);
  };

  const handleProductsToOrderTextChange = (
    supplierCode: string,
    newValue: string
  ) => {
    const newGeneratedListDraft = {
      ...generatedListDraft,
      [supplierCode]: newValue,
    };

    setGeneratedListDraft(newGeneratedListDraft);
    setHasUnsavedChanges(true);

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }

    let newUnsavedChanges = {
      [`generatedList.${supplierCode}`]: newValue,
    };

    if (unsavedChanges) {
      newUnsavedChanges = { ...unsavedChanges, ...newUnsavedChanges };
    }

    setUnsavedChanges(newUnsavedChanges);

    setUnsavedChanges;

    const handleSaveChanges = async () => {
      await updateUserGeneratedList(
        props.currentUserGeneratedList.id,
        newUnsavedChanges
      );

      console.log(newUnsavedChanges);

      setHasUnsavedChanges(false);
      showSnackBar("Changes saved successfully.");
    };

    setCurrentTimeoutId(setTimeout(handleSaveChanges, 2500));
  };

  const handleCopyList = () => {
    let wholeListText = "";

    for (let supplierCode in props.currentUserGeneratedList.generatedList) {
      wholeListText +=
        supplierCode +
        "\n" +
        props.currentUserGeneratedList.generatedList[supplierCode];
    }

    navigator.clipboard.writeText(wholeListText);
    showSnackBar("Copied whole list to clipboard.");
  };

  const showSnackBar = (message: string) => {
    setIsSnackBarOpen(false);
    setSnackBarText(message);
    setIsSnackBarOpen(true);
  };

  const snackBarAction = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Box>
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarText}
        action={snackBarAction}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      />

      <Box display="flex" sx={{ my: 1 }}>
        {hasUnsavedChanges && <CircularProgress size={40} />}

        <Typography sx={{ p: 1 }} flex={1} component="h1">
          {hasUnsavedChanges ? (
            "Saving changes..."
          ) : (
            <>
              Last Edited:{" "}
              {props.currentUserGeneratedList.updateTime
                ? timestampToDatetimeText(
                    props.currentUserGeneratedList.updateTime
                  )
                : "No edits made yet."}
            </>
          )}
        </Typography>
        <Stack direction="row-reverse" spacing={1}>
          <Button
            color="error"
            variant="outlined"
            onClick={() =>
              props.handleDeleteUserGeneratedList(
                props.currentUserGeneratedList.id
              )
            }
            startIcon={<DeleteIcon />}
            disabled={hasUnsavedChanges}
          >
            Delete List
          </Button>
          <Button
            color="success"
            variant="outlined"
            onClick={handleCopyList}
            startIcon={<CopyAllIcon />}
          >
            Copy All
          </Button>
        </Stack>
      </Box>

      {sortedGeneratedList.map((supplierCode, index) => (
        <UserGeneratedListItem
          key={index}
          supplierCode={supplierCode}
          productsToOrderText={generatedListDraft[supplierCode]}
          onCopy={() => showSnackBar("Copied successfully.")}
          onProductsToOrderTextChange={handleProductsToOrderTextChange}
        />
      ))}
    </Box>
  );
};

export default UserGeneratedListSection;
