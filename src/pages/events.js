
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

// @mui material components
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

  const [value, setValue] = useState(0);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

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

              <Box sx={{ maxWidth: { xs: '100%', sm: '100%' }, bgcolor: 'grey' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="scrollable force tabs example"
                >
                  <Tab label="Uncategorized" onClick={() => handleMainEventClick(null)} />
                  {mainEventData && mainEventData.map((event) => (
                    <Tab key={event.id} label={event.title} onClick={() => handleMainEventClick(event.id)} />
                  ))}
                  <Tab label="Add Event" onClick={() => openPage("/events/add-mainEvent")} />
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {eventsData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell >{row.name}</TableCell>
                            <TableCell align='center'>{row.description}</TableCell>
                            <TableCell align='center'>{row.status}</TableCell>
                            <TableCell align='center'>{row.category}</TableCell>
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
