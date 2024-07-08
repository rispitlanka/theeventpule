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
  const [bookingChartData, setBookingChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);

  useEffect(() => {
    fetchTheatreCount();
    fetchTicketsCount();
    fetchMoviesCount();
    fetchWeeklyBookings();
    fetchWeeklyRevenue();
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
      console.log(error)
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
      console.log(error)
    }
  }

  const fetchMoviesCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_movies_count');
      if (data) {
        setMoviesCount(data[0].movies_count);
      }
      if (error) throw error;
    } catch (error) {
      console.log(error)
    }
  }

  const fetchWeeklyBookings = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_weekly_bookings');
      if (error) throw error;
      const labels = data.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', });
      }); const count = data.map(item => item.ticket_count);
      setBookingChartData({ labels, datasets: { label: "Count", data: count } });

    } catch (error) {
      console.log(error)
    }
  }

  const fetchWeeklyRevenue = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_weekly_revenue');
      if (error) throw error;
      const labels = data.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', });
      }); const count = data.map(item => item.revenue);
      setRevenueChartData({ labels, datasets: { label: "Count", data: count } });

    } catch (error) {
      console.log(error)
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
                title="Active Movies"
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
                  title="website visits"
                  description="Number of visitors last Week"
                  date="weekly"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="weekly bookings"
                  description="Booked tickets of the last week"
                  date="weekly"
                  chart={bookingChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="weekly revenue"
                  description="Revenue of the last week"
                  date="weekly"
                  chart={revenueChartData}
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
