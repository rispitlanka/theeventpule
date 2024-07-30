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
// import GetTickets from './getTickets';
import CircleIcon from '@mui/icons-material/Circle';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import dayjs from 'dayjs';

export default function SeatBookings() {
    const [zonesData, setZonesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [venues, setVenues] = useState([]);
    const [otherShowTimes, setOtherShowTimes] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [seatResponses, setSeatResponses] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [otherShows, setOtherShows] = useState([]);
    const [seatType, setSeatType] = useState('full');
    const navigate = useNavigate();
    const { eventId, venueId } = useParams();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await fetchZonesData();
                await fetchEventsData();
                await fetchBookedTickets();
                await fetchVenues();
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

    const fetchZonesData = async () => {
        try {
            const { data, error } = await supabase.from('zones_events').select('*').eq('venueId', venueId);
            if (error) throw error;
            if (data) {
                setZonesData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const fetchEventsData = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId);

            if (error) throw error;

            if (data) {
                setEventsData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //   const fetchOtherShows = async () => {
    //     try {
    //       const { data: otherShowsDataResponse, error: otherShowsDataResponseError } = await supabase
    //         .from('shows')
    //         .select('*')
    //         .eq('date', date)
    //         .eq('venueId', venueId)
    //         .eq('movieId', movieId);

    //       if (otherShowsDataResponseError) {
    //         console.log(otherShowsDataResponseError);
    //         return;
    //       }
    //       setOtherShows(otherShowsDataResponse);

    //       const otherShowsTimeIds = otherShowsDataResponse.map(show => show.showTimeId);

    //       const { data: otherShowsTimeDataResponse, error: otherShowsTimeDataResponseError } = await supabase
    //         .from('showTime')
    //         .select('*')
    //         .in('id', otherShowsTimeIds);

    //       if (otherShowsTimeDataResponseError) {
    //         return;
    //       }
    //       setOtherShowTimes(otherShowsTimeDataResponse);

    //     } catch (error) {
    //       console.log('Error in fetching other shows', error);
    //     }
    //   }

    const fetchVenues = async () => {
        try {
            if (venueId) {
                const { data, error } = await supabase.from('venues').select('*').eq('id', venueId);
                if (data) {
                    setVenues(data);
                }
                if (error) {
                    console.log(error);
                }
            }
        }
        catch (error) {
            console.log('Error in fetching venues', error)
        }
    }

    const fetchBookedTickets = async () => {
        try {
            const { data, error } = await supabase
                .from('tickets_events')
                .select('*')
                .eq('eventId', eventId);

            if (data) {
                const seatIds = data.map(ticket => ticket.seatId);
                const seatResponses = await Promise.all(
                    seatIds.map(async seatId => {
                        const { data: seatData, error: seatError } = await supabase
                            .from('seats_events')
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
        setBookedSeats(newBookedSeats);
    };

    const handleSeatClick = (zoneId, zoneName, price, rowIndex, columnIndex, seatData) => {
        let newPrice = price;
        if (seatType === 'half') {
            newPrice = zonesData.find(zone => zone.id === zoneId).halfPrice;
        }
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
                price: newPrice,
                rowIndex,
                columnIndex,
                seatId: seatData.id,
                seatName: seatData.seatName,
                eventId: eventId,
                venueId:venueId
            };
            const updatedSeats = [...bookedSeats, newBookedSeat];
            setBookedSeats(updatedSeats);
            updateBookedSeats(updatedSeats);
        }
    };

    const handleFull = () => {
        setSeatType('full');
    }
    const handleHalf = () => {
        setSeatType('half');
    }

    const venueName = venues && venues.length > 0 ? venues[0].name : '';
    const eventTime = eventsData && eventsData.length > 0 ? eventsData[0].startTime : '';
    const eventDate = eventsData && eventsData.length > 0 ? eventsData[0].date : '';
    const eventName = eventsData && eventsData.length > 0 ? eventsData[0].name : '';

    const handleProceed = () => {
        setClicked(true);
        navigate('/eventBookings/book-seats/get-tickets', { state: { bookedSeats, eventName, eventDate, eventTime, venueName } });
    }

    const handleOtherShows = (showTimeId) => {
        const eventId = otherShows.find((show) => show.showTimeId === showTimeId)?.id;
        openPage(`/eventBookings/book-seats/${eventId}/${venueId}?date=${date}&movieId=${movieId}`);
    }

    useEffect(() => {
    }, [clicked, bookedSeats]);

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('en-US', options);
    };

    const formattedDate = (date) => {
        return dayjs(date).format('DD/MM/YYYY');
    }

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
                                    <MDTypography variant='h4' sx={{ mr: 2 }}>{eventName} </MDTypography>
                                    <MDTypography> - {venueName}</MDTypography>
                                </Grid>
                            </MDBox>
                            <MDBox>
                                <Grid display={'flex'} flexDirection={'row'}>
                                    <MDTypography sx={{ mr: 2 }}>{formattedDate(eventDate)}</MDTypography>
                                    <MDTypography>{formattedTime(eventTime)}</MDTypography>
                                </Grid>
                            </MDBox>
                            {/* <MDBox sx={{ position: 'absolute', bottom: 16, right: 16, }}>
                                <MDTypography variant='body2' p={1}>Other Shows</MDTypography>
                                <Grid display={'flex'} flexDirection={'row'}>
                                    {otherShowTimes && otherShowTimes
                                        .filter(otherTime => otherTime.eventTime !== eventTime)
                                        .map(times => (
                                            <Chip label={formattedTime(times.eventTime)} sx={{ mr: 1 }} key={times.id} onClick={() => handleOtherShows(times.id)} />
                                        ))}
                                </Grid>
                            </MDBox> */}
                        </Grid>
                    </Card>
                    <MDBox sx={{ mt: 3 }}>
                        <Grid container justifyContent="space-between" display={'flex'} flexDirection={'row'}>
                            <Grid item>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <MDTypography display="flex" alignItems="center" mr={1}>Select Seat Type:</MDTypography>
                                    </Grid>
                                    <Grid item>
                                        <MDTypography display="flex" alignItems="center">
                                            <StarIcon onClick={handleFull} style={{ color: seatType === 'full' ? 'blue' : 'grey', cursor: 'pointer' }} />Full
                                        </MDTypography>
                                    </Grid>
                                    <Grid item>
                                        <MDTypography display="flex" alignItems="center" >
                                            <StarHalfIcon onClick={handleHalf} style={{ color: seatType === 'half' ? 'blue' : 'grey', cursor: 'pointer' }} />Half
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
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
                            </Grid>
                        </Grid>
                    </MDBox>
                    <Card sx={{
                        position: 'relative',
                        mt: 1,
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
            {/* {clicked && bookedSeats.length > 0 && (
        <GetTickets />)
      } */}
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
                const { data, error } = await supabase.from('seats_events').select('*').eq('zoneId', zone.id).range((page - 1) * pageSize, page * pageSize - 1);
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
            eventId: PropTypes.isRequired,
        })
    ).isRequired,
    handleSeatClick: PropTypes.func.isRequired,
    seatResponses: PropTypes.isRequired
};