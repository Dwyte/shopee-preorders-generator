import {
  Box,
  Button,
  TextareaAutosize as BaseTextareAutosize,
  Typography,
  Paper,
  Grid,
  Collapse,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { styled } from "@mui/system";
import SupplierName from "./SupplierName";
import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const TextareaAutosize = styled(BaseTextareAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

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
            sx={{ width: "100%", mb: -1 }}
            value={productsToOrderText}
            onChange={handleTextAreChange}
          />
        </Box>
      </Collapse>
    </Paper>
  );
};

export default UserGeneratedListItem;
