import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { UserGeneratedList } from "../types";
import UserGeneratedListItem from "./UserGeneratedListItem";
import { useEffect, useState } from "react";
import { updateUserGeneratedList } from "../api";
import { timestampToDatetimeText } from "../scripts";

interface PropType {
  currentUserGeneratedList: UserGeneratedList;
  handleDeleteUserGeneratedList: (id: string) => Promise<void>;
}

const UserGeneratedListSection = (props: PropType) => {
  const [generatedListDraft, setGeneratedListDraft] = useState(
    props.currentUserGeneratedList.generatedList
  );

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
  };

  const handleSaveChanges = async () => {
    await updateUserGeneratedList(props.currentUserGeneratedList.id, {
      generatedList: generatedListDraft,
    });

    alert("Changes Saved.");
  };

  return (
    <Box>
      <Box display="flex" sx={{ my: 1 }}>
        <Typography sx={{ p: 1 }} flex={1} component="h1">
          Last Updated:{" "}
          {props.currentUserGeneratedList.updateTime
            ? timestampToDatetimeText(props.currentUserGeneratedList.updateTime)
            : "No Changes Made Yet."}
        </Typography>
        <Stack direction="row-reverse" spacing={1}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() =>
              props.handleDeleteUserGeneratedList(
                props.currentUserGeneratedList.id
              )
            }
          >
            Delete List
          </Button>
        </Stack>
      </Box>

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
