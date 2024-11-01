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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import MDAvatar from "components/MDAvatar";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { Button, CircularProgress, Menu, MenuItem } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import PasswordResetModel from "pages/Models/passwordResetModel";
import { UserDataContext } from "context";
import { supabase } from "pages/supabaseClient";

function Overview() {
  const userDetails = useContext(UserDataContext);
  const userOrganizationId = userDetails && (userDetails[0].eventOrganizationId ?? userDetails[0].theatreId);
  const name = userDetails && userDetails[0].name;
  const userRole = userDetails && userDetails[0].userRole;
  const email = userDetails && userDetails[0].email;
  const mobile = userDetails && userDetails[0].mobile;
  const [openResetModel, setOpenResetModel] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [organizationData, setOrganizationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogBoxOpen = () => {
    setOpenResetModel(true);
  }
  const handleDialogBoxClose = () => {
    setOpenResetModel(false);
    setAnchorEl(null);
  };

  const fetchOrganizationData = async () => {
    try {
      const { data, error } = await supabase
        .from(userDetails[0].eventOrganizationId ? 'eventOrganizations' : 'theatres')
        .select('name')
        .eq('id', userOrganizationId);

      if (error) throw error;

      if (data) {
        setOrganizationData(data[0]);
        console.log('Organization data fetched successfully');
      }
    } catch (error) {
      console.error('Error fetching organization data:', error.message);
    }
  };

  const fetchEventsData = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(
          'id, name, description, eventImage, event_categories(name), eventOrganizations(name)'
        )
        .eq('eventOrganizationId', userOrganizationId)
        .order('id', { ascending: false });

      if (error) throw error;

      if (data) {
        setEventsData(data);
        console.log('Events fetched successfully');
      }
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchOrganizationData(), fetchEventsData()]);
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userOrganizationId]);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isLoading ? (
        <MDBox p={3} display="flex" justifyContent="center">
          <CircularProgress color="info" />
        </MDBox>
      )
        :
        <>
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
                  {/* <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" /> */}
                </Grid>
                <Grid item>
                  <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                      {name}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      {userRole.replace(/([A-Z])/g, ' $1').trim().replace(/^./, match => match.toUpperCase())}
                      {organizationData && ` - ${organizationData.name}`}
                      {" | "}
                      {email}
                      {" | "}
                      {mobile}
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    startIcon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        settings
                      </Icon>
                    }
                  >
                    Settings
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
                    <MenuItem onClick={handleDialogBoxOpen}>Change Password</MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Card>

            {/* profile cards */}
            {/* <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="profile information"
                description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                info={{
                  fullName: "Alec M. Thompson",
                  mobile: "(44) 123 1234 123",
                  email: "alecthompson@mail.com",
                  location: "USA",
                }}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid>
          </Grid>
        </MDBox> */}

            {/* events */}
            {eventsData && eventsData.length > 0 && (
              <>
                <MDBox pt={4} px={2} lineHeight={1.25}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Events
                  </MDTypography>
                  <MDBox mb={1}>
                    <MDTypography variant="button" color="text">
                      Events organized by you
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox p={2} >
                  <Grid container spacing={6}>
                    {eventsData.map((event, index) => (
                      <Grid item key={index} xs={12} md={6} xl={3}>
                        <DefaultProjectCard
                          image={event.eventImage}
                          label={event.event_categories?.name}
                          title={event.name}
                          description={event.description.length > 50 ? event.description.replace(/<[^>]*>/g, '').substring(0, 50) + '...' : event.description.replace(/<[^>]*>/g, '')}
                          action={{
                            type: "internal",
                            route: `/events/single-event/${event.id}`,
                            color: "info",
                            label: "view event",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
              </>
            )
            }

          </MDBox>
        </>
      }

      <PasswordResetModel
        open={openResetModel}
        onClose={handleDialogBoxClose}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;