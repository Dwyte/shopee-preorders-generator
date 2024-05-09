import { Box, Container, Divider, SelectChangeEvent } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import UserGeneratedListSection from "./components/UserGeneratedListSection";
import GeneratedListsHistory from "./components/GeneratedListsHistory";
import ListGeneratorForm from "./components/ListGeneratorForm";
import UserAuthForm from "./components/UserAuthForm";
import NavBarTabs from "./components/NavBarTabs";

import {
  addUserGeneratedList,
  deleteUserGeneratedList,
  getUserGeneratedLists,
} from "./api";
import { GeneratedList, UserGeneratedList } from "./types";
import Settings from "./components/Settings";

const App = () => {
  const [currentUser, setUser] = useState<string>("");

  const [userGeneratedLists, setUserGeneratedLists] = useState<
    UserGeneratedList[]
  >([]);

  const [currentUserGeneratedList, setCurrentUserGeneratedList] =
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
    setUserGeneratedLists([newUserGeneratedList, ...userGeneratedLists]);
    setCurrentUserGeneratedList(newUserGeneratedList);
  };

  const handleSelectedListChange = (event: SelectChangeEvent<string>) => {
    const userGeneratedList = userGeneratedLists.find(
      (v) => v.datetime === parseInt(event.target.value)
    );

    if (userGeneratedList) {
      setCurrentUserGeneratedList(userGeneratedList);
    }
  };

  const handleDeleteUserGeneratedList = async (id: string) => {
    await deleteUserGeneratedList(id);
    setUserGeneratedLists((currUserGeneratedLists) =>
      currUserGeneratedLists.filter((v) => v.id !== id)
    );
    resetCurrentGeneratedList();
  };

  const resetCurrentGeneratedList = () => {
    setCurrentUserGeneratedList(null);
  };

  return (
    <BrowserRouter>
      <Container>
        <UserAuthForm
          currentUser={currentUser}
          handleUserChange={handleUserChange}
        />

        {currentUser && <NavBarTabs />}

        {currentUser && (
          <Box sx={{ my: 1 }}>
            <Routes>
              <Route
                path="/newList"
                element={
                  <ListGeneratorForm
                    currentUser={currentUser}
                    handleSubmit={handleListGeneratorFormSubmit}
                  />
                }
              />
              <Route
                path="/history"
                element={
                  <>
                    <GeneratedListsHistory
                      currentUserGeneratedList={currentUserGeneratedList}
                      userGeneratedLists={userGeneratedLists}
                      handleSelectedListChange={handleSelectedListChange}
                    />

                    <Divider sx={{ mb: 1 }} />

                    {currentUserGeneratedList && (
                      <UserGeneratedListSection
                        currentUserGeneratedList={currentUserGeneratedList}
                        handleDeleteUserGeneratedList={
                          handleDeleteUserGeneratedList
                        }
                      />
                    )}
                  </>
                }
              />

              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/newList" replace />} />
            </Routes>
          </Box>
        )}
      </Container>
    </BrowserRouter>
  );
};

export default App;
