
import React, { useEffect, useMemo, useState } from 'react';
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
import theatreTableData from "layouts/tables/data/theatreTableData";
import DataNotFound from 'components/NoData/dataNotFound';
import { CircularProgress } from '@mui/material';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { supabase } from './supabaseClient';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import MDInput from 'components/MDInput';

export default function Theatres() {
  const { columns: pColumns, rows: pRows } = theatreTableData();
  const [isLoading, setIsLoading] = useState(true);
  const [totalTheatresCount, setTotalTheatresCount] = useState(0);
  const [activeTheatresCount, setActiveTheatresCount] = useState(0);
  const [totalShows, setTotalShows] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };

  useEffect(() => {
    fetchTotalTheatresCount();
    fetchTotalShowsCount();
    fetchActiveTheatresCount();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const fetchTotalTheatresCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_all_theatres_count');
      if (data) {
        setTotalTheatresCount(data[0].theatres_count);
      }
      if (error) throw error;
    } catch (error) {
      console.log(error)
    }
  }

  const fetchActiveTheatresCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_theatres_count');
      if (data) {
        setActiveTheatresCount(data[0].theatres_count);
      }
      if (error) throw error;
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTotalShowsCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_all_shows_count');
      if (data) {
        setTotalShows(data[0].shows_count);
      }
      if (error) throw error;
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = useMemo(() => {
    return pRows.filter(row => {
      const theatreName = row.name?.props?.name?.toLowerCase();
      return theatreName?.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, pRows]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mb={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="theaters"
                title="Total Active Theatres"
                count={activeTheatresCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="theaters"
                title="Total Theatres"
                count={totalTheatresCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="slideshow"
                title="Total Shows"
                count={totalShows}
              />
            </MDBox>
          </Grid>
        </Grid>
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
                  Theatres
                </MDTypography>
                <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                  <MDButton onClick={() => openPage("/theatres/add-theatre")}><AddIcon color="info" /></MDButton>
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
                  <DataNotFound message={'No Theatres To Show !'} image={noDataImage} />
                )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}