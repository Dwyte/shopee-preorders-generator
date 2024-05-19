import { Box, Container, Paper, SelectChangeEvent } from "@mui/material";
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

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeContext from "./contexts/ThemeContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme();

const App = () => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  const [currentUser, setUser] = useState<string>("");

  const [userGeneratedLists, setUserGeneratedLists] = useState<
    UserGeneratedList[]
  >([]);

  const [currentUserGeneratedList, setCurrentUserGeneratedList] =
    useState<UserGeneratedList | null>(null);

  useEffect(() => {
    const themeSavedLocally = localStorage.getItem("currentTheme");
    if (themeSavedLocally) {
      setCurrentTheme(themeSavedLocally);
    }
  }, []);

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

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? " light" : "dark";

    setCurrentTheme(newTheme);
    localStorage.setItem("currentTheme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <ThemeProvider theme={currentTheme === "dark" ? darkTheme : lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Container maxWidth="md" sx={{ my: 2 }}>
            <Paper sx={{ p: 2 }} elevation={1}>
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

                          {currentUserGeneratedList && (
                            <UserGeneratedListSection
                              currentUserGeneratedList={
                                currentUserGeneratedList
                              }
                              handleDeleteUserGeneratedList={
                                handleDeleteUserGeneratedList
                              }
                            />
                          )}
                        </>
                      }
                    />

                    <Route
                      path="/settings"
                      element={<Settings currentUser={currentUser} />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/newList" replace />}
                    />
                  </Routes>
                </Box>
              )}
            </Paper>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
