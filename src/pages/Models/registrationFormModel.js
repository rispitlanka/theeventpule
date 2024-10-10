import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';

export default function RegistrationFormModel({ open, onClose, eventId }) {
    const [selectedType, setSelectedType] = useState();
    const [formImagePreview, setFormImagePreview] = useState(null);
    const [isRequired, setIsRequired] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        onClose();
        setSelectedType('');
        setIsRequired();
        newFormField.resetForm();
    };

    const onSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        try {
            if (newFormField.values.formImage) {
                const file = newFormField.values.formImage;
                const { data: imageData, error: imageError } = await supabase.storage
                    .from('form_images')
                    .upload(`${file.name}`, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });
                if (imageError) {
                    throw imageError;
                }
                if (imageData) {
                    const imgURL = supabase.storage.from('form_images').getPublicUrl(imageData.path);
                    values.formImage = imgURL.data.publicUrl;
                } else {
                    throw new Error('Failed to upload image');
                }
            }
            values.type = selectedType;
            values.eventId = eventId;
            values.isRequired = isRequired === 'Yes';
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
            options: '',
            formImage: '',
            isRequired: 'No',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const addFormFieldData = async (values) => {
        try {
            const { data, error } = await supabase.from('registrationForm').insert([values]).select('*');
            if (data) {
                setIsLoading(false);
                console.log('Data added successfully:', data);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };

    const handleImagePreview = (event) => {
        const file = event.currentTarget.files[0];
        newFormField.setFieldValue('formImage', file);
        setFormImagePreview(URL.createObjectURL(file));
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Add Form Field</DialogTitle>
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
                            <FormControl fullWidth>
                                <InputLabel>Is Required?</InputLabel>
                                <Select
                                    required
                                    label="Is Required?"
                                    value={isRequired}
                                    onChange={(e) => setIsRequired(e.target.value)} // Update state on change
                                    sx={{ height: '45px' }}
                                >
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Type</InputLabel>
                                <Select
                                    required
                                    label="Select Type"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    sx={{ height: '45px', }}
                                >
                                    <MenuItem value="Text">Text</MenuItem>
                                    <MenuItem value="Number">Number</MenuItem>
                                    <MenuItem value="Phone">Phone Number</MenuItem>
                                    <MenuItem value="Email">Email</MenuItem>
                                    <MenuItem value="Select">Select</MenuItem>
                                    <MenuItem value="Date">Date</MenuItem>
                                    <MenuItem value="Radio">Radio</MenuItem>
                                    <MenuItem value="Checkbox">CheckBox</MenuItem>
                                    <MenuItem value="Password">Password</MenuItem>
                                    <MenuItem value="Image">Image</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {selectedType && selectedType.length > 0 && (
                            <>
                                {(selectedType === 'Select' || selectedType === 'Radio' || selectedType === 'Checkbox') && (
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Options"
                                            name="options"
                                            value={newFormField.values.options}
                                            onChange={newFormField.handleChange}
                                            onBlur={newFormField.handleBlur}
                                            error={newFormField.touched.options && Boolean(newFormField.errors.options)}
                                            helperText={newFormField.touched.options && newFormField.errors.options}
                                        />
                                    </Grid>
                                )}
                                {selectedType === 'Image' && (
                                    <Grid item xs={12}>
                                        {formImagePreview &&
                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                border="1px dashed"
                                                borderRadius="4px"
                                                width="50%"
                                                maxHeight="200px"
                                                mb={1}
                                                height="100px"
                                            >
                                                <img src={formImagePreview} alt="Theatre Preview" style={{ width: '100%', maxHeight: '100px' }} />
                                            </Box>
                                        }
                                        <Button component="label">
                                            Upload Image
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImagePreview}
                                                name="formImage"
                                            />
                                        </Button>
                                    </Grid>
                                )}
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button type="submit" color="primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

RegistrationFormModel.propTypes = {
    open: PropTypes.isRequired,
    onClose: PropTypes.isRequired,
    eventId: PropTypes.isRequired,
};