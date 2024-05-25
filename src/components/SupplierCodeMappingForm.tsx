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
import React, { useContext, useEffect, useState } from "react";
import UserSettingsContext from "../contexts/UserSettingsContext";
import { UserSettings } from "../types";

type SupplierCodeMapProps = {
  parentSKU: string;
  value: string;
  onParentSKUChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onValueChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onDelete: () => void;
};

const SupplierCodeMap = ({
  parentSKU,
  value,
  onParentSKUChange,
  onValueChange,
  onDelete,
}: SupplierCodeMapProps) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
      <TextField
        placeholder="Parent SKU"
        sx={{ flex: 1 }}
        size="small"
        label="Parent SKU"
        value={parentSKU}
        onChange={onParentSKUChange}
      />
      <KeyboardDoubleArrowRightIcon />
      <TextField
        placeholder="Supplier Details (Name, Color & Stall #)"
        label="Supplier Details"
        sx={{ flex: 1 }}
        size="small"
        value={value}
        onChange={onValueChange}
      />
      <IconButton color="error" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

const SupplierCodeMapping = () => {
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const [parentSKUOrder, setParentSKUOrder] = useState<string[]>([]);

  useEffect(() => {
    if (userSettings?.supplierCodeMapping) {
      setParentSKUOrder(Object.keys(userSettings.supplierCodeMapping));
    }
  }, [userSettings?.user]);

  const handleParentSKUChange =
    (parentSKU: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUserSettings((prev) => {
        if (!prev?.supplierCodeMapping) return prev;

        // Destructure current parentSKU value
        const { [parentSKU]: oldParentSKUValue, ...rest } =
          prev?.supplierCodeMapping;

        // Form new mapping with the new key
        const newSupplierCodeMapping = {
          [event.target.value]: oldParentSKUValue,
          ...rest,
        };

        return {
          ...prev,
          supplierCodeMapping: newSupplierCodeMapping,
        };
      });

      setParentSKUOrder((prev) =>
        prev.map((prevParentSKU) =>
          parentSKU === prevParentSKU ? event.target.value : prevParentSKU
        )
      );
    };

  const handleValueChange =
    (parentSKU: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUserSettings((prev) => {
        if (!prev?.supplierCodeMapping) return prev;

        const newSupplierCodeMapping = {
          ...prev.supplierCodeMapping,
          [parentSKU]: event.target.value,
        };

        return {
          ...prev,
          supplierCodeMapping: newSupplierCodeMapping,
        };
      });
    };

  const handleAddMapping = () => {
    setUserSettings((prev) => {
      if (!prev?.supplierCodeMapping)
        return {
          ...prev,
          supplierCodeMapping: { "": "" },
        } as UserSettings;

      const newSupplierCodeMapping = {
        ...prev.supplierCodeMapping,
        "": "",
      };

      return {
        ...prev,
        supplierCodeMapping: newSupplierCodeMapping,
      };
    });

    setParentSKUOrder((prev) => {
      return [...prev, ""];
    });
  };

  const handleDelete = (parentSKU: string) => () => {
    setUserSettings((prev) => {
      if (prev === null) return prev;

      const newSupplierCodeMapping = {
        ...prev?.supplierCodeMapping,
      };

      delete newSupplierCodeMapping[parentSKU];

      return { ...prev, supplierCodeMapping: newSupplierCodeMapping };
    });

    setParentSKUOrder((prev) => prev.filter((v) => v !== parentSKU));
  };

  const hasEmptyMapping =
    userSettings?.supplierCodeMapping &&
    "" in userSettings?.supplierCodeMapping;

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

      <Stack direction="column" spacing={2} alignItems="stretch" sx={{ my: 2 }}>
        {parentSKUOrder.length ? (
          parentSKUOrder.map((parentSKU) => {
            const value = userSettings?.supplierCodeMapping
              ? userSettings.supplierCodeMapping[parentSKU]
              : "";

            return (
              <SupplierCodeMap
                parentSKU={parentSKU}
                value={value}
                onParentSKUChange={handleParentSKUChange(parentSKU)}
                onValueChange={handleValueChange(parentSKU)}
                onDelete={handleDelete(parentSKU)}
              />
            );
          })
        ) : (
          <></>
        )}
      </Stack>

      <Button
        fullWidth
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddMapping}
        disabled={hasEmptyMapping}
      >
        Add Mapping
      </Button>
    </div>
  );
};

export default SupplierCodeMapping;
