import React from 'react';
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
    Button,
    Box,
    Typography
} from '@mui/material';
import { supabase } from 'pages/supabaseClient';

const renderField = (field) => {
    switch (field.type) {
        case 'Text':
            return <Field as={TextField} fullWidth name={field.name} type="text" variant="outlined" />;
        case 'Number':
            return <Field as={TextField} fullWidth name={field.name} type="number" variant="outlined" />;
        case 'radio':
            return (
                <FormControl component="fieldset">
                    <FormLabel component="legend">{field.name}</FormLabel>
                    <RadioGroup row>
                        {field.options.split(',').map((option) => (
                            <FormControlLabel
                                key={option}
                                control={<Field as={Radio} type="radio" />}
                                label={option}
                                value={option}
                                name={field.name}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            );
        case 'select':
            return (
                <Field name={field.name}>
                    {({ field: { value, name }, form: { setFieldValue } }) => (
                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={value}
                                onChange={(e) => setFieldValue(name, e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select an option</em>
                                </MenuItem>
                                {field.options.split(',').map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Field>
            );
        case 'Date':
            return <Field as={TextField} fullWidth name={field.name} type="date" variant="outlined" InputLabelProps={{ shrink: true }} />;
        case 'checkbox':
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

    const handleSubmit = async (values, { resetForm }) => {
        try {
            values.details = JSON.stringify(values);
            const dataToAdd = {
                eventId: eventId,
                details: values.details,
            }
            await addRegistrationData(dataToAdd);
            resetForm();
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
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values }) => (
                <Form>
                    <Box sx={{ padding: '20px', border: '1px solid black', marginTop: '10px' }}>
                        {fields.map((field) => (
                            <Box key={field.name} sx={{ marginBottom: '20px' }}>
                                <Typography variant="h6" component="label">
                                    {field.name}
                                </Typography>
                                {renderField(field)}
                            </Box>
                        ))}
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default DynamicForm;

DynamicForm.propTypes = {
    fields: PropTypes.isRequired,
    eventId: PropTypes.isRequired,
};