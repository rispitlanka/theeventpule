import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';

export default function RegistrationFormModel({ open, onClose, }) {

    const handleClose = () => {
        onClose();
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            await addFormFieldData(values);
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const newFormField = useFormik({
        initialValues: {
            name: '',
            type: '',
            option: '',
        },
        validationSchema: Yup.object({
            // name: Yup.string().required('Required'),
            // type: Yup.string().required('Required'),
            // option: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const addFormFieldData = async (values) => {
        try {
            const { data, error } = await supabase.from('registrationForm').insert([values]).select('*');
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
            <DialogTitle>Set backup account</DialogTitle>
            <form onSubmit={newFormField.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={newFormField.values.name}
                                onChange={newFormField.handleChange}
                                onBlur={newFormField.handleBlur}
                                error={newFormField.touched.name && Boolean(newFormField.errors.name)}
                                helperText={newFormField.touched.name && newFormField.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Type"
                                name="type"
                                value={newFormField.values.type}
                                onChange={newFormField.handleChange}
                                onBlur={newFormField.handleBlur}
                                error={newFormField.touched.type && Boolean(newFormField.errors.type)}
                                helperText={newFormField.touched.type && newFormField.errors.type}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Option"
                                name="option"
                                value={newFormField.values.option}
                                onChange={newFormField.handleChange}
                                onBlur={newFormField.handleBlur}
                                error={newFormField.touched.option && Boolean(newFormField.errors.option)}
                                helperText={newFormField.touched.option && newFormField.errors.option}
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

RegistrationFormModel.propTypes = {
    open: PropTypes.isRequired,
    onClose: PropTypes.isRequired,
};