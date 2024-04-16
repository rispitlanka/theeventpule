import React from 'react';
import { useNavigate } from 'react-router-dom';

// @mui material components
import { Card, Grid } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

//supabase client
import { supabase } from './supabaseClient';

// Data
import facilitiesTableData from "layouts/tables/data/facilitiesTableData";

export default function Movies() {
    const { columns, rows } = facilitiesTableData();
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
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
                                    Facilities
                                </MDTypography>
                                <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                                    <MDButton onClick={() => openPage("/movies/add-movies")}><AddBoxIcon color='info' /></MDButton>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}
