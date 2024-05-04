import { Box, Typography } from "@mui/material";
import ExcelIcon from "../assets/excel-icon.png";
import { timestampToDatetimeText } from "../scripts";
import { BigSellerOrdersMetadata, DTSFileMetadata } from "../types";

interface CustomFile extends File {
  metadata?: DTSFileMetadata & BigSellerOrdersMetadata;
}

interface Props {
  file: CustomFile;
}

const minimizeFileName = (fileName: string) => {
  return fileName.length > 20
    ? fileName.substring(0, 8) +
        "..." +
        fileName.substring(fileName.length - 9, fileName.length)
    : fileName;
};

const UploadedFilePreview = ({ file }: Props) => {
  return (
    <Box sx={{ display: "flex", px: 1 }}>
      <Box sx={{ py: 1, px: 1 }}>
        <img src={ExcelIcon} alt="" width={92} />
      </Box>
      <Box sx={{ flexDirection: "row", py: 2, px: 1 }}>
        <Typography sx={{ fontSize: "12px", textTransform: "none" }}>
          <b>
            {minimizeFileName(file.name)} — {Math.round(file.size / 1000)} KB
          </b>{" "}
          <br />
          {timestampToDatetimeText(file.lastModified)} <br />
          {file.metadata?.totalOrders ? (
            <>{file.metadata?.totalOrders} orders</>
          ) : (
            <>
              {file.metadata?.totalProducts} Products <br />{" "}
              {file.metadata?.totalPreorderProducts} Pre-orders
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default UploadedFilePreview;
