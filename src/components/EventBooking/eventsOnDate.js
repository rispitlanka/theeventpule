import { supabase } from 'pages/supabaseClient'
import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DataNotFound from 'components/NoData/dataNotFound';
import MDBox from 'components/MDBox';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { UserDataContext } from 'context';
import MDButton from 'components/MDButton';
import TicketsCountModel from './ticketsCountModel';
import dayjs from 'dayjs';

export default function EventsOnDate() {
    const [events, setEvents] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [bookedSeatsCount, setBookedSeatsCount] = useState({});
    const [totalSeatsCount, setTotalSeatsCount] = useState({});
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    const currentDate = dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss');

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*, venues (name,isSeat,zones_events(price,halfPrice))')
                .gte('date', currentDate)
                .eq('eventOrganizationId', userOrganizationId)
                .eq('isActive', true);
            if (data) {
                setEvents(data);
                setIsLoading(false);
            }
            if (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log('Error in fetching events', error)
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [])

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('en-US', options);
    };

    const formattedDate = (date) => {
        return dayjs(date).format('DD/MM/YYYY');
    }

    const fetchBookedSeatsCount = async (eventId) => {
        try {
            const { data, error } = await supabase
                .rpc('get_booked_event_seats_count', { event_id: eventId });
            if (data) {
                const bookedSeatsCount = data[0].booked_event_seats_count;
                setBookedSeatsCount(prevCounts => ({ ...prevCounts, [eventId]: bookedSeatsCount }));
            }
            if (error) {
                console.log(error);
                return 0;
            }
        } catch (error) {
            console.log('Error in fetching booked tickets', error);
            return 0;
        }
    };

    const fetchTotalSeatsCount = async (venueId) => {
        try {
            const { data, error } = await supabase
                .rpc('get_all_event_seats_count', { venue_id: venueId });
            if (data) {
                const totalSeatsCount = data[0].event_seats_count;
                setTotalSeatsCount(prevCounts => ({ ...prevCounts, [venueId]: totalSeatsCount }));
            }
            if (error) {
                console.log(error);
                return 0;
            }
        } catch (error) {
            console.log('Error in fetching seats count', error);
            return 0;
        }
    };

    useEffect(() => {
        events?.forEach(event => {
            fetchBookedSeatsCount(event.id);
            fetchTotalSeatsCount(event.venueId);
        });
    }, [events]);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleBookNowClick = (event) => {
        if (event.venues?.isSeat) {
            openPage(`/eventBookings/book-seats/${event.id}/${event.venueId}`);
        } else {
            setSelectedEvent(event);
            handleClickOpen();
        }
    };

    return (
        <>
            {isLoading ? (
                <MDBox p={3} display="flex" justifyContent="center">
                    <CircularProgress color="info" />
                </MDBox>
            ) : (
                <>
                    {events && events.length > 0 ? (
                        <TableContainer component={Paper} sx={{ p: 2 }}>
                            <Table>
                                <TableHead sx={{ display: "table-header-group" }}>
                                    <TableRow>
                                        <TableCell>Event</TableCell>
                                        <TableCell>Venue</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell align='center'></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {events.map((row) => {
                                        const bookedCount = bookedSeatsCount[row.id] || 0;
                                        const totalCount = totalSeatsCount[row.venueId] || 0;
                                        const isFull = (totalCount > 0) && (bookedCount >= totalCount);

                                        return (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.venues?.name}</TableCell>
                                                <TableCell>{formattedDate(row.date)}</TableCell>
                                                <TableCell>{formattedTime(row.startTime)}</TableCell>
                                                <TableCell align='center'>
                                                    <MDButton
                                                        color='info'
                                                        variant='contained'
                                                        onClick={() => handleBookNowClick(row)}
                                                        disabled={isFull}
                                                    >
                                                        Book Now
                                                    </MDButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <DataNotFound message={'No Events Scheduled Yet !'} image={noDataImage} />
                    )}

                    {selectedEvent && (
                        <TicketsCountModel
                            open={open}
                            handleClose={() => { setSelectedEvent(null); handleClose(); }}
                            eventId={selectedEvent.id}
                            venueId={selectedEvent.venueId}
                            eventName={selectedEvent.name}
                            eventDate={selectedEvent.date}
                            eventTime={selectedEvent.startTime}
                            venueName={selectedEvent.venues?.name}
                            fullPrice={selectedEvent.venues?.zones_events[0]?.price}
                            halfPrice={selectedEvent.venues?.zones_events[0]?.halfPrice}
                            isFree={selectedEvent.isFree}
                        />
                    )}
                </>
            )}
        </>
    )
}

EventsOnDate.propTypes = {
    date: PropTypes.string.isRequired,
};
