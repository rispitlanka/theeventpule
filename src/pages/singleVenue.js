import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Card, CircularProgress, IconButton, } from '@mui/material';

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
import DataNotFound from 'components/NoData/dataNotFound';

export default function SingleVenue() {
  const [venueData, setVenueData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };
  const { id } = useParams();

  const fetchVenueData = async () => {
    try {
      const { data, error } = await supabase.from('venues').select('*,venue_locations(city)').eq('id', id);
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
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id])

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
                        {venueData[0].venue_locations?.city}
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
                              {venueData[0].venue_locations?.city}
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
          {/* {venueData[0].isSeat && */}
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
                    <IconButton onClick={() => openPage(`/venues/single-venue/add-zone/${id}?isSeatLayout=${venueData[0].isSeat}`)}>
                      <AddCircleIcon color='info' sx={{ fontSize: 48 }} />
                    </IconButton>
                    <MDTypography>Add New Zone</MDTypography>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </>
          {/* } */}
        </MDBox>
      }
      <Footer />
    </DashboardLayout>
  )
}