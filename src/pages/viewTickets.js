import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { UserDataContext } from 'context'
import { Box, Card, Grid, Typography } from '@mui/material'
import DataTable from "examples/Tables/DataTable";
import ticketsTableData from "layouts/tables/data/ticketsTableData";
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'


export default function ViewTickets() {
  const { columns: pColumns, rows: pRows } = ticketsTableData();
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    const getAlltickets = async () => {
      try {
        const { data: ticketsResponse, error: ticketsResponseError } = await supabase.from('tickets').select('*').eq('theatreId', userTheatreId);
        if (ticketsResponseError) {
          console.log('ticketsResponseError', ticketsResponseError)
        }
        if (ticketsResponse) {
          console.log('ticketsResponse', ticketsResponse)
          setAllTickets(ticketsResponse);
        }
      }
      catch {

      }
    };
    getAlltickets();
  }, [])

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
                  Tickets
                </MDTypography>
                {/* <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                  <MDButton ><AddIcon color="info" /></MDButton>
                </MDBox> */}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}
