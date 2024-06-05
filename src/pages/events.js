
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DataNotFound from 'components/NoData/dataNotFound';
import { Box, CircularProgress, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { UserDataContext } from 'context';
import { supabase } from './supabaseClient';
import EditIcon from '@mui/icons-material/Edit';

export default function Events() {
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [mainEventData, setMainEventdata] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [mainEventId, setMainEventId] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);


  const fetchMainEventData = async () => {
    try {
      const { data, error } = await supabase.from('mainEvent').select('*').eq('theatreId', userTheatreId);
      if (data) {
        setMainEventdata(data);
        console.log('Data fetched succesfully:', data);
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error('Error inserting data:', error.message);
    }
  };

  const fetchEventsData = async () => {
    try {
      let query = supabase.from('events').select('*').eq('theatreId', userTheatreId);
      if (mainEventId !== null) {
        query = query.eq('mainEventId', mainEventId);
      } else {
        query = query.is('mainEventId', null);
      }
      const { data, error } = await query;
      if (error) throw error;
      setEventsData(data);
      console.log('Events fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  useEffect(() => {
    fetchMainEventData();
  }, [userTheatreId]);

  useEffect(() => {
    fetchEventsData();
  }, [userTheatreId, mainEventId]);

  const handleMainEventClick = (mainEventId) => {
    setMainEventId(mainEventId);
  }

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleMainEventClick(newValue === 0 ? null : mainEventData[newValue - 1]?.id);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                pt={1}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Events
                </MDTypography>
                <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                  <MDButton onClick={() => openPage("/events/add-event")}><AddIcon color="info" /></MDButton>
                </MDBox>
              </MDBox>

              <Box sx={{ maxWidth: { xs: '100%', sm: '100%' }, mt: 2, p: 2 }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab
                    label="Uncategorized"
                    onClick={() => handleMainEventClick(null)} value={0}
                  />
                  {mainEventData && mainEventData.map((event, index) => (
                    <Tab
                      key={event.id}
                      label={event.title}
                      onClick={() => handleMainEventClick(event.id)}
                      value={index + 1}
                      icon={<EditIcon onClick={(e) => { e.stopPropagation(); openPage(`/events/edit-mainEvent/${event.id}`); }} />}
                    />
                  ))}
                  <Tab
                    label="Add Event"
                    onClick={() => openPage("/events/add-mainEvent")}
                    value={mainEventData.length + 1} />
                </Tabs>
              </Box>

              {isLoading ? (
                <MDBox p={3} display="flex" justifyContent="center">
                  <CircularProgress color="info" />
                </MDBox>
              ) : eventsData && eventsData.length > 0 ? (
                <MDBox pt={3}>
                  <TableContainer component={Paper} sx={{ mt: 9, p: 2 }}>
                    <Table>
                      <TableHead sx={{ display: "table-header-group" }}>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align='center'>Description</TableCell>
                          <TableCell align='center'>Status</TableCell>
                          <TableCell align='center'>Category</TableCell>
                          <TableCell align='center'>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {eventsData.map((row) => (
                          <TableRow key={row.id} onClick={(e) => { e.stopPropagation(); openPage(`/events/single-event/${row.id}`); }} style={{ cursor: 'pointer' }}>
                            <TableCell >{row.name}</TableCell>
                            <TableCell align='center'>{row.description}</TableCell>
                            <TableCell align='center'>{row.status}</TableCell>
                            <TableCell align='center'>{row.category}</TableCell>
                            <TableCell align='center' onClick={(e) => { e.stopPropagation(); openPage(`/events/edit-event/${row.id}`); }}>Edit</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MDBox>
              ) : (
                <DataNotFound message={'No Events Available !'} image={noDataImage} />
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}