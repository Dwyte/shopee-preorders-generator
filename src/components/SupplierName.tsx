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
import { useContext } from "react";
import UserSettingsContext from "../contexts/UserSettingsContext";

const stallColors = {
  pink: pink[200],
  blue: blue[400],
  red: red[400],
  green: green[400],
  yellow: yellow[500],
  orange: orange[400],
  violet: purple[400],
};

const SupplierName = ({ supplierCode }: { supplierCode: string }) => {
  const userSettings = useContext(UserSettingsContext);

  let mappedSupplierCode = supplierCode;

  if (
    userSettings?.supplierCodeMapping &&
    userSettings?.supplierCodeMapping[supplierCode]
  ) {
    mappedSupplierCode = userSettings?.supplierCodeMapping[supplierCode];
  }

  console.log(mappedSupplierCode, userSettings);
  const { name, number, color } = disectSupplierCode(mappedSupplierCode);
  console.log(name, number, color);

  return (
    <>
      {number && color ? (
        <>
          <Chip
            label={`${color.toUpperCase()} #${number}`}
            sx={{
              bgcolor: stallColors[color],
              fontWeight: "bold",
              color: "black",
            }}
            size="small"
          />{" "}
          <b> — {name.toUpperCase()}</b>
        </>
      ) : (
        mappedSupplierCode
      )}
    </>
  );
};

export default SupplierName;
