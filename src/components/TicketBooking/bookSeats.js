import { Box, Card, CircularProgress, Divider, Grid, IconButton, Stack } from '@mui/material';
import { supabase } from 'pages/supabaseClient';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { FixedSizeGrid } from 'react-window';
import ChairIcon from "@mui/icons-material/Chair";
import MDButton from 'components/MDButton';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GetTickets from './getTickets';

export default function BookSeats() {
  const [zonesData, setZonesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showsShedule, setShowsShedule] = useState([]);
  const [screens, setScreens] = useState([]);
  const [otherShowTimes, setOtherShowTimes] = useState([]);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showSheduleId, screenId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  const title = queryParams.get('movie');

  useEffect(() => {
    fetchZonesData();
    fetchShowsSheduleAndTime();
    // fetchOtherShows();
    fetchScreens();
  }, []);

  const fetchZonesData = async () => {
    try {
      const { data, error } = await supabase.from('zones').select('*').eq('screenId', screenId);
      if (error) throw error;
      if (data) {
        setZonesData(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShowsSheduleAndTime = async () => {
    try {
      const { data, error } = await supabase
        .from('showsShedule')
        .select('*, showTime(*)')
        .eq('id', showSheduleId);
  
      if (data) {
        setShowsShedule(data);
        console.log('show schedule and time', data);
      }
  
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log('Error in fetching shows schedule and time', error);
    }
  }

  // const fetchOtherShows = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('shows')
  //       .select('*, showTime(*)')
  //       .eq('id', showSheduleId);
  
  //     if (data) {
  //       setShowsShedule(data);
  //       console.log('show schedule and time', data);
  //     }
  
  //     if (error) {
  //       console.log(error);
  //     }
  //   } catch (error) {
  //     console.log('Error in fetching shows schedule and time', error);
  //   }
  // }  

  const fetchScreens = async () => {
    try {
      if(screenId){
        const { data, error } = await supabase.from('screens').select('*').eq('id', screenId);
        if (data) {
            setScreens(data);
            console.log('screens', data);
        }
        if (error) {
            console.log(error);
        }
      }
    }
    catch (error) {
        console.log('Error in fetching screens', error)
    }
}

  const updateBookedSeats = (newBookedSeats) => {
    console.log('Updating booked seats:', newBookedSeats);
    setBookedSeats(newBookedSeats);
  };

  const screenName = screens && screens.length>0 ? screens[0].name: '';
  const time = showsShedule && showsShedule.length>0 ? showsShedule[0].showTime.time :'';

  const handleProceed = () => {
    setClicked(true);
    navigate('/bookings/book-seats/get-tickets', { state: { bookedSeats, date, title, time, screenName } });
  }

  useEffect(() => {
  }, [clicked, bookedSeats]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress color="info" />
        </Box>
      ) : (
        <>
          <Card
            sx={{
              position: "relative",
              mt: 2,
              p:2,
            }}
          >
            <Grid>
              <MDBox>
                <MDTypography>{title}</MDTypography>
                <MDTypography>{screenName}</MDTypography>
              </MDBox>
              <MDBox>
                <Grid display={'flex'} flexDirection={'row'}>
                  <MDTypography sx={{mr:2}}>{date}</MDTypography>
                  <MDTypography>{time}</MDTypography>
                </Grid>
              </MDBox>
            </Grid>
          </Card>
          <Card sx={{
            position: 'relative',
            mt: 5,
            mb: 2,
            pb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {zonesData.map(zone => (
              <ZoneSeatLayout key={zone.id} zone={zone} updateBookedSeats={updateBookedSeats} />
            ))}
            <MDButton color={'info'} sx={{ width: '10%' }} onClick={handleProceed} disabled={bookedSeats.length <= 0}>Proceed</MDButton>
          </Card>
        </>
      )}
      <Footer />
      {clicked && bookedSeats.length > 0 && (
        <GetTickets />)
      }
    </DashboardLayout>
  );
}

function ZoneSeatLayout({ zone, updateBookedSeats }) {
  const [seatsData, setSeatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    fetchSeatsData();
  }, []);

  const fetchSeatsData = async () => {
    try {
      let allSeatsData = [];
      let page = 1;
      const pageSize = 1000; // Supabase limit per request
      let totalPages = Math.ceil(2500 / pageSize); // Total pages needed to fetch 2500 records

      // Fetch data until all records are retrieved or until maximum pages are reached
      while (page <= totalPages) {
        const { data, error } = await supabase.from('seats').select('*').eq('zoneId', zone.id).range((page - 1) * pageSize, page * pageSize - 1);
        if (error) throw error;
        if (data) {
          allSeatsData = allSeatsData.concat(data);
        }
        page++;
      }
      setSeatsData(allSeatsData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const maxRow = Math.max(...seatsData.map(seat => parseInt(seat.row)));
  const maxColumn = Math.max(...seatsData.map(seat => parseInt(seat.column)));

  const calculateTotalHeight = (rowCount, rowHeight) => (rowCount + 1) * rowHeight;
  const [totalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    setTotalHeight(calculateTotalHeight(maxRow, 55));
  }, [maxRow]);

  const getRowHeadAlphabetic = index => {
    return String.fromCharCode(65 + index);
  };

  const handleSeatClick = (rowIndex, columnIndex) => {
    const seatIndex = bookedSeats.findIndex(seat => seat.rowIndex === rowIndex && seat.columnIndex === columnIndex);
    if (seatIndex !== -1) {
      // Seat is already booked, so deselect it
      const updatedSeats = [...bookedSeats];
      updatedSeats.splice(seatIndex, 1);
      setBookedSeats(updatedSeats);
      // Invoke the callback function to update bookedSeats in the parent component
      updateBookedSeats(updatedSeats);
    } else {
      // Seat is not booked, so book it
      const seat = seatsData.find(seat => parseInt(seat.row) === rowIndex && parseInt(seat.column) === columnIndex);
      if (seat) {
        const newBookedSeat = {
          rowIndex,
          columnIndex,
          seatName: seat.seatName,
        };
        const updatedSeats = [...bookedSeats, newBookedSeat];
        setBookedSeats(updatedSeats);
        // Invoke the callback function to update bookedSeats in the parent component
        updateBookedSeats(updatedSeats);
      }
    }
  };

  return (
    <Stack>
      <MDBox>
        <MDTypography variant="h6" gutterBottom sx={{ ml: 2, mt: 2 }}>
          {zone.name}
        </MDTypography>
        <MDBox p={2}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress color="info" />
            </Box>
          ) : (
            <FixedSizeGrid
              columnCount={maxColumn + 1}
              columnWidth={40}
              rowCount={maxRow + 1}
              rowHeight={55}
              width={1600}
              height={totalHeight}
            >
              {({ columnIndex, rowIndex, style }) => {
                const isHeaderRow = rowIndex === 0;
                const isHeaderColumn = columnIndex === 0;

                if (isHeaderRow && isHeaderColumn) {
                  return <div style={style}></div>;
                }

                const columnHead = columnIndex.toString();
                const rowHead = rowIndex.toString();
                const rowHeadAlphabetic = getRowHeadAlphabetic(rowIndex - 1);

                const seat = seatsData.find(
                  seat => seat.row === rowHead && seat.column === columnHead
                );
                const seatName = seat ? seat.seatName : '';
                const isBooked = bookedSeats.some(seat => seat.rowIndex === rowIndex && seat.columnIndex === columnIndex);

                return (
                  <div
                    style={{
                      ...style,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isHeaderRow ? (
                      <MDTypography variant="body2">{columnHead}</MDTypography>
                    ) : isHeaderColumn ? (
                      <MDTypography variant="body2">{rowHeadAlphabetic}</MDTypography>
                    ) : (
                      <Grid container direction="column" alignItems="center" spacing={0}>
                        {seat && (
                          <>
                            <IconButton size="small" onClick={() => handleSeatClick(rowIndex, columnIndex)}>
                              <ChairIcon style={{ color: isBooked ? 'black' : 'green' }} />
                            </IconButton>
                            <MDTypography variant="body2">{seatName}</MDTypography>
                          </>
                        )}
                      </Grid>
                    )}
                  </div>
                );
              }}
            </FixedSizeGrid>
          )}
        </MDBox>
      </MDBox>
      <Divider sx={{ height: 2 }} />
    </Stack>
  );
}

ZoneSeatLayout.propTypes = {
  zone: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  updateBookedSeats: PropTypes.func.isRequired,
};