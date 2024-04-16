import { Card, Grid, IconButton, Tooltip, } from '@mui/material'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from './supabaseClient'
import EditIcon from '@mui/icons-material/Edit';
import Footer from 'examples/Footer'

export default function SingleScreen() {
    const [screenData, setScreenData] = useState([]);
    const { screenId } = useParams();
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchSingleScreenData = async () => {
        try {
            const { data, error } = await supabase.from('screens').select().eq('id', screenId);
            if (error) throw error;
            if (data) {
                setScreenData(data);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSingleScreenData();
        // eslint-disable-next-line
    }, [screenId])
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card
                sx={{
                    position: "relative",
                    mt: 5,
                    mx: 3,
                    py: 2,
                    px: 2,
                    mb: 2,
                }}
            >
                {screenData.length > 0 &&
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <MDBox p={2}>
                                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                                    Screen Informations
                                </MDTypography>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => openPage(`/theatres/single-theatre/edit-screen/${screenId}`)} style={{ position: 'absolute', top: 0, right: 0 }}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </MDBox>
                            <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Name
                                </MDTypography>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                    <MDBox width="80%" ml={0.5}>
                                        <MDTypography variant="button" fontWeight="regular" color="text">
                                            {screenData[0].name}
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Width
                                </MDTypography>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                    <MDBox width="80%" ml={0.5}>
                                        <MDTypography variant="button" fontWeight="regular" color="text">
                                            {screenData[0].width}
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Height
                                </MDTypography>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                    <MDBox width="80%" ml={0.5}>
                                        <MDTypography variant="button" fontWeight="regular" color="text">
                                            {screenData[0].height}
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Sound Type
                                </MDTypography>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                    <MDBox width="80%" ml={0.5}>
                                        <MDTypography variant="button" fontWeight="regular" color="text">
                                            {screenData[0].soundType}
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Projection Type
                                </MDTypography>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                    <MDBox width="80%" ml={0.5}>
                                        <MDTypography variant="button" fontWeight="regular" color="text">
                                            {screenData[0].projectionType}
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Facilities
                                </MDTypography>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                    <MDBox width="80%" ml={0.5}>
                                        <MDTypography variant="button" fontWeight="regular" color="text">
                                            {screenData[0].facilities}
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                }
            </Card>
            <Footer />
        </DashboardLayout>
    )
}
