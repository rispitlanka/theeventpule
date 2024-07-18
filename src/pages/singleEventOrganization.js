import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Box, Button, Card, CardContent, CircularProgress, IconButton, List, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// @mui icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

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

export default function SingleEventOrganization() {
  const userDetails = useContext(UserDataContext);
  const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
  const userRole = userDetails && userDetails[0].userRole;
  const [organizationData, setOrganizationData] = useState([]);
  // const [screensData, setScreensData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [showsData, setShowsData] = useState([]);
  // const [allShowTimes, setAllShowTimes] = useState([]);
  // const [detailedView, setDetailedView] = useState({});
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };
  const { id } = useParams();
  const userOrganizationID = userOrganizationId ? userOrganizationId : id;

  const fetchSingleOrganizationData = async () => {
    try {
      const { data, error } = await supabase.from('eventOrganizations').select().eq('id', userOrganizationID);
      if (error) throw error;
      if (data && data.length > 0) {
        setOrganizationData(data);
        // fetchScreensData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchScreensData = async () => {
  //   try {
  //     const { data, error } = await supabase.from('screens').select().eq('theatreId', userOrganizationID);
  //     if (error) throw error;
  //     if (data) {
  //       setScreensData(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    fetchSingleOrganizationData();
    // fetchShows();
    // fetchAllShowTimes();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [userOrganizationID])

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const currentDate = getCurrentDate();
  const sevenDaysFromNow = new Date(currentDate);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const formattedSevenDaysFromNow = sevenDaysFromNow.toISOString().split('T')[0];

  const fetchShows = async () => {
    try {
      const currentDate = getCurrentDate();
      const { data: fetchedShowsData, error: fetchedShowsError } = await supabase
        .from('shows').select('*')
        .eq('theatreId', userOrganizationID)
        .gte('date', currentDate)
        .lte('date', formattedSevenDaysFromNow);
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

  const fetchAllShowTimes = async () => {
    try {
      const { data: screenIdData, error: acreenIdDataError } = await supabase.from('screens').select('id').eq('theatreId', userOrganizationID);
      if (acreenIdDataError) throw error;
      if (screenIdData) {
        const screenIds = screenIdData.map(screen => screen.id);
        const { data: showTimeData, error: showTimeDataError } = await supabase.from('showTime').select('*').in('screenId', screenIds);
        if (showTimeData) {
          const uniqueShowTimes = [];
          const addedTimes = new Set();
          showTimeData.forEach(showTime => {
            if (!addedTimes.has(showTime.time)) {
              uniqueShowTimes.push(showTime.time);
              addedTimes.add(showTime.time);
            }
          });
          uniqueShowTimes.sort();
          setAllShowTimes(uniqueShowTimes);
        }
        if (showTimeDataError) throw error;
      }
    } catch (error) {
      console.log(error);

    }
  };

  // const handleDetailedView = (id) => {
  //   setDetailedView(prevState => ({
  //     ...prevState,
  //     [id]: !prevState[id]
  //   }));
  // };

  // const [filterOption, setFilterOption] = useState('movie');
  // const [groupedShows, setGroupedShows] = useState({});
  // const [anchorEl, setAnchorEl] = useState(null);
  // const open = Boolean(anchorEl);

  // useEffect(() => {
  //   const groupShows = (option) => {
  //     switch (option) {
  //       case 'movie':
  //         return showsData.reduce((acc, show) => {
  //           if (!acc[show.movieId]) acc[show.movieId] = {};
  //           if (!acc[show.movieId][show.screenId]) acc[show.movieId][show.screenId] = {};
  //           if (!acc[show.movieId][show.screenId][show.date]) acc[show.movieId][show.screenId][show.date] = [];
  //           acc[show.movieId][show.screenId][show.date].push(show);
  //           return acc;
  //         }, {});
  //       case 'screen':
  //         return showsData.reduce((acc, show) => {
  //           if (!acc[show.screenId]) acc[show.screenId] = {};
  //           if (!acc[show.screenId][show.movieId]) acc[show.screenId][show.movieId] = {};
  //           if (!acc[show.screenId][show.movieId][show.date]) acc[show.screenId][show.movieId][show.date] = [];
  //           acc[show.screenId][show.movieId][show.date].push(show);
  //           return acc;
  //         }, {});
  //       default:
  //         return {};
  //     }
  //   };

  //   setGroupedShows(groupShows(filterOption));
  // }, [filterOption, showsData]);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleFilterClick = (option) => {
  //   setFilterOption(option);
  //   handleClose();
  // };

  const formattedTime = (time) => {
    if (time) {
      const [hours, minutes, seconds] = time.split(':');
      const date = new Date(0, 0, 0, hours, minutes, seconds);
      const options = { hour: '2-digit', minute: '2-digit' };
      return date.toLocaleTimeString('en-US', options);
    }
  };

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
                )}, url(${organizationData[0]?.coverImage || ''})`,
              backgroundSize: "cover",
              backgroundPosition: "50%",
              overflow: "hidden",
            }}
          />

          {organizationData && organizationData.length > 0 ?
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
                    <MDAvatar src={organizationData[0].theatreImage} alt="profile-image" size="lg" shadow="sm" />
                  </Grid>
                  <Grid item>
                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                      <MDTypography variant="h5" fontWeight="medium">
                        {organizationData[0].name}
                      </MDTypography>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        {organizationData[0].city}
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
                          Organization Information
                        </MDTypography>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Name
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {organizationData[0].name}
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
                              {organizationData[0].address}
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
                              {organizationData[0].telephone}
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
                              {organizationData[0].ownerName}
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
                              {organizationData[0].ownerPhoneNumber}
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
                              {organizationData[0].ownerEmail}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>
              </MDBox>
            </>
            :
            <DataNotFound message={'Theatre Not Found !'} />
          }

          {/* screens */}
          {/* {organizationData && organizationData.length > 0 &&
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
                        <IconButton onClick={() => openPage(`/theatres/single-theatre/add-screen/${userOrganizationID}`)}>
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

          {showsData && showsData.length > 0 ?
            <MDBox pt={4} px={2} lineHeight={1.25}>
              <Grid container>
                <Grid item xs={12}>
                  <MDTypography variant="h6" fontWeight="medium">
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}s
                  </MDTypography>
                  <List>
                    {filterOption === 'movie' && Object.keys(groupedShows).map(movieId => (
                      <Grid key={movieId} item xs={12}>
                        <Card sx={{ p: 2, mt: 1, width: '100%' }}>
                          <CardContent>
                            <Grid display='flex' flexDirection='row' alignItems={'center'}>
                              <MDTypography mr={2}>
                                Movie:&nbsp;{groupedShows[movieId] && groupedShows[movieId][Object.keys(groupedShows[movieId])[0]][Object.keys(groupedShows[movieId][Object.keys(groupedShows[movieId])[0]])[0]][0].movieName}
                              </MDTypography>
                              <ArrowDropDownCircleOutlinedIcon onClick={() => handleDetailedView(movieId)} style={{ cursor: 'pointer' }} />
                            </Grid>
                            {detailedView[movieId] &&
                              <List>
                                {groupedShows[movieId] && Object.keys(groupedShows[movieId]).map(screenId => (
                                  <Box key={screenId}>
                                    <MDTypography >
                                      Screen:&nbsp;{groupedShows[movieId][screenId][Object.keys(groupedShows[movieId][screenId])[0]][0].screenName}
                                    </MDTypography>
                                    <Table>
                                      <TableHead sx={{ display: "table-header-group" }}>
                                        <TableRow>
                                          <TableCell sx={{ width: '120px' }}>Date</TableCell>
                                          <TableCell align="center" colSpan={allShowTimes ? allShowTimes.length : 1}>Time</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell></TableCell>
                                          {allShowTimes && allShowTimes.map(time => (
                                            <TableCell align="center" key={time}>{formattedTime(time)}</TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {Object.keys(groupedShows[movieId][screenId]).map(date => (
                                          <TableRow key={date}>
                                            <TableCell>{date}</TableCell>
                                            {allShowTimes && allShowTimes.map(time => (
                                              <TableCell key={time} align="center" >
                                                {groupedShows[movieId][screenId][date].some(show => show.showTime === time) ? (<TaskAltIcon style={{ color: 'green' }} />) : ''}
                                              </TableCell>
                                            ))}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                ))}
                              </List>
                            }
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    {filterOption === 'screen' && Object.keys(groupedShows).map(screenId => (
                      <Grid key={screenId} item xs={12}>
                        <Card sx={{ p: 2, mt: 1, width: '100%' }}>
                          <CardContent>
                            <Grid display='flex' flexDirection='row' alignItems={'center'}>
                              <MDTypography mr={2}>
                                Screen:&nbsp;{groupedShows[screenId] && groupedShows[screenId][Object.keys(groupedShows[screenId])[0]][Object.keys(groupedShows[screenId][Object.keys(groupedShows[screenId])[0]])[0]][0].screenName}
                              </MDTypography>
                              <ArrowDropDownCircleOutlinedIcon onClick={() => handleDetailedView(screenId)} style={{ cursor: 'pointer' }} />
                            </Grid>
                            {detailedView[screenId] &&
                              <List>
                                {groupedShows[screenId] && Object.keys(groupedShows[screenId]).map(movieId => (
                                  <Box key={movieId}>
                                    <MDTypography>
                                      Movie:&nbsp;{groupedShows[screenId][movieId][Object.keys(groupedShows[screenId][movieId])[0]][0].movieName}
                                    </MDTypography>
                                    <Table>
                                      <TableHead sx={{ display: "table-header-group" }}>
                                        <TableRow>
                                          <TableCell sx={{ width: '120px' }}>Date</TableCell>
                                          <TableCell align="center" colSpan={allShowTimes ? allShowTimes.length : 1}>Time</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell></TableCell>
                                          {allShowTimes && allShowTimes.map(time => (
                                            <TableCell align="center" key={time}>{formattedTime(time)}</TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {Object.keys(groupedShows[screenId][movieId]).map(date => (
                                          <TableRow key={date}>
                                            <TableCell>{date}</TableCell>
                                            {allShowTimes && allShowTimes.map(time => (
                                              <TableCell key={time} align="center" >
                                                {groupedShows[screenId][movieId][date].some(show => show.showTime === time) ? (<TaskAltIcon style={{ color: 'green' }} />) : ''}
                                              </TableCell>
                                            ))}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                ))}
                              </List>
                            }
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </List>
                </Grid>
                <Grid sx={{ position: 'absolute', right: 16 }}>
                  <div>
                    <Button
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    >
                      Filter By
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={() => handleFilterClick('movie')}>Movie</MenuItem>
                      <MenuItem onClick={() => handleFilterClick('screen')}>Screen</MenuItem>
                    </Menu>
                  </div>
                </Grid>
              </Grid>
            </MDBox>
            :
            <></>} */}
        </MDBox>
      }
      <Footer />
    </DashboardLayout>
  )
}