import { Chip } from "@mui/material";
import { disectSupplierCode } from "../scripts";
import {
  pink,
  blue,
  red,
  green,
  yellow,
  orange,
  purple,
} from "@mui/material/colors";

const stallColors = {
  pink: pink[200],
  blue: blue[400],
  red: red[400],
  green: green[400],
  yellow: yellow[400],
  orange: orange[400],
  violet: purple[400],
};

const SupplierName = ({ supplierCode }: { supplierCode: string }) => {
  const { name, number, color } = disectSupplierCode(supplierCode);
  return (
    <>
      {number && color ? (
        <>
          <Chip
            label={`${color.toUpperCase()} #${number}`}
            sx={{ bgcolor: stallColors[color], fontWeight: "bold" }}
            size="small"
          />{" "}
          — {name.toUpperCase()}
        </>
      ) : (
        supplierCode
      )}
    </>
  );
};

export default SupplierName;
