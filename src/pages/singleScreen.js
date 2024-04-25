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
import MDButton from 'components/MDButton'
import DataTable from "examples/Tables/DataTable";
import showTimeTableData from "layouts/tables/data/showTimeTableData";

export default function SingleScreen() {
    const { columns: pColumns, rows: pRows } = showTimeTableData();
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
            const { data, error } = await supabase.from('zones').select('*').eq('screenId', screenId);
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
    }, [screenId])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
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
                            Screen Informations
                        </MDTypography>
                        <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                            <MDButton onClick={() => openPage(`/theatres/single-theatre/edit-screen/${screenId}`)}><EditIcon color="info" /></MDButton>
                        </MDBox>
                    </MDBox>

                    {screenData.length > 0 &&
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12}>
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

                    <MDBox mt={5}>
                        <DataTable
                            table={{ columns: pColumns, rows: pRows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                        />
                    </MDBox>
                    <MDBox p={3}><MDButton color='info' onClick={() => openPage(`/theatres/single-theatre/single-screen/add-showTime/${screenId}`)}>Add Show Time</MDButton></MDBox>
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
                                    <MDTypography>Screen</MDTypography>
                                </Card>
                            </Grid>
                            {zonesData.map((zone, index) => (
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
                                        onClick={() => openPage(`/theatres/single-theatre/single-screen/single-zone/${zone.id}`)} style={{ cursor: 'pointer' }}
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
                                    <IconButton onClick={() => openPage(`/theatres/single-theatre/single-screen/add-zone/${screenId}`)}>
                                        <AddCircleIcon color='info' sx={{ fontSize: 48 }} />
                                    </IconButton>
                                    <MDTypography>Add New Zone</MDTypography>
                                </Card>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Card>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}
