import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';

export default function AddStageModel({ open, onClose, eventId }) {
    const handleClose = () => {
        onClose();
        newStageForm.resetForm();
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            values.eventId = eventId;
            await addStageData(values);
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const newStageForm = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const addStageData = async (values) => {
        try {
            const { data, error } = await supabase.from('stages').insert([values]).select('*');
            if (data) {
                console.log('Data added successfully:', data);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Stage</DialogTitle>
            <form onSubmit={newStageForm.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={newStageForm.values.name}
                                onChange={newStageForm.handleChange}
                                onBlur={newStageForm.handleBlur}
                                error={newStageForm.touched.name && Boolean(newStageForm.errors.name)}
                                helperText={newStageForm.touched.name && newStageForm.errors.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={newStageForm.values.description}
                                onChange={newStageForm.handleChange}
                                onBlur={newStageForm.handleBlur}
                                error={newStageForm.touched.description && Boolean(newStageForm.errors.description)}
                                helperText={newStageForm.touched.description && newStageForm.errors.description}
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

AddStageModel.propTypes = {
    open: PropTypes.isRequired,
    onClose: PropTypes.isRequired,
    eventId: PropTypes.isRequired,
};