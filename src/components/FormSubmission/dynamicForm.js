import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import {
    TextField,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    MenuItem,
    Select,
    Checkbox,
    Box,
    Typography
} from '@mui/material';
import { supabase } from 'pages/supabaseClient';
import MDButton from 'components/MDButton';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const renderField = (field) => {
    switch (field.type) {
        case 'Text':
            return <Field as={TextField} fullWidth name={field.name} type="text" variant="outlined" />;
        case 'Number':
            return <Field as={TextField} fullWidth name={field.name} type="number" variant="outlined" />;
        case 'Radio':
            return (
                <FormControl component="fieldset">
                    <FormLabel component="legend">{field.name}</FormLabel>
                    <RadioGroup row>
                        {field.options.split(',').map((options) => (
                            <FormControlLabel
                                key={options}
                                control={<Field as={Radio} type="radio" />}
                                label={options}
                                value={options}
                                name={field.name}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            );
        case 'Select':
            return (
                <Field name={field.name}>
                    {({ field: { value, name }, form: { setFieldValue } }) => (
                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={value}
                                onChange={(e) => setFieldValue(name, e.target.value)}
                                displayEmpty
                                sx={{ height: '45px' }}
                            >
                                <MenuItem value="">
                                    <em>Select an option</em>
                                </MenuItem>
                                {field.options.split(',').map((options) => (
                                    <MenuItem key={options} value={options}>
                                        {options}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Field>
            );
        case 'Date':
            return <Field as={TextField} fullWidth name={field.name} type="date" variant="outlined" InputLabelProps={{ shrink: true }} />;
        case 'Checkbox':
            return (
                <FormControlLabel
                    control={<Field as={Checkbox} name={field.name} />}
                    label={field.options}
                />
            );
        case 'Password':
            return <Field as={TextField} fullWidth name={field.name} type="password" variant="outlined" />;
        default:
            return null;
    }
};

const DynamicForm = ({ fields, eventId }) => {
    const initialValues = fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});

    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        try {
            values.details = JSON.stringify(values);
            const dataToAdd = {
                eventId: eventId,
                details: values.details,
            }
            await addRegistrationData(dataToAdd);
            resetForm();
            toast.info('Entries have been successfully registered!');
            document.activeElement.blur();
            setTimeout(() => {
                navigate(-1)
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const addRegistrationData = async (dataToAdd) => {
        try {
            const { data, error } = await supabase.from('eventRegistrations').insert(dataToAdd).select('*');
            if (data) {
                console.log('Data added successfully:', data);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error adding data:', error.message);
        }
    };

    return (
        <>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form>
                        <Box sx={{}}>
                            {fields.map((field) => (
                                <Box key={field.name} sx={{ marginBottom: '10px' }}>
                                    <Typography variant="h6" component="label">
                                        {field.name}
                                    </Typography>
                                    {renderField(field)}
                                </Box>
                            ))}
                            <MDButton sx={{ marginTop: '10px' }} ariant="contained" type="submit" color='info' >
                                Submit
                            </MDButton>
                        </Box>
                    </Form>
                )}
            </Formik>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default DynamicForm;

DynamicForm.propTypes = {
    fields: PropTypes.isRequired,
    eventId: PropTypes.isRequired,
};