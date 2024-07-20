/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { supabase } from "pages/supabaseClient";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator, UserDataContext } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import useUserRoutes from "userRoutes";
import RegisterEvent from "pages/registerEvent";
import MainEventsLists from "pages/mainEventsList";
import SubEventsLists from "pages/subEventsLists";
import RegisterForEvents from "pages/registerForEvents";
import SignUp from "layouts/authentication/sign-up";
import { Box, CircularProgress } from "@mui/material";

export default function App() {
  const userEmail = localStorage.getItem('userEmail');
  const userEmailModified = userEmail && userEmail.substring(1, userEmail.length - 1);
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { userRoutes, isLoading } = useUserRoutes();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userEmailModified) {
          const { data, error } = await supabase
            .from('allUsers')
            .select('*')
            .eq('email', userEmailModified);

          if (data) {
            setUserData(data);
            console.log('Fetched user data:', data);
          }

          if (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userEmailModified]);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  // const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes && allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  useEffect(() => {
    getRoutes()
  }, [userRoutes])

  // const configsButton = (
  //   <MDBox
  //     display="flex"
  //     justifyContent="center"
  //     alignItems="center"
  //     width="3.25rem"
  //     height="3.25rem"
  //     bgColor="white"
  //     shadow="sm"
  //     borderRadius="50%"
  //     position="fixed"
  //     right="2rem"
  //     bottom="2rem"
  //     zIndex={99}
  //     color="dark"
  //     sx={{ cursor: "pointer" }}
  //     onClick={handleConfiguratorOpen}
  //   >
  //     <Icon fontSize="small" color="inherit">
  //       settings
  //     </Icon>
  //   </MDBox>
  // );

  const contextValue = useMemo(
    () => userData,
    [userData]
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <UserDataContext.Provider value={contextValue}>
        {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress color="info" />
        </Box> :
          <>
            {userEmail ?
              <>
                {layout === "dashboard" && (
                  <>
                    <Sidenav
                      color={sidenavColor}
                      brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                      brandName={userData && userData.length > 0 ? userData[0].name : userEmailModified}
                      routes={userRoutes}
                      onMouseEnter={handleOnMouseEnter}
                      onMouseLeave={handleOnMouseLeave}
                    />
                    <Configurator />
                    {/* {configsButton} */}
                  </>
                )}
                {layout === "vr" && <Configurator />}
                <Routes>
                  {getRoutes(userRoutes)}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </>
              :
              <>
                {layout === "vr" && <Configurator />}
                <Routes>
                  {getRoutes(userRoutes)}
                  <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
                  <Route path="/authentication/sign-up" element={<SignUp />} />
                  <Route path="/register/:eventId" element={<RegisterEvent />} />
                  <Route path="/main-events" element={<MainEventsLists />} />
                  <Route path="/main-events/sub-events/:mainEventId" element={<SubEventsLists />} />
                  <Route path="/main-events/sub-events/registerForEvents/:eventId" element={<RegisterForEvents />} />
                </Routes>
              </>
            }
          </>
        }

      </UserDataContext.Provider>
    </ThemeProvider>
  );
}