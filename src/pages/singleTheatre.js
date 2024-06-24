import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Box, Button, Card, CircularProgress, Divider, Fade, IconButton, List, ListItem, Menu, MenuItem, Typography } from '@mui/material';

// @mui icons
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from 'components/MDAvatar';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
// import backgroundImage from "assets/images/theatre2.jpg";
import { UserDataContext } from 'context';
import DataNotFound from 'components/NoData/dataNotFound';

export default function SingleTheatre() {
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const userRole = userDetails[0].userRole;
  const [theatreData, setTheatreData] = useState([]);
  const [screensData, setScreensData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showsData, setShowsData] = useState([]);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };
  const { id } = useParams();
  const theatreID = userTheatreId ? userTheatreId : id;

  const fetchSingleTheatreData = async () => {
    try {
      const { data, error } = await supabase.from('theatres').select().eq('id', theatreID);
      if (error) throw error;
      if (data && data.length > 0) {
        setTheatreData(data);
        console.log(data);
        fetchScreensData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchScreensData = async () => {
    try {
      const { data, error } = await supabase.from('screens').select().eq('theatreId', theatreID);
      if (error) throw error;
      if (data) {
        setScreensData(data);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSingleTheatreData();
    fetchShows();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [theatreID])

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchShows = async () => {
    try {
      const currentDate = getCurrentDate();
      const { data: fetchedShowsData, error: fetchedShowsError } = await supabase
        .from('shows').select('*')
        .eq('theatreId', theatreID)
        .gte('date', currentDate);
      // .lte('date', new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 7)).toISOString().slice(0, 10));;
      if (fetchedShowsError) throw error;
      setShowsData(fetchedShowsData);
      const showTimeIds = fetchedShowsData.map((shows => (shows.showTimeId)));
      const movieIds = fetchedShowsData.map((shows => (shows.movieId)));
      const screenIds = fetchedShowsData.map((shows => (shows.screenId)));

      const [showTimes, movies, screens] = await Promise.all([
        supabase.from('showTime').select().in('id', showTimeIds),
        supabase.from('movies').select().in('id', movieIds),
        supabase.from('screens').select().in('id', screenIds),
      ]);

      const enhancedShows = fetchedShowsData.map(show => {
        const showTime = showTimes.data.find(showTime => showTime.id === show.showTimeId);
        const movie = movies.data.find(movie => movie.id === show.movieId);
        const screen = screens.data.find(screen => screen.id === show.screenId);

        return {
          ...show,
          movieName: movie ? movie.title : 'Unknown Movie',
          screenName: screen ? screen.name : 'Unknown Screen',
          showTime: showTime ? showTime.time : 'Unknown Show Time',
        };
      });
      setShowsData(enhancedShows);

    } catch (error) {
      console.log(error)
    }
  };

  const groupedShows = showsData.reduce((acc, show) => {
    if (!acc[show.movieId]) {
      acc[show.movieId] = {};
    }
    if (!acc[show.movieId][show.screenId]) {
      acc[show.movieId][show.screenId] = [];
    }
    acc[show.movieId][show.screenId].push(show);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {isLoading ?
        <MDBox p={3} display="flex" justifyContent="center">
          <CircularProgress color="info" />
        </MDBox>
        :
        <MDBox position="relative" mb={5}>
          <MDBox
            display="flex"
            alignItems="center"
            position="relative"
            minHeight="18.75rem"
            borderRadius="xl"
            sx={{
              backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
                `${linearGradient(
                  rgba(gradients.info.main, 0.6),
                  rgba(gradients.info.state, 0.6)
                )}, url(${theatreData[0]?.coverImage || ''})`,
              backgroundSize: "cover",
              backgroundPosition: "50%",
              overflow: "hidden",
            }}
          />

          {theatreData && theatreData.length > 0 ?
            <>
              <Card
                sx={{
                  position: "relative",
                  mt: -8,
                  mx: 3,
                  py: 2,
                  px: 2,
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <MDAvatar src={theatreData[0].theatreImage} alt="profile-image" size="lg" shadow="sm" />
                  </Grid>
                  <Grid item>
                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                      <MDTypography variant="h5" fontWeight="medium">
                        {theatreData[0].name}
                      </MDTypography>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        {theatreData[0].city}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>
              </Card>
              <MDBox mt={5} mb={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} xl={4}>
                    <Card sx={{ boxShadow: "none" }}>
                      <MDBox p={2}>
                        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                          Theatre Information
                        </MDTypography>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Name
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {theatreData[0].name}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Address
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {theatreData[0].address}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Telephone
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {theatreData[0].telephone}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6} xl={4}>
                    <Card sx={{ boxShadow: "none" }}>
                      <MDBox p={2}>
                        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                          Owner&apos;s Information
                        </MDTypography>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Name
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {theatreData[0].ownerName}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Mobile
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {theatreData[0].ownerPhoneNumber}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Mail
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {theatreData[0].ownerEmail}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6} xl={4}>
                    <Card sx={{ boxShadow: "none" }}>
                      <Grid display={'flex'} flexDirection={'row'}>
                        <Grid>
                          <Button
                            id="fade-button"
                            aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                          >
                            Click to Show Movies
                          </Button>
                          <Menu
                            id="fade-menu"
                            MenuListProps={{
                              'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                          >
                            {Object.keys(groupedShows).map(movieId => (
                              <MenuItem key={movieId} disableRipple>
                                <Box sx={{ width: '100%' }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    {groupedShows[movieId][Object.keys(groupedShows[movieId])[0]][0].movieName}
                                  </Typography>
                                  <List disablePadding>
                                    {Object.keys(groupedShows[movieId]).map(screenId => (
                                      <Box key={screenId} sx={{ marginBottom: '16px' }}>
                                        <Typography sx={{ marginBottom: '4px' }}>
                                          Screen Name: {groupedShows[movieId][screenId][0].screenName}
                                        </Typography>
                                        <List disablePadding>
                                          {groupedShows[movieId][screenId].map(show => (
                                            <ListItem key={show.screenId} sx={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                              <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={6}>
                                                  <Typography>
                                                    Show Time: {show.date} - {show.showTime}
                                                  </Typography>
                                                </Grid>
                                              </Grid>
                                            </ListItem>
                                          ))}
                                        </List>
                                        <Divider />
                                      </Box>
                                    ))}
                                  </List>
                                </Box>
                              </MenuItem>
                            ))}
                          </Menu>
                        </Grid>
                        <Grid >
                          <Button>Filter By</Button>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </MDBox>
            </>
            :
            <DataNotFound message={'Theatre Not Found !'} />
          }

          {/* screens */}
          {theatreData && theatreData.length > 0 &&
            <>
              <MDBox pt={2} px={2} lineHeight={1.25}>
                <MDTypography variant="h6" fontWeight="medium">
                  Screens
                </MDTypography>
                <MDBox mb={1}>
                  <MDTypography variant="button" color="text">
                    Customize your screens
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={6}>
                  {screensData.map((screen, index) => (
                    <Grid key={index} item xs={12} md={6} xl={3}>
                      <Card
                        sx={{
                          backgroundColor: '#cfe0fd',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '150px'
                        }}
                        onClick={() => openPage(`/theatres/single-theatre/single-screen/${screen.id}`)} style={{ cursor: 'pointer' }}
                      >
                        <MDTypography>{screen.name}</MDTypography>
                      </Card>
                    </Grid>
                  ))}
                  {userRole !== "superAdmin" &&
                    <Grid item xs={12} md={6} xl={3}>
                      <Card
                        sx={{
                          backgroundColor: '#cfe0fd',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '150px'
                        }}>
                        <IconButton onClick={() => openPage(`/theatres/single-theatre/add-screen/${theatreID}`)}>
                          <AddCircleIcon color='info' sx={{ fontSize: 48 }} />
                        </IconButton>
                        <MDTypography>Add New Screen</MDTypography>
                      </Card>
                    </Grid>
                  }
                </Grid>
              </MDBox>
            </>
          }
        </MDBox>
      }
      <Footer />
    </DashboardLayout>
  )
}
