import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useContext, useEffect, useState } from 'react'
import { Box, Card, Grid, Typography } from '@mui/material';
import MDTypography from 'components/MDTypography';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from 'pages/supabaseClient';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import { UserDataContext } from 'context';

export default function GetTickets() {
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const navigate = useNavigate();
  const location = useLocation();
  const { bookedSeats, date, title, time, screenName } = location.state || { bookedSeats: [] };
  const [showsSchedule, setShowsSchedule] = useState([]);
  const [theatreName, setTheatreName] = useState([]);

  useEffect(() => {
    fetchMovieFromShowSchedule();
    fetchTheatre();
  }, [bookedSeats])

  const fetchTheatre = async () => {
    try {
      const { data, error } = await supabase.from('theatres').select('name').eq('id', userTheatreId);
      if (error) throw error;
      if (data) {
        setTheatreName(data[0].name)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMovieFromShowSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('showsSchedule')
        .select('*, shows(*)')
        .eq('id', bookedSeats[0].showScheduleId);

      if (data) {
        setShowsSchedule(data);
        console.log('show schedule', data);
      }

      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log('Error in fetching movie', error);
    }
  }

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    bookedSeats.forEach(seat => {
      const price = parseInt(seat.price);
      totalPrice += price;
    });
    return totalPrice;
  }

  const handleBookTickets = async () => {
    try {
      const dataToInsert = bookedSeats && bookedSeats.length > 0 && bookedSeats.map(seat => ({
        seatId: seat.seatId,
        showScheduleId: seat.showScheduleId,
        movieId: showsSchedule && showsSchedule.length > 0 && showsSchedule[0].shows.movieId,
        theatreId: userTheatreId,
        bookedBy: '',
        totalPrice: calculateTotalPrice(),
      }));
      console.log(dataToInsert)
      const { data, error } = await supabase.from('tickets').insert(dataToInsert).select('*');
      if (data) {
        console.log('tickets booked', data);
        navigate(-1);
      }
      if (error) {
        console.log(error);
      }
    }
    catch (error) {
      console.log('Error in booking tickets', error)
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{
        position: "relative",
        mt: 2,
        p: 2,
      }}>
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
                  <MDTypography>{screenName}-{seat.zoneName}</MDTypography>
                  <MDTypography >{date}</MDTypography>
                  <MDTypography >{time}</MDTypography>
                  <Typography variant="h1" gutterBottom>{seat.seatName}</Typography>
                  <MDTypography >{theatreName}</MDTypography>
                  <MDTypography >{seat.price}</MDTypography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <MDTypography sx={{ mb: 2 }}>Total Price: LKR {calculateTotalPrice()}</MDTypography>
        <MDButton color='info' onClick={handleBookTickets}>Book Tickets</MDButton>
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}
