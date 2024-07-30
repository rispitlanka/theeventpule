
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
import { Box, CircularProgress, Paper, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { UserDataContext } from 'context';
import { supabase } from './supabaseClient';
import EditIcon from '@mui/icons-material/Edit';

export default function Events() {
  const userDetails = useContext(UserDataContext);
  const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
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
      const { data, error } = await supabase.from('mainEvent').select('*').eq('eventOrganizationId', userOrganizationId);
      if (data) {
        setMainEventdata(data);
        console.log('Data fetched succesfully:', data);
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error('Error in fetching data:', error.message);
    }
  };

  const fetchEventsData = async () => {
    try {
      let query = supabase.from('events').select('*').eq('eventOrganizationId', userOrganizationId);
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
  }, [userOrganizationId]);

  useEffect(() => {
    fetchEventsData();
  }, [userOrganizationId, mainEventId]);

  const handleMainEventClick = (mainEventId) => {
    setMainEventId(mainEventId);
  }

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleMainEventClick(newValue === 0 ? null : mainEventData[newValue - 1]?.id);
  };

  const selectedMainEvent = mainEventData.find(event => event.id === mainEventId);

  const handleStatusChange = async (eventId, newValue) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ isActive: newValue })
        .eq('id', eventId);
      if (error) throw error;

      setEventsData(prevData =>
        prevData.map(event =>
          event.id === eventId ? { ...event, isActive: newValue } : event
        )
      );
    } catch (error) {
      console.log(error);
    }
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
                    // icon={<EditIcon onClick={(e) => { e.stopPropagation(); openPage(`/events/edit-mainEvent/${event.id}`); }} />}
                    />
                  ))}
                  <Tab
                    icon={<AddIcon />}
                    label="Add Main Event"
                    onClick={() => openPage("/events/add-mainEvent")}
                    value={mainEventData.length + 1} />
                </Tabs>
              </Box>

              {selectedMainEvent && (
                <Grid key={selectedMainEvent.id} display={'flex'} flexDirection={'row'} px={2} mb={-2}>
                  <MDTypography variant='h5' mr={2}>{selectedMainEvent.title}</MDTypography>
                  <EditIcon onClick={(e) => { e.stopPropagation(); openPage(`/events/edit-mainEvent/${selectedMainEvent.id}`); }} style={{ cursor: 'pointer' }} />
                </Grid>
              )}

              {isLoading ? (
                <MDBox p={3} display="flex" justifyContent="center">
                  <CircularProgress color="info" />
                </MDBox>
              ) : eventsData && eventsData.length > 0 ? (
                <MDBox pt={3}>
                  <TableContainer component={Paper} sx={{ p: 2 }}>
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
                          <TableRow key={row.id} >
                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/events/single-event/${row.id}`); }} style={{ cursor: 'pointer' }}>{row.name}</TableCell>
                            <TableCell align='center'>{row.description}</TableCell>
                            <TableCell align='center'><Switch checked={row.isActive} onChange={(e) => handleStatusChange(row.id, e.target.checked)} /></TableCell>
                            <TableCell align='center'>{row.category}</TableCell>
                            <TableCell align='center' onClick={(e) => { e.stopPropagation(); openPage(`/events/edit-event/${row.id}`); }} style={{ cursor: 'pointer' }}>Edit</TableCell>
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