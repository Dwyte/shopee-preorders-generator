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

  const [currentUserGeneratedList, setCurrentGeneratedList] =
    useState<UserGeneratedList | null>(null);

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
    setCurrentGeneratedList(newUserGeneratedList);
  };

  const handleSelectedListChange = (event: SelectChangeEvent<string>) => {
    const userGeneratedList = userGeneratedLists.find(
      (v) => v.datetime === event.target.value
    );

    if (userGeneratedList) {
      setCurrentGeneratedList(userGeneratedList);
    }
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
                    currentUserGeneratedList={currentUserGeneratedList}
                    userGeneratedLists={userGeneratedLists}
                    handleSelectedListChange={handleSelectedListChange}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/newList" replace />} />
            </Routes>
          </Box>
        )}

        {currentUserGeneratedList &&
          Object.keys(currentUserGeneratedList.generatedList).map(
            (supplierCode, index) => (
              <GeneratedListItem
                key={index}
                supplierCode={supplierCode}
                productsToOrderText={
                  currentUserGeneratedList.generatedList[supplierCode]
                }
              />
            )
          )}
      </Container>
    </BrowserRouter>
  );
};

export default App;
