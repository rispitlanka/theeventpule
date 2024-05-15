import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import { Box, Card, Grid, Typography } from '@mui/material';
import MDTypography from 'components/MDTypography';
import { useLocation } from 'react-router-dom';

export default function GetTickets() {
  const location = useLocation();
  const { bookedSeats, date, title, time, screenName } = location.state || { bookedSeats: [] };
  console.log('Booked Tickets in GetTickets:', bookedSeats,date,title,time,screenName);
  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <Box sx={{ flexGrow: 1, mt: 5, mb: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {bookedSeats.map((seat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{
                position: 'relative',
                p: 2,
                textAlign: 'center',
              }}>
                <MDTypography variant='h6'>{title}</MDTypography>
                <MDTypography>{screenName}</MDTypography>
                <MDTypography >{date}</MDTypography>
                <MDTypography >{time}</MDTypography>                
                <Typography variant="h1" gutterBottom>{seat.seatName}</Typography>
                <MDTypography >Theatre Name</MDTypography>
                <MDTypography >Price</MDTypography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer/>
    </DashboardLayout>
  )
}
