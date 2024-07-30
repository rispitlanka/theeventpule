
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import venuesTableData from "layouts/tables/data/venuesTableData";
import DataNotFound from 'components/NoData/dataNotFound';
import { CircularProgress } from '@mui/material';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { supabase } from './supabaseClient';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import MDInput from 'components/MDInput';
import { UserDataContext } from 'context';

export default function Venues() {
    const userDetails = useContext(UserDataContext);
    const userRole = userDetails && userDetails[0].userRole;
    const { columns: pColumns, rows: pRows } = venuesTableData();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredRows = useMemo(() => {
        return pRows.filter(row => {
            const venueName = row.name?.props?.name?.toLowerCase();
            return venueName?.includes(searchTerm.toLowerCase());
        });
    }, [searchTerm, pRows]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={4} mb={4}>
            </MDBox>
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
                                    Venues
                                </MDTypography>
                                    <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                                        <MDButton onClick={() => openPage("/venues/add-venue")}><AddIcon color="info" /></MDButton>
                                    </MDBox>
                            </MDBox>
                            <MDBox pt={3} pl={3} display="flex" justifyContent="left">
                                <MDInput
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </MDBox>
                            {isLoading ? (
                                <MDBox p={3} display="flex" justifyContent="center">
                                    <CircularProgress color="info" />
                                </MDBox>
                            ) : filteredRows && filteredRows.length > 0 ? (
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns: pColumns, rows: filteredRows }}
                                        isSorted={false}
                                        entriesPerPage={true}
                                        showTotalEntries={true}
                                        noEndBorder
                                    />
                                </MDBox>
                            )
                                : (
                                    <DataNotFound message={'No Venues To Show !'} image={noDataImage} />
                                )}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}