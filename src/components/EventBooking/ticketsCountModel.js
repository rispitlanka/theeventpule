import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';
import MDBox from 'components/MDBox';

export default function TicketsCountModel({ open, handleClose, eventId, venueId, eventName, eventDate, eventTime, venueName, isFree }) {
    const navigate = useNavigate();
    const [venueData, setVenueData] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [bookedTicketsCount, setBookedTicketsCount] = useState(0);

    const fetchVenue = async () => {
        try {
            const { data, error } = await supabase
                .from('venues')
                .select('*, zones_events (*), zone_ticket_category(*)')
                .eq('id', venueId)
            if (data) {
                setVenueData(data);
            }
            if (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log('Error in fetching venue', error)
        }
    }

    useEffect(() => {
        fetchVenue();
    }, [])

    const zoneName = selectedZoneId && (venueData[0]?.zones_events?.filter(zone => zone.id === selectedZoneId).map(zone => zone.name)[0]);
    const totalZoneTicketsCount = selectedZoneId && (venueData[0]?.zones_events?.filter(zone => zone.id === selectedZoneId).map(zone => zone.ticketsCount)[0]) || 0;

    useEffect(() => {
        const fetchBookedTicketsCount = async (selectedZoneId, eventId) => {
            try {
                const { data, error } = await supabase
                    .rpc('get_booked_tickets_count', { zone_id: selectedZoneId, event_id: eventId });
                if (data) {
                    const bookedSeatsCount = data[0].booked_tickets_count;
                    // setBookedTicketsCount(prevCounts => ({
                    //     ...prevCounts,
                    //     [eventId]: {
                    //         ...(prevCounts[selectedZoneId] || {}),
                    //         [eventId]: bookedSeatsCount
                    //     }
                    // }));
                    setBookedTicketsCount(bookedSeatsCount);
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
        fetchBookedTicketsCount(Number(selectedZoneId), eventId);
    }, [selectedZoneId, eventId])

    const maxTicketsAllowed = totalZoneTicketsCount - bookedTicketsCount;

    const ticketsCount = useFormik({
        initialValues: {},
        validationSchema: Yup.object().shape({}),
        validate: (values) => {
            const errors = {};
            const totalTickets = Object.values(values).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
            if (totalTickets > maxTicketsAllowed) {
                errors.totalTickets = `Total number of tickets cannot exceed ${maxTicketsAllowed}`;
            }
            if (totalTickets <= 0) {
                errors.totalTickets = `Total number of tickets should be more than 0`;
            }
            return errors;
        },
        onSubmit: (values) => {
            navigate('/eventBookings/book-seats/get-tickets', {
                state: {
                    eventId,
                    venueId,
                    zoneId: selectedZoneId,
                    eventName,
                    eventDate,
                    eventTime,
                    venueName,
                    zoneName,
                    ticketsCount: values,
                    isFree,
                }
            });
        },
    });

    useEffect(() => {
        ticketsCount.resetForm();
    }, [selectedZoneId]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={ticketsCount.handleSubmit}>
                <DialogTitle>Buy Tickets</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose the perfect tickets to suit your needs!
                    </DialogContentText>
                    <MDBox m={1}>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel>Select Zone</InputLabel>
                                <Select
                                    label="Select Zone"
                                    value={selectedZoneId}
                                    onChange={(e) => setSelectedZoneId(e.target.value)}
                                    sx={{ height: '45px' }}
                                >
                                    {venueData[0]?.zones_events?.map((zone) => (
                                        <MenuItem key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Box>
                        <Box><Typography>{bookedTicketsCount}/{totalZoneTicketsCount}</Typography></Box>
                        <MDBox p={1}>
                            {venueData[0]?.zone_ticket_category
                                ?.filter(category => category.zoneId === selectedZoneId)
                                .map((category) => (
                                    <Box key={category.id} sx={{ mt: 2 }}>
                                        <TextField
                                            margin="dense"
                                            id={`fullTicketsCount-${category.id}`}
                                            name={`fullTicketsCount-${category.id}`}
                                            label={`Tickets count for ${category.name}`}
                                            type="number"
                                            fullWidth
                                            variant="standard"
                                            value={ticketsCount.values[category.id] || 0}
                                            onChange={(e) => ticketsCount.setFieldValue(category.id, e.target.value)}
                                            onBlur={ticketsCount.handleBlur}
                                            error={ticketsCount.touched[category.id] && Boolean(ticketsCount.errors[category.id])}
                                            helperText={ticketsCount.touched[category.id] && ticketsCount.errors[category.id]}
                                        />
                                    </Box>
                                ))}
                            {ticketsCount.errors.totalTickets && (
                                <MDBox mt={2} color="error">
                                    {ticketsCount.errors.totalTickets}
                                </MDBox>
                            )}
                        </MDBox>
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Continue</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

TicketsCountModel.propTypes = {
    open: PropTypes.isRequired,
    handleClose: PropTypes.isRequired,
    eventId: PropTypes.isRequired,
    venueId: PropTypes.isRequired,
    eventName: PropTypes.isRequired,
    venueName: PropTypes.isRequired,
    eventDate: PropTypes.isRequired,
    eventTime: PropTypes.isRequired,
    fullPrice: PropTypes.isRequired,
    halfPrice: PropTypes.isRequired,
    isFree: PropTypes.isRequired,
};