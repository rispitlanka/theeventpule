import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';
import QRCode from 'qrcode';

export default function AddStageModel({ open, onClose, eventId }) {
    const handleClose = () => {
        onClose();
        newStageForm.resetForm();
    };

    const addStageData = async (values) => {
        const { data, error } = await supabase.from('stages').insert([values]).select('*');
        if (error) throw new Error('Error inserting data:', error.message);

        return data[0];
    };

    const updateQrCode = async (stageID) => {
        const qrCodeDataUrl = await QRCode.toDataURL(String(stageID));
        const { data, error } = await supabase.from('stages').update({ qrImage: qrCodeDataUrl }).eq('id', stageID).select('*');
        if (error) throw new Error('Error updating QR code:', error.message);

        return data;
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            values.eventId = eventId;
            const newStage = await addStageData(values);
            await updateQrCode(newStage.id);

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
                                {...newStageForm.getFieldProps('name')}
                                error={newStageForm.touched.name && Boolean(newStageForm.errors.name)}
                                helperText={newStageForm.touched.name && newStageForm.errors.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                {...newStageForm.getFieldProps('description')}
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
    );
}

AddStageModel.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    eventId: PropTypes.string.isRequired,
};