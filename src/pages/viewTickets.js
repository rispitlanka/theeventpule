import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Card, CircularProgress, Grid } from '@mui/material'
import DataTable from "examples/Tables/DataTable";
import ticketsTableData from "layouts/tables/data/ticketsTableData";
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DataNotFound from 'components/NoData/dataNotFound'
import { useEffect, useState } from 'react';
import noTicketImage from "assets/images/illustrations/noTicket.png";
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart';
import { supabase } from './supabaseClient';


export default function ViewTickets() {

  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = new Date().toISOString();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const startDateString = startDate.toISOString();

        const { data, error } = await supabase
          .from("tickets")
          .select('*')
          .gte("created_at", startDateString)
          .lte("created_at", endDate);

        if (error) throw error;

        const ticketCounts = {};
        data.forEach(ticket => {
          const date = new Date(ticket.created_at).toISOString().split('T')[0];
          if (ticketCounts[date]) {
            ticketCounts[date]++;
          } else {
            ticketCounts[date] = 1;
          }
        });

        const labels = Object.keys(ticketCounts);
        const ticketData = Object.values(ticketCounts);
        setChartData({ labels, datasets: { label: "Count", data: ticketData } });

      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <MDBox pt={6} pb={3}>
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
                  Tickets
                </MDTypography>
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
                <DataNotFound message={'No Tickets Reserved Yet !'} image={noTicketImage} />
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox> */}

      <MDBox pt={6} pb={3}>
        {isLoading ?
          <MDBox p={3} display="flex" justifyContent="center">
            <CircularProgress color="info" />
          </MDBox>
          :
          <ReportsBarChart
            color="info"
            title="Tickets Count"
            description="Number of booked tickets of the last week"
            date="Weekly"
            chart={chartData}
          />
        }
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}