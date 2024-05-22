import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useContext, useEffect, useState } from 'react'
import { Box, Card, Grid } from '@mui/material';
import MDTypography from 'components/MDTypography';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from 'pages/supabaseClient';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import { UserDataContext } from 'context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GetTickets() {
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const navigate = useNavigate();
  const location = useLocation();
  const { bookedSeats, showDate, movieId, movieTitle, time, screenName } = location.state || { bookedSeats: [] };
  const [theatreName, setTheatreName] = useState([]);

  useEffect(() => {
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
        showId: seat.showId,
        movieId: movieId,
        theatreId: userTheatreId,
        bookedBy: '',
        totalPrice: calculateTotalPrice(),
      }));
      console.log(dataToInsert)
      const { data, error } = await supabase.from('tickets').insert(dataToInsert).select('*');
      if (data) {
        console.log('tickets booked', data);
        toast.info('Tickets have been successfully booked!');
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
      if (error) {
        console.log(error);
      }
    }
    catch (error) {
      console.log('Error in booking tickets', error)
    }
  }

  const currentDate = () => {
    return (new Date()).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
  }

  const formattedTime = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    const showDate = new Date(0, 0, 0, hours, minutes, seconds);
    const options = { hour: '2-digit', minute: '2-digit' };
    return showDate.toLocaleTimeString('en-US', options);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{
        position: "relative",
        mt: 2,
        p: 2,
      }}>
        <Box sx={{ flexGrow: 1, mt: 5, mb: 2 }}>
          <Grid container spacing={3} justifyContent="center">
            {bookedSeats.map((seat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{
                  position: 'relative',
                  p: 2,
                  border: '2px solid',
                  borderRadius: 0,
                  boxSizing: 'border-box',
                  width: '100%',
                }}>
                  <Box sx={{ backgroundColor: '#e0e0e0', textAlign: 'center', mt: 1, mb: 3 }}>
                    <MDTypography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>{theatreName}</MDTypography>
                  </Box>
                  <MDTypography variant='body2' sx={{ position: 'absolute', top: { xs: 60, md: 75 }, right: { xs: 1, md: 20 }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                    Transaction Number : 0001
                  </MDTypography>
                  <Box display="flex" alignItems='center' mt={3}>
                    <MDTypography sx={{ mr: 1 }}>Movie:</MDTypography>
                    <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{movieTitle}</MDTypography>
                  </Box>
                  <Box display="flex" alignItems='center' mt={1}>
                    <MDTypography sx={{ mr: 1 }}>Time:</MDTypography>
                    <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{showDate} at {formattedTime(time)}</MDTypography>
                  </Box>
                  <Box display="flex" alignItems='center' mt={1}>
                    <MDTypography sx={{ mr: 1 }}>Screen:</MDTypography>
                    <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{screenName}-{seat.zoneName}</MDTypography>
                  </Box>
                  <Box display="flex" alignItems='center' mt={1}>
                    <MDTypography sx={{ mr: 1 }}>Price:</MDTypography>
                    <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{seat.price}</MDTypography>
                  </Box>
                  <Box display="flex" alignItems='center' mt={1}>
                    <MDTypography sx={{ mr: 1 }}>Seat:</MDTypography>
                    <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{seat.seatName}</MDTypography>
                  </Box>
                  <Grid container mt={3}>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                      <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>{currentDate()}</MDTypography>
                      <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>theEventPulse</MDTypography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <img src="https://skrymerdev.files.wordpress.com/2012/09/qrcode.png" alt="qr" style={{ height: '200px', width: '200px', border: '1px solid', maxWidth: '100%' }} />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ mt: 'auto', textAlign: 'right', p: 2 }}>
          <MDTypography sx={{ mb: 2 }}>Total Price: LKR {calculateTotalPrice()}</MDTypography>
          <MDButton color='info' onClick={handleBookTickets}>Book Tickets</MDButton>
        </Box>
      </MDBox>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </DashboardLayout>
  )
}