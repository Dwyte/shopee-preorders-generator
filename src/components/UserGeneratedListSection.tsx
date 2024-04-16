import { Alert, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { UserGeneratedList } from "../types";
import UserGeneratedListItem from "./UserGeneratedListItem";
import { useEffect, useState } from "react";
import { updateUserGeneratedList } from "../api";
import { timestampToDatetimeText } from "../scripts";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

interface PropType {
  currentUserGeneratedList: UserGeneratedList;
  handleDeleteUserGeneratedList: (id: string) => Promise<void>;
}

const UserGeneratedListSection = (props: PropType) => {
  const [generatedListDraft, setGeneratedListDraft] = useState(
    props.currentUserGeneratedList.generatedList
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setGeneratedListDraft(props.currentUserGeneratedList.generatedList);
  }, [props.currentUserGeneratedList]);

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
    alert("Changes Saved.");
  };

  return (
    <Box>
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
        </Stack>
      </Box>

      {hasUnsavedChanges && (
        <Alert sx={{ my: 1 }} severity="error">
          You have unsaved changes.{" "}
        </Alert>
      )}

      <Divider sx={{ mb: 2 }} />

      {Object.keys(props.currentUserGeneratedList.generatedList).map(
        (supplierCode, index) => (
          <UserGeneratedListItem
            key={index}
            supplierCode={supplierCode}
            productsToOrderText={generatedListDraft[supplierCode]}
            onProductsToOrderTextChange={handleProductsToOrderTextChange}
          />
        )
      )}
    </Box>
  );
};

export default UserGeneratedListSection;
