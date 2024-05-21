import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Card, IconButton } from '@mui/material';

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
import backgroundImage from "assets/images/bg-profile.jpeg";
import { UserDataContext } from 'context';

export default function SingleTheatre() {
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const [theatreData, setTheatreData] = useState([]);
  const [screensData, setScreensData] = useState([]);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };
  const {id} = useParams(); 
  const theatreID = userTheatreId ? userTheatreId : id;

  const fetchSingleTheatreData = async () => {
    try {
      const { data, error } = await supabase.from('theatres').select().eq('id', theatreID );
      if (error) throw error;
      if (data) {
        setTheatreData(data);
        console.log(data);
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
    fetchScreensData();
  }, [theatreID])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
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
              )}, url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "50%",
            overflow: "hidden",
          }}
        />
        {theatreData.length > 0 &&
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
                  <MDAvatar src={null} alt="profile-image" size="xl" shadow="sm" />
                </Grid>
                <Grid item>
                  <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                      {theatreData[0].name}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      {theatreData[0].address}
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
                        Coordinator Information
                      </MDTypography>
                    </MDBox>
                    <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                      <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Name
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" mb={0.5}>
                        <MDBox width="80%" ml={0.5}>
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            {theatreData[0].coordinatorName}
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
                            {theatreData[0].coordinatorMobile}
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
                            {theatreData[0].coordinatorMail}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </>
        }

        {/* screens */}

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
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}
