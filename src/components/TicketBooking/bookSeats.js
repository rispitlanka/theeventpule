import { Box, Card, Chip, CircularProgress, Divider, Grid, IconButton, Stack } from '@mui/material';
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
import CircleIcon from '@mui/icons-material/Circle';

export default function BookSeats() {
  const [zonesData, setZonesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [screens, setScreens] = useState([]);
  const [otherShowTimes, setOtherShowTimes] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [seatResponses, setSeatResponses] = useState([]);
  const [showData, setShowData] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [otherShows, setOtherShows] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { showId, screenId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  const movieId = queryParams.get('movieId');

  const openPage = (route) => {
    navigate(route);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetchMovieData();
        await fetchZonesData();
        await fetchShowData();
        await fetchBookedTickets();
        await fetchOtherShows();
        await fetchScreens();
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showId]);

  const fetchZonesData = async () => {
    try {
      const { data, error } = await supabase.from('zones').select('*').eq('screenId', screenId);
      if (error) throw error;
      if (data) {
        setZonesData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMovieData = async () => {
    try {
      const { data, error } = await supabase.from('movies').select('*').eq('id', movieId);
      if (error) throw error;
      if (data) {
        setMovieData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShowData = async () => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*, showTime(*)')
        .eq('id', showId);

      if (error) throw error;

      if (data) {
        setShowData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOtherShows = async () => {
    try {
      const { data: otherShowsDataResponse, error: otherShowsDataResponseError } = await supabase
        .from('shows')
        .select('*')
        .eq('date', date)
        .eq('screenId', screenId)
        .eq('movieId', movieId);

      if (otherShowsDataResponseError) {
        console.log(otherShowsDataResponseError);
        return;
      }
      setOtherShows(otherShowsDataResponse);

      const otherShowsTimeIds = otherShowsDataResponse.map(show => show.showTimeId);

      const { data: otherShowsTimeDataResponse, error: otherShowsTimeDataResponseError } = await supabase
        .from('showTime')
        .select('*')
        .in('id', otherShowsTimeIds);

      if (otherShowsTimeDataResponseError) {
        return;
      }
      setOtherShowTimes(otherShowsTimeDataResponse);

    } catch (error) {
      console.log('Error in fetching other shows', error);
    }
  }

  const fetchScreens = async () => {
    try {
      if (screenId) {
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

  const fetchBookedTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('showId', showId);

      if (data) {
        console.log('booked tickets', data);
        const seatIds = data.map(ticket => ticket.seatId);
        const seatResponses = await Promise.all(
          seatIds.map(async seatId => {
            const { data: seatData, error: seatError } = await supabase
              .from('seats')
              .select('zoneId, row, column')
              .eq('id', seatId);
            if (seatData) {
              return seatData[0];
            }
            if (seatError) {
              console.log('Error fetching seat:', seatError);
              return null;
            }
          })
        );
        console.log('Seat details:', seatResponses);
        setSeatResponses(seatResponses);
      }

      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log('Error in fetching booked tickets', error);
    }
  };

  const updateBookedSeats = (newBookedSeats) => {
    console.log('Updating booked seats:', newBookedSeats);
    setBookedSeats(newBookedSeats);
  };

  const handleSeatClick = (zoneId, zoneName, price, rowIndex, columnIndex, seatData) => {
    console.log(seatData)
    const seatIndex = bookedSeats.findIndex(seat => seat.zoneId === zoneId && seat.rowIndex === rowIndex && seat.columnIndex === columnIndex);
    if (seatIndex !== -1) {
      // Seat is already booked, so deselect it
      const updatedSeats = [...bookedSeats];
      updatedSeats.splice(seatIndex, 1);
      setBookedSeats(updatedSeats);
      updateBookedSeats(updatedSeats);
    } else {
      // Seat is not booked, so book it
      const newBookedSeat = {
        zoneId,
        zoneName,
        price,
        rowIndex,
        columnIndex,
        seatId: seatData.id,
        seatName: seatData.seatName,
        showId: showId,
      };
      const updatedSeats = [...bookedSeats, newBookedSeat];
      setBookedSeats(updatedSeats);
      updateBookedSeats(updatedSeats);
    }
  };

  const screenName = screens && screens.length > 0 ? screens[0].name : '';
  const time = showData && showData.length > 0 ? showData[0].showTime.time : '';
  const showDate = showData && showData.length > 0 ? showData[0].date : '';
  const movieTitle = movieData && movieData.length > 0 ? movieData[0].title : '';

  const handleProceed = () => {
    setClicked(true);
    navigate('/bookings/book-seats/get-tickets', { state: { bookedSeats, showDate, movieId, movieTitle, time, screenName } });
  }

  const handleOtherShows = (showTimeId) => {
    const showId = otherShows.find((show) => show.showTimeId === showTimeId)?.id;
    openPage(`/bookings/book-seats/${showId}/${screenId}?date=${date}&movieId=${movieId}`);
  }

  useEffect(() => {
  }, [clicked, bookedSeats]);

  const formattedTime = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date(0, 0, 0, hours, minutes, seconds);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  };

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
              p: 2,
            }}
          >
            <Grid>
              <MDBox>
                <Grid display={'flex'} flexDirection={'row'}>
                  <MDTypography variant='h4' sx={{ mr: 2 }}>{movieTitle} </MDTypography>
                  <MDTypography> - {screenName}</MDTypography>
                </Grid>
              </MDBox>
              <MDBox>
                <Grid display={'flex'} flexDirection={'row'}>
                  <MDTypography sx={{ mr: 2 }}>{showDate}</MDTypography>
                  <MDTypography>{formattedTime(time)}</MDTypography>
                </Grid>
              </MDBox>
              <MDBox sx={{ position: 'absolute', bottom: 16, right: 16, }}>
                <MDTypography variant='body2' p={1}>Other Shows</MDTypography>
                <Grid display={'flex'} flexDirection={'row'}>
                  {otherShowTimes && otherShowTimes
                    .filter(otherTime => otherTime.time !== time)
                    .map(times => (
                      <Chip label={formattedTime(times.time)} sx={{ mr: 1 }} key={times.id} onClick={() => handleOtherShows(times.id)} />
                    ))}
                </Grid>
              </MDBox>
            </Grid>
          </Card>
          <MDBox sx={{ position: 'absolute', mt: 3, }}>
            <Grid container spacing={0} alignItems="center" >
              <Grid item>
                <MDTypography variant='body2' display="flex" alignItems="center" mr={1}>
                  <CircleIcon sx={{ color: 'green', mr: 0.5 }} />Available
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography variant='body2' display="flex" alignItems="center" mr={1}>
                  <CircleIcon sx={{ color: 'black', mr: 0.5 }} />Selected
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography variant='body2' display="flex" alignItems="center">
                  <CircleIcon sx={{ color: 'grey', mr: 0.5 }} />Booked
                </MDTypography>
              </Grid>

            </Grid>
          </MDBox>
          <Card sx={{
            position: 'relative',
            mt: 7,
            mb: 2,
            pb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Grid container sx={{ overflowX: 'auto' }}>
              {zonesData.map(zone => (
                <ZoneSeatLayout key={zone.id} zone={zone} bookedSeats={bookedSeats} handleSeatClick={handleSeatClick} seatResponses={seatResponses} />
              ))}
            </Grid>
            <MDButton color={'info'} sx={{ width: '10%', mt: 2 }} onClick={handleProceed} disabled={bookedSeats.length <= 0}>Proceed</MDButton>
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

function ZoneSeatLayout({ zone, bookedSeats, handleSeatClick, seatResponses }) {
  const [seatsData, setSeatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const bookedSeatsCount = (seatResponses.filter(seatResponses => seatResponses.zoneId === zone.id).length);
  const totalSeatsCount = (seatsData.filter(seatResponses => seatResponses.zoneId === zone.id).length);

  return (
    <Stack>
      <MDBox>
        <MDTypography variant="h6" sx={{ ml: 2, mt: 2, mr: 2 }}>
          {zone.name} - {bookedSeatsCount}/{totalSeatsCount}
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
                const isBooked = bookedSeats.some(seat => seat.zoneId === zone.id && seat.rowIndex === rowIndex && seat.columnIndex === columnIndex);

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
                            <IconButton size="small" onClick={() => handleSeatClick(zone.id, zone.name, zone.price, rowIndex, columnIndex, seat)} disabled={seatResponses.some(response => response.zoneId === zone.id && response.row === rowIndex.toString() && response.column === columnIndex.toString())}>
                              <ChairIcon style={{ color: seatResponses.some(response => response.zoneId === zone.id && response.row === rowIndex.toString() && response.column === columnIndex.toString()) ? 'grey' : (isBooked ? 'black' : 'green') }} />
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
    price: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  bookedSeats: PropTypes.arrayOf(
    PropTypes.shape({
      zoneId: PropTypes.number.isRequired,
      zoneName: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      rowIndex: PropTypes.number.isRequired,
      columnIndex: PropTypes.number.isRequired,
      seatName: PropTypes.string.isRequired,
      showId: PropTypes.isRequired,
    })
  ).isRequired,
  handleSeatClick: PropTypes.func.isRequired,
  seatResponses: PropTypes.isRequired
};