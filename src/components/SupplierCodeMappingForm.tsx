import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useContext } from "react";
import UserSettingsContext from "../contexts/UserSettingsContext";

const SupplierCodeMap = ({
  parentSKU,
  value,
}: {
  parentSKU: string;
  value: string;
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
      <TextField
        placeholder="Parent SKU"
        sx={{ flex: 1 }}
        size="small"
        value={parentSKU}
        disabled
      />
      <KeyboardDoubleArrowRightIcon />
      <TextField
        placeholder="Supplier Details (Name, Color & Stall #)"
        sx={{ flex: 1 }}
        size="small"
        value={value}
        disabled
      />
      <IconButton color="error" disabled>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

const SupplierCodeMapping = () => {
  const userSettings = useContext(UserSettingsContext);

  return (
    <div>
      <Typography fontWeight="bold" variant="h6">
        Parent SKU Mapping
      </Typography>
      <Typography variant="subtitle1">
        Create mappings for your parent SKUs to display them more descriptively
        on the generated lists. <br /> Example: A1 ➡ ABC Shop Orange #69. Start
        by adding a new mapping.
      </Typography>

      {userSettings?.supplierCodeMapping &&
        Object.keys(userSettings.supplierCodeMapping).map((parentSKU) => {
          const value = userSettings.supplierCodeMapping
            ? userSettings.supplierCodeMapping[parentSKU]
            : "";

          return <SupplierCodeMap parentSKU={parentSKU} value={value} />;
        })}

      <Button fullWidth variant="contained" startIcon={<AddIcon />} disabled>
        Add Mapping
      </Button>
    </div>
  );
};

export default SupplierCodeMapping;
