import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Card } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from 'components/MDAvatar';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
import backgroundImage from "assets/images/user2.jpg";

export default function SingleUser() {
    const [userData, setUserData] = useState([]);
    const [theatreData, setTheatreData] = useState([]);
    const { id } = useParams();

    const fetchSingleUserData = async () => {
        try {
            const { data, error } = await supabase.from('theatreOwners').select().eq('id', id);
            if (data) {
                setUserData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTheatreData = async () => {
        try {
            const { data, error } = await supabase.from('theatres').select('*');
            if (error) throw error;
            if (data) {
                setTheatreData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSingleUserData();
        fetchTheatreData();
    }, [id])

    const getTheatreName = (theatreId) => {
        const theatre = theatreData && theatreData.find(theatre => theatre.id === theatreId);
        return theatre ? theatre.name : "Unknown";
    };

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
                {userData.length > 0 &&
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
                                            {userData[0].name}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            {userData[0].userRole}
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
                                                User Details
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                                Name
                                            </MDTypography>
                                            <MDBox display="flex" alignItems="center" mb={0.5}>
                                                <MDBox width="80%" ml={0.5}>
                                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                                        {userData[0].name}
                                                    </MDTypography>
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                                Email
                                            </MDTypography>
                                            <MDBox display="flex" alignItems="center" mb={0.5}>
                                                <MDBox width="80%" ml={0.5}>
                                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                                        {userData[0].email}
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
                                                        {userData[0].mobile}
                                                    </MDTypography>
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                                User Role
                                            </MDTypography>
                                            <MDBox display="flex" alignItems="center" mb={0.5}>
                                                <MDBox width="80%" ml={0.5}>
                                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                                        {userData[0].userRole}
                                                    </MDTypography>
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                                Theatre
                                            </MDTypography>
                                            <MDBox display="flex" alignItems="center" mb={0.5}>
                                                <MDBox width="80%" ml={0.5}>
                                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                                        {getTheatreName(userData[0].theatreId)}
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
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}
