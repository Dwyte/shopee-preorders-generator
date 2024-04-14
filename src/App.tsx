import React, { useState } from "react";
import { generateToOrdersList } from "./scripts";
import ToOrderListItem from "./components/ToOrderListItem";
import { ToOrderListSimple } from "./scripts";

const USERS = ["CJ", "Shia", "Jenna", "Freya", "Xander"];

const App = () => {
  const [currentUser, setUser] = useState<string>("");
  const [daysToShipFile, setDaysToShipFile] = useState<File | null>(null);
  const [bigSellerOrdersFile, setBigSellerOrdersFile] = useState<File | null>(
    null
  );

  const handleUserChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setUser(event.target.value);
  };

  const [toOrderList, setToOrderList] = useState<ToOrderListSimple>({});

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
      <label htmlFor="usersSelection">
        {currentUser ? "Change User:" : "Please Select User:"}{" "}
      </label>{" "}
      <select
        name="users"
        id="usersSelection"
        onChange={handleUserChange}
        value={currentUser}
      >
        <option value="" disabled selected>
          -----
        </option>
        {USERS.map((user) => (
          <option>{user}</option>
        ))}
      </select>
      {currentUser && (
        <form onSubmit={handleSubmit}>
          <br />
          <label htmlFor="dtsFileInput">Days to Ship File</label> <br />
          <input
            id="dtsFileInput"
            type="file"
            onChange={(event) => handleFileChange(event, setDaysToShipFile)}
          />
          <br />
          <br />
          <label htmlFor="ordersFileInput">BigSeller Orders File</label> <br />
          <input
            id="ordersFileInput"
            type="file"
            onChange={(event) =>
              handleFileChange(event, setBigSellerOrdersFile)
            }
          />
          <br />
          <br />
          <input type="submit" />
          <br />
        </form>
      )}
      {Object.keys(toOrderList).map((supplierCode, index) => (
        <ToOrderListItem
          key={index}
          supplierCode={supplierCode}
          productsToOrderText={toOrderList[supplierCode]}
        />
      ))}
    </div>
  );
};

export default App;
