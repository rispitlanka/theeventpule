import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

export default function TicketsCountModel({ open, handleClose, eventId, venueId, eventName, eventDate, eventTime, venueName, isFree }) {
    const navigate = useNavigate();
    const [venueData, setVenueData] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [bookedTicketsCount, setBookedTicketsCount] = useState({});
    const [totalTicketsCount, setTotalTicketsCount] = useState({});

    const fetchVenue = async () => {
        try {
            const { data, error } = await supabase
                .from('venues')
                .select('*, zones_events (*), zone_ticket_category(*)')
                .eq('id', venueId)
            if (data) {
                setVenueData(data);
                const ticketsCountByCategory = data[0].zone_ticket_category.reduce((acc, category) => {
                    // Parse ticketsCount to integer, defaulting to 0 if null or non-numeric
                    acc[category.id] = parseInt(category.ticketsCount, 10) || 0;
                    return acc;
                }, {});

                setTotalTicketsCount(ticketsCountByCategory);
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

    useEffect(() => {
        const fetchBookedTicketsCount = async (selectedZoneId, eventId) => {
            try {
                const { data, error } = await supabase
                    .rpc('get_booked_tickets_count', { zone_id: selectedZoneId, event_id: eventId });
                if (data) {
                    const countByCategory = data.reduce((acc, item) => {
                        acc[item.category_id] = item.count;
                        return acc;
                    }, {});
                    setBookedTicketsCount(countByCategory);
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

    const ticketsCount = useFormik({
        initialValues: {},
        validationSchema: Yup.object(),
        validate: (values) => {
            const errors = {};
            // Check each category for available tickets
            venueData[0]?.zone_ticket_category
                .filter(category => category.zoneId === selectedZoneId)
                .forEach((category) => {
                    const currentCount = parseInt(values[category.id], 10) || 0;
                    const totalTickets = totalTicketsCount[category.id] || 0;
                    const bookedTickets = bookedTicketsCount[category.id] || 0;
                    const availableTickets = totalTickets - bookedTickets;

                    if (currentCount > availableTickets) {
                        errors[category.id] = `Cannot exceed available tickets (${availableTickets})`;
                    }
                    if (currentCount < 0) {
                        errors[category.id] = `Tickets count cannot be negative`;
                    }
                });

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
                        <MDBox p={1}>
                            {venueData[0]?.zone_ticket_category
                                ?.filter(category => category.zoneId === selectedZoneId)
                                .map((category) => {
                                    const totalTickets = totalTicketsCount[category.id] || 0;
                                    const bookedTickets = bookedTicketsCount[category.id] || 0;
                                    const availableTickets = totalTickets - bookedTickets;
                                    const currentCount = parseInt(ticketsCount.values[category.id], 10) || 0;

                                    return (
                                        <Box key={category.id} sx={{ mt: 2 }}>
                                            <TextField
                                                margin="dense"
                                                id={`fullTicketsCount-${category.id}`}
                                                name={`fullTicketsCount-${category.id}`}
                                                label={`Tickets count for ${category.name}`}
                                                type="number"
                                                fullWidth
                                                variant="standard"
                                                value={currentCount}
                                                onChange={(e) => ticketsCount.setFieldValue(category.id, e.target.value)}
                                                onBlur={ticketsCount.handleBlur}
                                                error={ticketsCount.touched[category.id] && Boolean(ticketsCount.errors[category.id])}
                                                helperText={ticketsCount.touched[category.id] && ticketsCount.errors[category.id]}
                                            />
                                            <MDTypography fontWeight='light'>
                                                Available Tickets: {availableTickets}
                                            </MDTypography>
                                        </Box>
                                    );

                                })}
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