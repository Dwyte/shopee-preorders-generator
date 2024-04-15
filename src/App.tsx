import React, { useEffect, useState } from "react";
import ToOrderListItem from "./components/ToOrderListItem";
import { ToOrderListSimple } from "./scripts";
import { ToOrderListsItem, addToOrderList, getToOrderLists } from "./api";
import ListGeneratorForm from "./components/ListGeneratorForm";

const USERS = ["CJ", "Shia", "Jenna", "Freya", "Xander"];

const App = () => {
  const [currentUser, setUser] = useState<string>("");
  const [toOrderLists, setToOrderLists] = useState<ToOrderListsItem[]>([]);
  const [toOrderList, setToOrderList] = useState<ToOrderListSimple>({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userToOrderLists = await getToOrderLists(currentUser);
      setToOrderLists(userToOrderLists);
    };
    fetchUserData();
  }, [currentUser]);

  const handleUserChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setUser(event.target.value);
  };

  const handleListGeneratorFormSubmit = async (
    generatedToOrderList: ToOrderListSimple
  ) => {
    setToOrderList(generatedToOrderList);
    await addToOrderList(currentUser, generatedToOrderList);
  };

  const handleToOrderListChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setToOrderList(toOrderLists[parseInt(event.target.value)].toOrderList);
  };

  return (
    <div>
      <label htmlFor="usersSelection">
        {currentUser ? "Change User:" : "Please Select User:"}{" "}
      </label>{" "}
      <select
        name="usersSelection"
        id="usersSelection"
        onChange={handleUserChange}
        value={currentUser}
      >
        <option value="" disabled selected>
          -----
        </option>
        {USERS.map((user) => (
          <option value={user}>{user}</option>
        ))}
      </select>
      {currentUser && (
        <>
          {toOrderLists.length ? (
            <>
              <label htmlFor="toOrderListSelection">
                {" "}
                Previously Generated:{" "}
              </label>
              <select
                name="toOrderListSelection"
                id="toOrderListSelection"
                onChange={handleToOrderListChange}
              >
                <option value="" disabled selected>
                  -----
                </option>
                {toOrderLists.map((toOrderList) => (
                  <option value={toOrderList.id}>{toOrderList.datetime}</option>
                ))}
              </select>
            </>
          ) : (
            "(Generate your first List)"
          )}
          <ListGeneratorForm handleSubmit={handleListGeneratorFormSubmit} />
        </>
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
