import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GlobalStyle, LightTheme, DarkTheme } from "./Styles/Global";
import { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import React, { Suspense } from "react";
import { DarkModeContext, UserAuthContext } from "./AuxComponents/Contexts";
import { getDarkThemeStatus } from "./AuxComponents/LocalStorageOperations";
import ProtectedRoutes from "./AuxComponents/ProtectedRoutes";
import LoadingAnimation from "./Components/LoadingAnimation";

// Footer
import Footer from "./Components/Footer";

// Sidebar
import Sidebar from "./Components/Sidebar";

//Loading Animation

const NotFound = React.lazy(() => import("./Pages/NotFound"));
const CreateJoin = React.lazy(() => import("./Pages/CreateJoin"));
const BucketList = React.lazy(() => import("./Pages/BucketList"));
const Options = React.lazy(() => import("./Pages/Options"));
const Join = React.lazy(() => import("./Pages/Join"));
const Bucket = React.lazy(() => import("./Pages/Bucket/Bucket"));
const PrivacyPolicy = React.lazy(() => import("./Pages/PrivacyPolicy"));
const TermsAndConditions = React.lazy(() => import("./Pages/TC"));
const MoreAboutBukket = React.lazy(() => import("./Pages/MoreAboutBukket"));

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isUserLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    setIsDarkMode(getDarkThemeStatus());
  }, []);
  function hideSidebar() {
    setIsSidebarOpen(false);
  }
  function showSidebar() {
    setIsSidebarOpen(true);
  }
  return (
    <ThemeProvider theme={isDarkMode ? DarkTheme : LightTheme}>
      <GlobalStyle theme={isDarkMode ? DarkTheme : LightTheme} />
      <Suspense fallback={<LoadingAnimation />}>
        <UserAuthContext.Provider value={{ isUserLoggedIn, setUserLoggedIn }}>
          <BrowserRouter>
            <Switch>
              <Route exact path={"/"}>
                <ProtectedRoutes rest children={[]} />
              </Route>
              <Route exact path={"/s/privacy-policy"}>
                <GlobalStyle theme={LightTheme} />
                <PrivacyPolicy />
                <Footer />
              </Route>
              <Route exact path={"/s/terms-and-conditions"}>
                <GlobalStyle theme={LightTheme} />
                <TermsAndConditions />
                <Footer />
              </Route>
              <Route exact path={"/create-join"}>
                <ProtectedRoutes
                  rest
                  children={[
                    <Sidebar
                      key={"cj1"}
                      activeTab={3}
                      isOpen={isSidebarOpen}
                      onClickClose={hideSidebar}
                      onClickOpen={showSidebar}
                    />,
                    <CreateJoin key={"cj2"} />,
                    <Footer key={"cj3"} />,
                  ]}
                />
              </Route>
              <Route exact path={"/join-bucket"}>
                <ProtectedRoutes
                  rest
                  children={[
                    <Sidebar
                      key={"j1"}
                      activeTab={-1}
                      isOpen={isSidebarOpen}
                      onClickClose={hideSidebar}
                      onClickOpen={showSidebar}
                    />,
                    <Join key={"j2"} directCall={true} />,
                    <Footer key={"j3"} />,
                  ]}
                />
              </Route>
              <Route exact path={"/created-buckets"}>
                <ProtectedRoutes
                  rest
                  children={[
                    <Sidebar
                      key={"cb1"}
                      activeTab={1}
                      isOpen={isSidebarOpen}
                      onClickClose={hideSidebar}
                      onClickOpen={showSidebar}
                    />,
                    <BucketList created={true} key={"cb2"} />,
                    <Footer key={"cb3"} />,
                  ]}
                />
              </Route>
              <Route exact path={"/joined-buckets"}>
                <ProtectedRoutes
                  rest
                  children={[
                    <Sidebar
                      key={"jb1"}
                      activeTab={2}
                      isOpen={isSidebarOpen}
                      onClickClose={hideSidebar}
                      onClickOpen={showSidebar}
                    />,
                    <BucketList created={false} key={"jb2"} />,
                    <Footer key={"jb3"} />,
                  ]}
                />
              </Route>
              <Route exact path={"/bucket"}>
                <ProtectedRoutes
                  rest
                  children={[
                    <Sidebar
                      key={"b1"}
                      activeTab={-1}
                      isOpen={isSidebarOpen}
                      onClickClose={hideSidebar}
                      onClickOpen={showSidebar}
                    />,
                    <Bucket key={"b2"} />,
                  ]}
                />
              </Route>
              <Route exact path={"/user-setting"}>
                <DarkModeContext.Provider
                  value={{
                    isDarkMode,
                    setIsDarkMode,
                  }}
                >
                  <ProtectedRoutes
                    rest
                    children={[
                      <Sidebar
                        key={"st1"}
                        activeTab={4}
                        isOpen={isSidebarOpen}
                        onClickClose={hideSidebar}
                        onClickOpen={showSidebar}
                      />,
                      <Options key={"st2"} />,
                      <Footer key={"st3"} />,
                    ]}
                  />
                </DarkModeContext.Provider>
              </Route>
              <Route exact path={"/more-about-bukket"}>
                <GlobalStyle theme={LightTheme} />
                <ThemeProvider theme={LightTheme}>
                  <MoreAboutBukket />
                  <Footer />
                </ThemeProvider>
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </BrowserRouter>
        </UserAuthContext.Provider>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
