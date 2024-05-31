import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Box, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import MDTypography from 'components/MDTypography';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from 'pages/supabaseClient';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import { UserDataContext } from 'context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactToPrint from 'react-to-print';
import QRCode from 'qrcode';

export default function GetTickets() {
  const componentRef = useRef();
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const navigate = useNavigate();
  const location = useLocation();
  const { bookedSeats, showDate, movieId, movieTitle, time, screenName } = location.state || { bookedSeats: [] };
  const [theatreName, setTheatreName] = useState([]);
  const [bookedTicketsData, setBookedTicketsData] = useState([]);
  const [qrCodes, setQrCodes] = useState({});
  const [open, setOpen] = useState(false);

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
        handleClickOpen();
        console.log('tickets booked', data);
        toast.info('Tickets have been successfully booked!');
        setBookedTicketsData(data);
        data.forEach(ticket => generateQRCode(ticket.id));
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

  const generateQRCode = async (id) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(String(id));
      setQrCodes(prevState => ({ ...prevState, [id]: qrCodeDataUrl }));
    } catch (err) {
      console.log('Error generating QR code:', err);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
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
          <div ref={componentRef}>
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
                    {bookedTicketsData.length > 0 && (
                      <MDTypography variant='body2' sx={{ position: 'absolute', top: { xs: 60, md: 75 }, right: { xs: 15, md: 20 }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                        Ticket ID : {bookedTicketsData[index]?.id}
                      </MDTypography>
                    )}
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
                      <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-end' } }}>
                        {qrCodes[bookedTicketsData[index]?.id] && (
                          <img src={qrCodes[bookedTicketsData[index]?.id]} alt="qr" style={{ height: '200px', width: '200px', border: '1px solid', maxWidth: '100%' }} />
                        )}
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>
        <Box sx={{ mt: 'auto', textAlign: 'right', p: 2 }}>
          <MDTypography sx={{ mb: 2 }}>Total Price: LKR {calculateTotalPrice()}</MDTypography>
          <MDButton color='info' onClick={handleBookTickets} disabled={bookedTicketsData.length > 0} sx={{ mr: 2 }}>Book Tickets</MDButton>
        </Box>
      </MDBox>
      <Footer />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Tickets Have Been SuccessFully Booked !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to print tickets?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ReactToPrint trigger={() => <MDButton disabled={bookedTicketsData.length <= 0}>Yes</MDButton>} content={() => componentRef.current} />
          <MDButton onClick={handleClose}>No</MDButton>
        </DialogActions>
      </Dialog>

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