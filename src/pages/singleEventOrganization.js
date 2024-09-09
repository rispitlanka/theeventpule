import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Card, CircularProgress } from '@mui/material';

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
  const [isLoading, setIsLoading] = useState(true);

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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSingleOrganizationData();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [userOrganizationID])

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
                    <MDAvatar src={organizationData[0].organizationImage} alt="profile-image" size="lg" shadow="sm" />
                  </Grid>
                  <Grid item>
                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                      <MDTypography variant="h5" fontWeight="medium">
                        {organizationData[0].name}
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
                              {organizationData[0].ownerMobile}
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
        </MDBox>
      }
      <Footer />
    </DashboardLayout>
  )
}