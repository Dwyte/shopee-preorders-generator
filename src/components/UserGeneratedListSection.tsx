import {
  Alert,
  Box,
  Button,
  Divider,
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
import SaveIcon from "@mui/icons-material/Save";
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
    setGeneratedListDraft((currentGeneratedListDraft) => ({
      ...currentGeneratedListDraft,
      [supplierCode]: newValue,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    await updateUserGeneratedList(props.currentUserGeneratedList.id, {
      generatedList: generatedListDraft,
    });
    setHasUnsavedChanges(false);
    setSnackBarText("Changes saved successfully.");
    setIsSnackBarOpen(true);
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
    setSnackBarText("Copied whole list to clipboard.");
    setIsSnackBarOpen(true);
  };

  const snackBarAction = (
    <>
      {/* <Button color="secondary" size="small" onClick={handleSnackbarClose}>
        UNDO
      </Button> */}
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
        <Typography sx={{ p: 1 }} flex={1} component="h1">
          Last Edited:{" "}
          {props.currentUserGeneratedList.updateTime
            ? timestampToDatetimeText(props.currentUserGeneratedList.updateTime)
            : "No edits made yet."}
        </Typography>
        <Stack direction="row-reverse" spacing={1}>
          {hasUnsavedChanges && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleSaveChanges}
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          )}
          <Button
            color="error"
            variant="outlined"
            onClick={() =>
              props.handleDeleteUserGeneratedList(
                props.currentUserGeneratedList.id
              )
            }
            startIcon={<DeleteIcon />}
          >
            Delete List
          </Button>
          <Button
            color="success"
            variant="outlined"
            onClick={handleCopyList}
            startIcon={<CopyAllIcon />}
          >
            Copy List
          </Button>
        </Stack>
      </Box>

      {hasUnsavedChanges && (
        <Alert sx={{ my: 1 }} severity="error">
          You have unsaved changes.{" "}
        </Alert>
      )}

      <Divider sx={{ mb: 2 }} />

      {sortedGeneratedList.map((supplierCode, index) => (
        <UserGeneratedListItem
          key={index}
          supplierCode={supplierCode}
          productsToOrderText={generatedListDraft[supplierCode]}
          onProductsToOrderTextChange={handleProductsToOrderTextChange}
        />
      ))}
    </Box>
  );
};

export default UserGeneratedListSection;
