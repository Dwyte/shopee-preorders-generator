import React, { useState } from "react";
import { generateToOrdersList } from "./scripts";

const App = () => {
  const [daysToShipFile, setDaysToShipFile] = useState<File | null>(null);
  const [bigSellerOrdersFile, setBigSellerOrdersFile] = useState<File | null>(
    null
  );

  const [toOrderList, setToOrderList] = useState<{
    [key: string]: { [key: string]: { [key: string]: number } };
  }>({});

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setter(file);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (daysToShipFile !== null && bigSellerOrdersFile !== null) {
      const toOrdersList = await generateToOrdersList(
        daysToShipFile,
        bigSellerOrdersFile
      );

      setToOrderList(toOrdersList);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="dtsFileInput">Days to Ship File</label> <br />
        <input
          id="dtsFileInput"
          type="file"
          onChange={(event) => handleFileChange(event, setDaysToShipFile)}
        />
        <br />
        <label htmlFor="ordersFileInput">BigSeller Orders File</label> <br />
        <input
          id="ordersFileInput"
          type="file"
          onChange={(event) => handleFileChange(event, setBigSellerOrdersFile)}
        />
        <br />
        <input type="submit" />
      </form>

      {/* {["a"].map((supplierCode) => <div>{supplierCode}<div/>)} */}

      {Object.keys(toOrderList).map((supplierCode, index) => (
        <div key={index}>
          ---------------------------------
          <br />
          {supplierCode} <br />
          {Object.keys(toOrderList[supplierCode]).map((productName) => (
            <>
              {productName} <br />
              {Object.keys(toOrderList[supplierCode][productName]).map(
                (variation) => (
                  <>
                    {toOrderList[supplierCode][productName][variation]}{" "}
                    {variation}
                    <br />
                  </>
                )
              )}
              <br />
            </>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
