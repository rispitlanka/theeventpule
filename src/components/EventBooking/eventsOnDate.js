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

export default function EventsOnDate(date) {
    const eqDate = date.date;
    const today = new Date();
    const formattedDate = new Date(today).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const isValidDate = eqDate >= formattedDate;
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

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase.from('events').select('*, venues (name)').eq('date', eqDate).eq('eventOrganizationId', userOrganizationId).eq('isActive', true);
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
    }, [eqDate])

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('en-US', options);
    };

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

    return (
        <>
            {isLoading ? (
                <MDBox p={3} display="flex" justifyContent="center">
                    <CircularProgress color="info" />
                </MDBox>
            ) : (
                <>
                    {events && events.length > 0 ?
                        <TableContainer component={Paper} sx={{ p: 2 }}>
                            <Table>
                                <TableHead sx={{ display: "table-header-group" }}>
                                    <TableRow>
                                        <TableCell>Event</TableCell>
                                        <TableCell>Venue</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell align='center'></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {events.map((row) => {
                                        const bookedCount = bookedSeatsCount[row.id] || 0;
                                        const totalCount = totalSeatsCount[row.venueId] || 0;
                                        const isFull = bookedCount >= totalCount;

                                        return (
                                            <TableRow key={row.id} >
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.venues?.name}</TableCell>
                                                <TableCell>{formattedTime(row.startTime)}</TableCell>
                                                <TableCell align='center'>
                                                    <MDButton
                                                        color='info'
                                                        variant='contained'
                                                        onClick={() => { openPage(`/eventBookings/book-seats/${row.id}/${row.venueId}`) }}
                                                        disabled={isFull || !isValidDate}
                                                    >
                                                        Book Now
                                                    </MDButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        : (
                            <DataNotFound message={'No Events Scheduled Yet !'} image={noDataImage} />
                        )}
                </>
            )}
        </>
    )
}

EventsOnDate.propTypes = {
    date: PropTypes.string.isRequired,
};
