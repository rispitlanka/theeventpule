/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [theatreCount, setTheatreCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [moviesCount, setMoviesCount] = useState(0);

  useEffect(() => {
    fetchTheatreCount();
    fetchTicketsCount();
    fetchMoviesCount();
  }, [])

  const fetchTheatreCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_all_theatres_count');
      if (data) {
        setTheatreCount(data[0].theatres_count);
      }
      if (error) throw error;
    } catch (error) {

    }
  }

  const fetchTicketsCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_ticket_counts_bydate');
      if (data) {
        setTicketsCount(data[0].ticket_count);
        setRevenue(data[0].revenue);
      }
      if (error) throw error;
    } catch (error) {

    }
  }

  const fetchMoviesCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_movies_count');
      if (data) {
        setMoviesCount(data[0].movies_count);
      }
      if (error) throw error;
    } catch (error) {

    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="movie"
                title="Today's Movies"
                count={moviesCount}
              // percentage={{
              //   color: "success",
              //   amount: "+55%",
              //   label: "than lask week",
              // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="theaters"
                title="Total Theatres"
                count={theatreCount}
              // percentage={{
              //   color: "success",
              //   amount: "+3%",
              //   label: "than last month",
              // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="receipt-long"
                title="Today's Bookings"
                count={ticketsCount}
              // percentage={{
              //   color: "success",
              //   amount: "+1%",
              //   label: "than yesterday",
              // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="money"
                title="Today's Revenue"
                count={revenue}
              // percentage={{
              //   color: "success",
              //   amount: "",
              //   label: "Just updated",
              // }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
