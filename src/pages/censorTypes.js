import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui material components
import { Card, CircularProgress, Grid } from '@mui/material';
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

// Data
import censorTableData from "layouts/tables/data/censorTableData";
import DataNotFound from 'components/NoData/dataNotFound';
import noData from "assets/images/illustrations/noData3.svg";

export default function CensorTypes() {
    const { columns: pColumns, rows: pRows } = censorTableData();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

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
                                    Censor Types
                                </MDTypography>
                                <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                                    <MDButton onClick={() => openPage("/censor-types/add-censor-types")}><AddBoxIcon color='info' /></MDButton>
                                </MDBox>
                            </MDBox>
                            {isLoading ? (
                                <MDBox p={3} display="flex" justifyContent="center">
                                    <CircularProgress color="info" />
                                </MDBox>
                            ) : pRows && pRows.length > 0 ? (
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns: pColumns, rows: pRows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            ) : (
                                <DataNotFound message={'No Data Availabale !'} image={noData} />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}