import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AddTicketCategoryModel({ open, onClose, onAddTicketCategory }) {

    const handleClose = () => {
        onClose();
        newTicketCategory.resetForm();
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            const newCategory = {
                ...values,
            };
            onAddTicketCategory(newCategory);
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const newTicketCategory = useFormik({
        initialValues: {
            name: '',
            price: '',
            ticketsCount: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            price: Yup.number().required('Required'),
            ticketsCount: Yup.number().required('Required'),
        }),
        onSubmit,
    });

    return (
        
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Ticket Category</DialogTitle>
            <form onSubmit={newTicketCategory.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Category Name"
                                name="name"
                                value={newTicketCategory.values.name}
                                onChange={newTicketCategory.handleChange}
                                onBlur={newTicketCategory.handleBlur}
                                error={newTicketCategory.touched.name && Boolean(newTicketCategory.errors.name)}
                                helperText={newTicketCategory.touched.name && newTicketCategory.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                value={newTicketCategory.values.price}
                                onChange={newTicketCategory.handleChange}
                                onBlur={newTicketCategory.handleBlur}
                                error={newTicketCategory.touched.price && Boolean(newTicketCategory.errors.price)}
                                helperText={newTicketCategory.touched.price && newTicketCategory.errors.price}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Tickets Count"
                                name="ticketsCount"
                                value={newTicketCategory.values.ticketsCount}
                                onChange={newTicketCategory.handleChange}
                                onBlur={newTicketCategory.handleBlur}
                                error={newTicketCategory.touched.ticketsCount && Boolean(newTicketCategory.errors.ticketsCount)}
                                helperText={newTicketCategory.touched.ticketsCount && newTicketCategory.errors.ticketsCount}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button type="submit" color="primary">Save</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

AddTicketCategoryModel.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.bool.isRequired,
    onAddTicketCategory: PropTypes.func.isRequired,
};