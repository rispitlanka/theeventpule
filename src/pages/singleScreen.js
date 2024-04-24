import { Card, Grid, IconButton, Tooltip, } from '@mui/material'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from './supabaseClient'
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Footer from 'examples/Footer'

export default function SingleScreen() {
    const [screenData, setScreenData] = useState([]);
    const [zonesData, setZonesData] = useState([]);
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

    const fetchZonesData = async () => {
        try {
            const { data, error } = await supabase.from('zones').select().eq('screenId', screenId);
            if (error) throw error;
            if (data) {
                setZonesData(data);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSingleScreenData();
        fetchZonesData();
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
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={3}>
                            <MDBox px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Name
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text" ml={1}>
                                    {screenData[0].name}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={3}>
                            <MDBox px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Width
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text" ml={1}>
                                    {screenData[0].width}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={3}>
                            <MDBox px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Height
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text" ml={1}>
                                    {screenData[0].height}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={3}>
                            <MDBox px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Sound Type
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text" ml={1}>
                                    {screenData[0].soundType}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={3}>
                            <MDBox px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Projection Type
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text" ml={1}>
                                    {screenData[0].projectionType}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={3}>
                            <MDBox px={2} lineHeight={1.25}>
                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                    Facilities
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text" ml={1}>
                                    {screenData[0].facilities}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>

                }

                <MDBox pt={5} px={2} lineHeight={1.25}>
                    <MDTypography variant="h6" fontWeight="medium">
                        Zones
                    </MDTypography>
                    <MDBox mb={1}>
                        <MDTypography variant="button" color="text">
                            Customize your zones
                        </MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox p={2}>
                    <Grid container spacing={6}>
                        {zonesData.map((zone, index) => (
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
                                    onClick={()=>openPage(`/theatres/single-theatre/single-screen/single-zone/${zone.id}`)} style={{ cursor: 'pointer' }}
                                >
                                    <MDTypography>{zone.name}</MDTypography>
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
                                <IconButton onClick={() => openPage(`/theatres/single-theatre/single-screen/add-zone/${screenId}`)}>
                                    <AddCircleIcon color='info' sx={{ fontSize: 48 }} />
                                </IconButton>
                                <MDTypography>Add New Zone</MDTypography>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </Card>
            <Footer />
        </DashboardLayout>
    )
}
