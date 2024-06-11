import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Card, CircularProgress, Grid } from '@mui/material'
import DataTable from "examples/Tables/DataTable";
import ticketsTableData from "layouts/tables/data/ticketsTableData";
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DataNotFound from 'components/NoData/dataNotFound'
import { useContext, useEffect, useState } from 'react';
import noTicketImage from "assets/images/illustrations/noTicket.png";
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import { supabase } from './supabaseClient';
import { UserDataContext } from 'context';


export default function ViewTickets() {
  const { columns: pColumns, rows: pRows } = ticketsTableData();
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_ticket_counts', { theatre_id: userTheatreId });
        if (error) throw error;
        const labels = data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', });
        }); const count = data.map(item => item.ticket_count);
        setChartData({ labels, datasets: { label: "Count", data: count } });

      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userTheatreId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {isLoading ?
          <MDBox p={3} display="flex" justifyContent="center">
            <CircularProgress color="info" />
          </MDBox>
          :
          <ReportsLineChart
            color="info"
            title="Tickets Count"
            description="Number of booked tickets of the last week"
            date="Weekly"
            chart={chartData}
          />
        }
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
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}