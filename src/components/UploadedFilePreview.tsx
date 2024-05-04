import { Box, Typography } from "@mui/material";
import ExcelIcon from "../assets/excel-icon.png";
import { timestampToDatetimeText } from "../scripts";

interface Props {
  file: File;
}

const UploadedFilePreview = ({ file }: Props) => {
  return (
    <Box sx={{ display: "flex", px: 1 }}>
      <Box sx={{ py: 1, px: 1 }}>
        <img src={ExcelIcon} alt="" width={92} />
      </Box>
      <Box sx={{ flexDirection: "row", py: 2, px: 1 }}>
        <Typography sx={{ fontSize: "12px", textTransform: "none" }}>
          <b>{file.name}</b> <br />
          {timestampToDatetimeText(file.lastModified)} <br /> * Products <br />{" "}
          * Pre-orders
        </Typography>
      </Box>
    </Box>
  );
};

export default UploadedFilePreview;
