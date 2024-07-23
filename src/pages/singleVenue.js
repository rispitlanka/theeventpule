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
import MDButton from 'components/MDButton';

export default function SingleVenue() {
  // const userDetails = useContext(UserDataContext);
  // const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
  // const userRole = userDetails && userDetails[0].userRole;
  const [venueData, setVenueData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //   const [showsData, setShowsData] = useState([]);
  //   const [allShowTimes, setAllShowTimes] = useState([]);
  //   const [detailedView, setDetailedView] = useState({});
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };
  const { id } = useParams();

  const fetchVenueData = async () => {
    try {
      const { data, error } = await supabase.from('venues').select().eq('id', id);
      if (error) throw error;
      if (data && data.length > 0) {
        setVenueData(data);
        fetchZoneData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchZoneData = async () => {
    try {
      const { data, error } = await supabase.from('zones_events').select().eq('venueId', id);
      if (error) throw error;
      if (data) {
        setZoneData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVenueData();
    // fetchAllShowTimes();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id])

  //   const getCurrentDate = () => {
  //     const today = new Date();
  //     const yyyy = today.getFullYear();
  //     const mm = String(today.getMonth() + 1).padStart(2, '0');
  //     const dd = String(today.getDate()).padStart(2, '0');
  //     return `${yyyy}-${mm}-${dd}`;
  //   };

  //   const currentDate = getCurrentDate();
  //   const sevenDaysFromNow = new Date(currentDate);
  //   sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  //   const formattedSevenDaysFromNow = sevenDaysFromNow.toISOString().split('T')[0];

  //   const fetchShows = async () => {
  //     try {
  //       const currentDate = getCurrentDate();
  //       const { data: fetchedShowsData, error: fetchedShowsError } = await supabase
  //         .from('shows').select('*')
  //         .eq('eventOrganizationId', id)
  //         .gte('date', currentDate)
  //         .lte('date', formattedSevenDaysFromNow);
  //       if (fetchedShowsError) throw error;
  //       setShowsData(fetchedShowsData);
  //       const showTimeIds = fetchedShowsData.map((shows => (shows.showTimeId)));
  //       const movieIds = fetchedShowsData.map((shows => (shows.movieId)));
  //       const screenIds = fetchedShowsData.map((shows => (shows.screenId)));

  //       const [showTimes, movies, zonesOfVenue] = await Promise.all([
  //         supabase.from('showTime').select().in('id', showTimeIds),
  //         supabase.from('movies').select().in('id', movieIds),
  //         supabase.from('zonesOfVenue').select().in('id', screenIds),
  //       ]);

  //       const enhancedShows = fetchedShowsData.map(show => {
  //         const showTime = showTimes.data.find(showTime => showTime.id === show.showTimeId);
  //         const movie = movies.data.find(movie => movie.id === show.movieId);
  //         const screen = zonesOfVenue.data.find(screen => screen.id === show.screenId);

  //         return {
  //           ...show,
  //           movieName: movie ? movie.title : 'Unknown Movie',
  //           screenName: screen ? screen.name : 'Unknown Screen',
  //           showTime: showTime ? showTime.time : 'Unknown Show Time',
  //         };
  //       });
  //       setShowsData(enhancedShows);

  //     } catch (error) {
  //       console.log(error)
  //     }
  //   };

  //   const fetchAllShowTimes = async () => {
  //     try {
  //       const { data: screenIdData, error: acreenIdDataError } = await supabase.from('zonesOfVenue').select('id').eq('eventOrganizationId', id);
  //       if (acreenIdDataError) throw error;
  //       if (screenIdData) {
  //         const screenIds = screenIdData.map(screen => screen.id);
  //         const { data: showTimeData, error: showTimeDataError } = await supabase.from('showTime').select('*').in('screenId', screenIds);
  //         if (showTimeData) {
  //           const uniqueShowTimes = [];
  //           const addedTimes = new Set();
  //           showTimeData.forEach(showTime => {
  //             if (!addedTimes.has(showTime.time)) {
  //               uniqueShowTimes.push(showTime.time);
  //               addedTimes.add(showTime.time);
  //             }
  //           });
  //           uniqueShowTimes.sort();
  //           setAllShowTimes(uniqueShowTimes);
  //         }
  //         if (showTimeDataError) throw error;
  //       }
  //     } catch (error) {
  //       console.log(error);

  //     }
  //   };

  //   const handleDetailedView = (id) => {
  //     setDetailedView(prevState => ({
  //       ...prevState,
  //       [id]: !prevState[id]
  //     }));
  //   };

  //   const [filterOption, setFilterOption] = useState('movie');
  //   const [groupedShows, setGroupedShows] = useState({});
  //   const [anchorEl, setAnchorEl] = useState(null);
  //   const open = Boolean(anchorEl);

  //   useEffect(() => {
  //     const groupShows = (option) => {
  //       switch (option) {
  //         case 'movie':
  //           return showsData.reduce((acc, show) => {
  //             if (!acc[show.movieId]) acc[show.movieId] = {};
  //             if (!acc[show.movieId][show.screenId]) acc[show.movieId][show.screenId] = {};
  //             if (!acc[show.movieId][show.screenId][show.date]) acc[show.movieId][show.screenId][show.date] = [];
  //             acc[show.movieId][show.screenId][show.date].push(show);
  //             return acc;
  //           }, {});
  //         case 'screen':
  //           return showsData.reduce((acc, show) => {
  //             if (!acc[show.screenId]) acc[show.screenId] = {};
  //             if (!acc[show.screenId][show.movieId]) acc[show.screenId][show.movieId] = {};
  //             if (!acc[show.screenId][show.movieId][show.date]) acc[show.screenId][show.movieId][show.date] = [];
  //             acc[show.screenId][show.movieId][show.date].push(show);
  //             return acc;
  //           }, {});
  //         default:
  //           return {};
  //       }
  //     };

  //     setGroupedShows(groupShows(filterOption));
  //   }, [filterOption, showsData]);

  //   const handleClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };

  //   const handleFilterClick = (option) => {
  //     setFilterOption(option);
  //     handleClose();
  //   };

  //   const formattedTime = (time) => {
  //     if (time) {
  //       const [hours, minutes, seconds] = time.split(':');
  //       const date = new Date(0, 0, 0, hours, minutes, seconds);
  //       const options = { hour: '2-digit', minute: '2-digit' };
  //       return date.toLocaleTimeString('en-US', options);
  //     }
  //   };

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
                )}, url(${venueData[0]?.coverImage || ''})`,
              backgroundSize: "cover",
              backgroundPosition: "50%",
              overflow: "hidden",
            }}
          />

          {venueData && venueData.length > 0 ?
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
                    <MDAvatar src={venueData[0].theatreImage} alt="profile-image" size="lg" shadow="sm" />
                  </Grid>
                  <Grid item>
                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                      <MDTypography variant="h5" fontWeight="medium">
                        {venueData[0].name}
                      </MDTypography>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        {venueData[0].location}
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
                          Venue Information
                        </MDTypography>
                      </MDBox>
                      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Name
                        </MDTypography>
                        <MDBox display="flex" alignItems="center" mb={0.5}>
                          <MDBox width="80%" ml={0.5}>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                              {venueData[0].name}
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
                              {venueData[0].location}
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
                              {venueData[0].telephone}
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
                              {venueData[0].ownerName}
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
                              {venueData[0].ownerMobile}
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
                              {venueData[0].ownerEmail}
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

          {/* zones */}
          {venueData[0].isSeat &&
            <>
              <MDBox mt={5} pt={3} px={2} lineHeight={1.25}>
                <MDTypography variant="h6" fontWeight="medium">
                  Zones
                </MDTypography>
                <MDBox mb={1}>
                  <MDTypography variant="button" color="text">
                    Customize your zones
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox p={2} mt={1}>
                <Grid container spacing={6}>
                  <Grid item xs={12} >
                    <Card
                      sx={{
                        backgroundColor: '#b8c7e0',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '30px',
                      }}
                    >
                      <MDTypography>Stage This Way !</MDTypography>
                    </Card>
                  </Grid>
                  {zoneData.map((zone, index) => (
                    <Grid key={index} item xs={12}>
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
                        onClick={() => openPage(`/venues/single-venue/single-zone/${zone.id}`)} style={{ cursor: 'pointer' }}
                      >
                        <MDTypography>{zone.name}</MDTypography>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
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
                      <IconButton onClick={() => openPage(`/venues/single-venue/add-zone/${id}`)}>
                        <AddCircleIcon color='info' sx={{ fontSize: 48 }} />
                      </IconButton>
                      <MDTypography>Add New Zone</MDTypography>
                    </Card>
                  </Grid>
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