import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from 'pages/supabaseClient';

export default function EditRegistrationFormModel({ open, onClose, fieldId }) {
    const [selectedType, setSelectedType] = useState();
    const [formImagePreview, setFormImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRequired, setIsRequired] = useState();


    const handleClose = () => {
        onClose();
        setSelectedType('');
        editFormField.resetForm();
        setIsRequired('');
        setFormImagePreview(null);
    };

    useEffect(() => {
        const fetchFormField = async () => {
            try {
                const { data, error } = await supabase.from('registrationForm').select('*').eq('id', fieldId);
                if (error) {
                    throw error;
                }

                if (data && data.length > 0) {
                    const fields = data[0];
                    editFormField.setValues({
                        name: fields.name,
                        type: fields.type,
                        options: fields.options || '',
                        isRequired: fields.isRequired ? 'Yes' : 'No',
                        eventId: fields.eventId
                    });
                    setSelectedType(fields.type);  // Set selected type
                    setIsRequired(fields.isRequired ? 'Yes' : 'No');  // Set required state

                    if (fields.type === 'Image') {
                        setFormImagePreview(fields.formImage);
                    }

                }
            } catch (error) {
                console.error('Error fetching fields data:', error.message);
            }
        };
        fetchFormField();
    }, [fieldId, open]);

    const onSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        try {

            if (editFormField.values.formImage) {
                const file = editFormField.values.formImage;
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
            values.fieldId = fieldId;
            values.isRequired = isRequired === 'Yes';

            await addFormFieldData(values);
            resetForm();
            onClose();
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setIsLoading(false);
        }
    };

    const editFormField = useFormik({
        initialValues: {
            name: '',
            type: '',
            options: '',
            formImage: '',
            isRequired: 'No',
            eventId: '',

        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const addFormFieldData = async (values) => {
        try {



            const { fieldId, ...updateValues } = values;

            const { data, error } = await supabase
                .from('registrationForm')
                .update(updateValues)
                .eq('id', fieldId);

            if (error) {
                throw error;
            }

            if (data) {
                setIsLoading(false);
                console.log('Data updated successfully:', data);
            }
        } catch (error) {
            console.error('Error updating data:', error.message);
        }
    };
    const handleImagePreview = (event) => {
        const file = event.currentTarget.files[0];
        editFormField.setFieldValue('formImage', file);
        setFormImagePreview(URL.createObjectURL(file));
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Form Field</DialogTitle>
            <form onSubmit={editFormField.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={editFormField.values.name}
                                onChange={editFormField.handleChange}
                                onBlur={editFormField.handleBlur}
                                error={editFormField.touched.name && Boolean(editFormField.errors.name)}
                                helperText={editFormField.touched.name && editFormField.errors.name}
                            />
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
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Is Required?</InputLabel>
                                <Select
                                    required
                                    label="Is Required?"
                                    value={isRequired}
                                    onChange={(e) => setIsRequired(e.target.value)}
                                    sx={{ height: '45px' }}
                                >
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
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
                                            value={editFormField.values.options}
                                            onChange={editFormField.handleChange}
                                            onBlur={editFormField.handleBlur}
                                            error={editFormField.touched.options && Boolean(editFormField.errors.options)}
                                            helperText={editFormField.touched.options && editFormField.errors.options}
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

EditRegistrationFormModel.propTypes = {
    open: PropTypes.isRequired,
    onClose: PropTypes.isRequired,
    fieldId: PropTypes.isRequired,
};