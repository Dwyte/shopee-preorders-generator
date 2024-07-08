import {
  Box,
  Typography,
  Paper,
  Grid,
  Collapse,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SupplierName from "./SupplierName";
import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TextareaAutosize from "./TextareaAutosize";

interface Props {
  supplierCode: string;
  productsToOrderText: string;
  onCopy: () => void;
  onProductsToOrderTextChange: (supplierCode: string, newValue: string) => void;
}

const UserGeneratedListItem = ({
  supplierCode,
  productsToOrderText,
  onCopy,
  onProductsToOrderTextChange,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(productsToOrderText);
    onCopy();
  };

  const handleTextAreChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    onProductsToOrderTextChange(supplierCode, event.target.value);
  };

  return (
    <Paper sx={{ my: 2 }} variant="outlined">
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 2 }}
      >
        <Grid item>
          <Typography component="h1" sx={{ p: 1 }}>
            <SupplierName supplierCode={supplierCode} />
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleCopyToClipboard}
            color="primary"
            size="medium"
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>{" "}
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            color="default"
            size="medium"
          >
            {isExpanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={isExpanded}>
        <Box>
          <TextareaAutosize
            sx={{ mb: -1 }}
            value={productsToOrderText}
            onChange={handleTextAreChange}
          />
        </Box>
      </Collapse>
    </Paper>
  );
};

export default UserGeneratedListItem;
