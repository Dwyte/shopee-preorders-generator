import { useEffect, useState } from "react";
import GeneratedListItem from "./components/GeneratedListItem";
import { addUserGeneratedList, getUserGeneratedLists } from "./api";
import ListGeneratorForm from "./components/ListGeneratorForm";
import { GeneratedList, UserGeneratedList } from "./types";
import { Container, SelectChangeEvent } from "@mui/material";
import UserAuthForm from "./components/UserAuthForm";
import GeneratedListsHistory from "./components/GeneratedListsHistory";

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

  const handleUserChange = (event: SelectChangeEvent<string>) => {
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

  const handleSelectedListChange = (event: SelectChangeEvent<string>) => {
    const userGeneratedList = userGeneratedLists[parseInt(event.target.value)];
    console.log(userGeneratedList);
    setCurrentGeneratedList(userGeneratedList.generatedList);
  };

  return (
    <Container>
      <UserAuthForm
        currentUser={currentUser}
        handleUserChange={handleUserChange}
      />

      {currentUser && (
        <GeneratedListsHistory
          userGeneratedLists={userGeneratedLists}
          handleSelectedListChange={handleSelectedListChange}
        />
      )}

      {currentUser && (
        <ListGeneratorForm handleSubmit={handleListGeneratorFormSubmit} />
      )}
      {Object.keys(currentGeneratedList).map((supplierCode, index) => (
        <GeneratedListItem
          key={index}
          supplierCode={supplierCode}
          productsToOrderText={currentGeneratedList[supplierCode]}
        />
      ))}
    </Container>
  );
};

export default App;
