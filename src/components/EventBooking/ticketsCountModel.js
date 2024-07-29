import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function TicketsCountModel({ open, handleClose, eventId, eventName, eventDate, eventTime, venueName, fullPrice, halfPrice }) {
    const navigate = useNavigate();

    const ticketsCount = useFormik({
        initialValues: {
            fullTicketsCount: '',
            halfTicketsCount: '',
        },
        validationSchema: Yup.object({
            fullTicketsCount: Yup.number().required('Required').min(1, 'Must be at least 1'),
            halfTicketsCount: Yup.number().min(0, 'Cannot be less than 0'),
        }),
        onSubmit: (values) => {
            navigate('/eventBookings/book-seats/get-tickets', {
                state: {
                    eventId,
                    eventName,
                    eventDate,
                    eventTime,
                    venueName,
                    fullTicketsCount: values.fullTicketsCount,
                    halfTicketsCount: values.halfTicketsCount,
                    fullPrice,
                    halfPrice,
                }
            });
        },
    });

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={ticketsCount.handleSubmit}>
                <DialogTitle>Buy Tickets</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose the perfect tickets to suit your needs!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="fullTicketsCount"
                        name="fullTicketsCount"
                        label="Number Of Full Tickets"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={ticketsCount.values.fullTicketsCount}
                        onChange={ticketsCount.handleChange}
                        onBlur={ticketsCount.handleBlur}
                        error={ticketsCount.touched.fullTicketsCount && Boolean(ticketsCount.errors.fullTicketsCount)}
                        helperText={ticketsCount.touched.fullTicketsCount && ticketsCount.errors.fullTicketsCount}
                    />
                    <TextField
                        margin="dense"
                        id="halfTicketsCount"
                        name="halfTicketsCount"
                        label="Number Of Half Tickets"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={ticketsCount.values.halfTicketsCount}
                        onChange={ticketsCount.handleChange}
                        onBlur={ticketsCount.handleBlur}
                        error={ticketsCount.touched.halfTicketsCount && Boolean(ticketsCount.errors.halfTicketsCount)}
                        helperText={ticketsCount.touched.halfTicketsCount && ticketsCount.errors.halfTicketsCount}
                    />
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
    eventId:PropTypes.isRequired,
    eventName: PropTypes.isRequired,
    venueName: PropTypes.isRequired,
    eventDate: PropTypes.isRequired,
    eventTime: PropTypes.isRequired,
    fullPrice: PropTypes.isRequired,
    halfPrice:PropTypes.isRequired,
};