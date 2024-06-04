
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import eventsTableData from "layouts/tables/data/eventsTableData";
import DataNotFound from 'components/NoData/dataNotFound';
import { CircularProgress } from '@mui/material';
import noDataImage from "assets/images/illustrations/noData3.svg";


export default function Events() {

  const { columns: pColumns, rows: pRows } = eventsTableData();
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };

  const [isLoading, setIsLoading] = useState(true);

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
                  Events
                </MDTypography>
                <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                  <MDButton onClick={() => openPage("/events/add-event")}><AddIcon color="info" /></MDButton>
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
                <DataNotFound message={'No Events Available !'} image={noDataImage} />
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}
