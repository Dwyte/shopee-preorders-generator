import React, { useEffect, useState } from "react";
import GeneratedListItem from "./components/GeneratedListItem";
import { addUserGeneratedList, getUserGeneratedLists } from "./api";
import ListGeneratorForm from "./components/ListGeneratorForm";
import { GeneratedList, UserGeneratedList } from "./types";

const USERS = ["CJ", "Shia", "Jenna", "Freya", "Xander"];

const App = () => {
  const [currentUser, setUser] = useState<string>("");
  const [userGeneratedLists, setUserGeneratedLists] = useState<
    UserGeneratedList[]
  >([]);
  const [currentGeneratedList, setCurrentGeneratedList] =
    useState<GeneratedList>({});

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUserGeneratedLists = await getUserGeneratedLists(
        currentUser
      );

      setUserGeneratedLists(fetchedUserGeneratedLists);
    };
    fetchUserData();
  }, [currentUser]);

  const handleUserChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setUser(event.target.value);
  };

  const handleListGeneratorFormSubmit = async (
    generatedList: GeneratedList
  ) => {
    const newUserGeneratedList = await addUserGeneratedList(
      currentUser,
      generatedList
    );
    setUserGeneratedLists([...userGeneratedLists, newUserGeneratedList]);
    setCurrentGeneratedList(generatedList);
  };

  const handleSelectedListChange: React.ChangeEventHandler<
    HTMLSelectElement
  > = (event) => {
    const userGeneratedList = userGeneratedLists[parseInt(event.target.value)];
    console.log(userGeneratedList);
    setCurrentGeneratedList(userGeneratedList.generatedList);
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
          {userGeneratedLists.length ? (
            <>
              <label htmlFor="userGeneratedListsSelection">
                {" "}
                Previously Generated:{" "}
              </label>
              <select
                name="userGeneratedListsSelection"
                id="userGeneratedListsSelection"
                onChange={handleSelectedListChange}
              >
                <option value="" disabled selected>
                  -----
                </option>
                {userGeneratedLists.map((generatedList, index) => (
                  <option value={index}>{generatedList.datetime}</option>
                ))}
              </select>
            </>
          ) : (
            "(Generate your first List)"
          )}
          <ListGeneratorForm handleSubmit={handleListGeneratorFormSubmit} />
        </>
      )}
      {Object.keys(currentGeneratedList).map((supplierCode, index) => (
        <GeneratedListItem
          key={index}
          supplierCode={supplierCode}
          productsToOrderText={currentGeneratedList[supplierCode]}
        />
      ))}
    </div>
  );
};

export default App;
