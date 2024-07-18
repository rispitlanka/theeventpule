
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AddIcon from '@mui/icons-material/Add';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Data
import superAdminDataTable from "layouts/tables/data/superAdminDataTable";
import DataNotFound from 'components/NoData/dataNotFound';
import { CircularProgress } from '@mui/material';
import noUserImage from "assets/images/illustrations/noUsers.png";

export default function SuperAdmin() {
    const { columns: pColumns, rows: pRows } = superAdminDataTable();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
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
                                    Admin
                                </MDTypography>
                                {/* <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                  <MDButton onClick={() => openPage("/allUsers/add-theatreOwner")}><AddIcon color="info" /></MDButton>
                </MDBox> */}
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
                                <DataNotFound message={'No Admins Availabale !'} image={noUserImage} />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}
