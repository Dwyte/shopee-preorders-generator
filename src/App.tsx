import { useEffect, useState } from "react";
import GeneratedListItem from "./components/GeneratedListItem";
import { addUserGeneratedList, getUserGeneratedLists } from "./api";
import ListGeneratorForm from "./components/ListGeneratorForm";
import { GeneratedList, UserGeneratedList } from "./types";
import { Box, Container, SelectChangeEvent } from "@mui/material";
import UserAuthForm from "./components/UserAuthForm";
import GeneratedListsHistory from "./components/GeneratedListsHistory";
import NavBarTabs from "./components/NavBarTabs";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const App = () => {
  const [currentUser, setUser] = useState<string>("");
  const [userGeneratedLists, setUserGeneratedLists] = useState<
    UserGeneratedList[]
  >([]);
  const [currentGeneratedList, setCurrentGeneratedList] =
    useState<GeneratedList | null>(null);

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
    resetCurrentGeneratedList();
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

  const resetCurrentGeneratedList = () => {
    setCurrentGeneratedList(null);
  };

  return (
    <BrowserRouter>
      <Container>
        <UserAuthForm
          currentUser={currentUser}
          handleUserChange={handleUserChange}
        />

        {currentUser && (
          <NavBarTabs resetCurrentGeneratedList={resetCurrentGeneratedList} />
        )}

        {currentUser && (
          <Box sx={{ my: 1 }}>
            <Routes>
              <Route
                path="/newList"
                element={
                  <ListGeneratorForm
                    handleSubmit={handleListGeneratorFormSubmit}
                    resetCurrentGeneratedList={resetCurrentGeneratedList}
                  />
                }
              />
              <Route
                path="/history"
                element={
                  <GeneratedListsHistory
                    userGeneratedLists={userGeneratedLists}
                    handleSelectedListChange={handleSelectedListChange}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/newList" replace />} />
            </Routes>
          </Box>
        )}

        {currentGeneratedList &&
          Object.keys(currentGeneratedList).map((supplierCode, index) => (
            <GeneratedListItem
              key={index}
              supplierCode={supplierCode}
              productsToOrderText={currentGeneratedList[supplierCode]}
            />
          ))}
      </Container>
    </BrowserRouter>
  );
};

export default App;
