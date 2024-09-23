import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';

export default function EditTicketCategoryModel({ open, onClose, categoryId }) {

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const { data, error } = await supabase.from('zone_ticket_category').select('*').eq('id', categoryId);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const category = data[0];
                    editTicketCategory.setValues({
                        name: category.name,
                        price: category.price,
                        ticketsCount: category.ticketsCount,
                    });
                }
            } catch (error) {
                console.error('Error fetching category data:', error.message);
            }
        };
        fetchCategoryData();
    }, [categoryId]);

    const handleClose = () => {
        onClose();
        editTicketCategory.resetForm();
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            const { data, error } = await supabase.from('zone_ticket_category').update(values).select('*').eq('id', categoryId);
            if (error) {
                throw error;
            }
            if (data && data.length > 0) {
            }
            resetForm();
            toast.success('Category has been updated deleted!');
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const editTicketCategory = useFormik({
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
            <DialogTitle>Edit Ticket Category</DialogTitle>
            <form onSubmit={editTicketCategory.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Category Name"
                                name="name"
                                value={editTicketCategory.values.name}
                                onChange={editTicketCategory.handleChange}
                                onBlur={editTicketCategory.handleBlur}
                                error={editTicketCategory.touched.name && Boolean(editTicketCategory.errors.name)}
                                helperText={editTicketCategory.touched.name && editTicketCategory.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                value={editTicketCategory.values.price}
                                onChange={editTicketCategory.handleChange}
                                onBlur={editTicketCategory.handleBlur}
                                error={editTicketCategory.touched.price && Boolean(editTicketCategory.errors.price)}
                                helperText={editTicketCategory.touched.price && editTicketCategory.errors.price}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Tickets Count"
                                name="ticketsCount"
                                value={editTicketCategory.values.ticketsCount}
                                onChange={editTicketCategory.handleChange}
                                onBlur={editTicketCategory.handleBlur}
                                error={editTicketCategory.touched.ticketsCount && Boolean(editTicketCategory.errors.ticketsCount)}
                                helperText={editTicketCategory.touched.ticketsCount && editTicketCategory.errors.ticketsCount}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button type="submit" color="primary">Save</Button>
                </DialogActions>
            </form>
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
        </Dialog>
    )
}

EditTicketCategoryModel.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.bool.isRequired,
    categoryId: PropTypes.isRequired,
};