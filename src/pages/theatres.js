
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
import theatreTableData from "layouts/tables/data/theatreTableData";
import DataNotFound from 'components/NoData/dataNotFound';
import { CircularProgress, List, ListItem, ListItemText, TextField } from '@mui/material';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { supabase } from './supabaseClient';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';

export default function Theatres() {
  const { columns: pColumns, rows: pRows } = theatreTableData();
  const [isLoading, setIsLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theatres, setTheatres] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [totalTheatresCount, setTotalTheatresCount] = useState(0);
  const [activeTheatresCount, setActiveTheatresCount] = useState(0);
  const [totalShows, setTotalShows] = useState(0);

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

  useEffect(() => {
    const fetchTheatres = async () => {
      if (name.trim() === '') {
        setTheatres([]);
        setError('');
        setSearched(false);
        return;
      }
      setLoading(true);
      setError('');
      setSearched(true);
      try {
        const { data, error } = await supabase
          .from('theatres')
          .select('*')
          .ilike('name', `%${name}%`);

        if (error) throw error;
        setTheatres(data);
      } catch (error) {
        setError('Error fetching theatres');
      } finally {
        setLoading(false);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchTheatres();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [name]);

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mb={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="theaters"
                title="Total Active Theatres"
                count={activeTheatresCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
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
      <MDBox sx={{ mt: 2, mb: 2 }}>
        <TextField fullWidth id="standard-basic" label="Search theatres" variant="standard" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 1 }} />
        {loading && <MDTypography>Searching...<CircularProgress color="info" /></MDTypography>}
        {error && <MDTypography>{error}</MDTypography>}
        {!loading && searched && theatres.length === 0 && (
          <MDTypography variant="body2">No theatres found</MDTypography>
        )}
        <List>
          {theatres.map((theatre) => (
            <ListItem key={theatre.id}>
              <ListItemText primary={theatre.name} />
            </ListItem>
          ))}
        </List>
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