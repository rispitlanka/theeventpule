import React, { useEffect, useState } from 'react';
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
    Typography,
} from '@mui/material';
import { supabase } from 'pages/supabaseClient';
import MDButton from 'components/MDButton';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ShortUniqueId from 'short-unique-id';
import QRCode from 'qrcode';
import MDTypography from 'components/MDTypography';


const renderField = (field) => {
    switch (field.type) {
        case 'Text':
            return <Field as={TextField} fullWidth name={field.name} type="text" variant="outlined" />;
        case 'Number':
            return <Field as={TextField} fullWidth name={field.name} type="number" variant="outlined" />;
        case 'Phone':
            return <Field as={TextField} fullWidth name={field.name} type="tel" variant="outlined" />;
        case 'Email':
            return <Field as={TextField} fullWidth name={field.name} type="email" variant="outlined" />;
        case 'Image':
            return <Box marginTop={1}><img src={field.formImage} width="150" height="200" /></Box>;
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

const DynamicForm = ({ fields, eventId, venueId, eventName, venueName, date, time, zoneId, categoryId, price, eventOrganizationId, bookedBy }) => {
    const uid = new ShortUniqueId({ dictionary: 'number', length: 6 });
    const [stageIds, setStageIds] = useState([]);
    const navigate = useNavigate();

    const initialValues = fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});


    const validate = (values) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9]\d{1,9}$/;

        fields.forEach((field) => {
            if (!values[field.name]) {
                errors[field.name] = `${field.name} is required`;
            }
            if (field.type === 'Email' && values[field.name]) {
                if (!emailRegex.test(values[field.name])) {
                    errors[field.name] = `${field.name} must be a valid email address`;
                }
            }
            if (field.type === 'Phone' && values[field.name]) {
                if (!phoneRegex.test(values[field.name])) {
                    errors[field.name] = `${field.name} must be a valid phone number`;
                }
            }
        });

        return errors;
    };

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const { data, error } = await supabase.from('stages').select('id').eq('eventId', eventId);
                if (error) throw error;
                if (data) {
                    setStageIds(data)
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchStages();
    }, [eventId])

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const dataToAdd = {
                eventId: eventId,
                details: JSON.stringify(values),
            };

            const registrationData = await addRegistrationData(dataToAdd);

            if (registrationData && registrationData.length > 0) {
                await addTicketData({
                    registrationId: registrationData[0].id,
                    eventId,
                    venueId,
                    zoneId,
                    categoryId,
                    eventOrganizationId,
                    bookedBy,
                });

                resetForm();
                toast.info('Entries have been successfully registered!');
                document.activeElement.blur();
            }
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const addRegistrationData = async (dataToAdd) => {
        try {
            const { data, error } = await supabase.from('eventRegistrations').insert(dataToAdd).select('*');
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding registration data:', error.message);
            throw error;
        }
    };

    const addTicketData = async ({ registrationId, eventId, venueId, zoneId, categoryId, eventOrganizationId, bookedBy }) => {
        const refId = uid.rnd();
        try {
            const dataToInsert = {
                registrationId,
                eventId,
                venueId,
                zoneId,
                categoryId,
                referenceId: refId,
                price,
                eventOrganizationId,
                bookedBy,
                totalPrice: price,
            };

            const { data, error } = await supabase.from('tickets_events').insert(dataToInsert).select('*');
            if (error) throw error;

            if (data?.length > 0) {

                if (stageIds?.length > 0) {
                    await insertStageParticipants(data);
                }

                const qrCodes = await generateQRCodesForTickets(data[0].referenceId, data[0].eventId, data[0].id);

                navigate(`/eventBookings/book-ticket/ticket-view`, { state: { bookedTicketsData: data, qrCodes, eventName, venueName, date, time } });
            }
        } catch (error) {
            console.error('Error in booking tickets:', error.message);
            throw error;
        }
    };

    const insertStageParticipants = async (tickets) => {
        try {
            const stageParticipantsData = tickets.flatMap(ticket =>
                stageIds.map(stage => ({
                    stageId: stage.id,
                    ticketId: ticket.id,
                    eventId: ticket.eventId,
                    referenceId: ticket.referenceId,
                }))
            );

            const { data, error } = await supabase.from('stage_participants').insert(stageParticipantsData).select('*');
            if (error) {
                console.error('Error inserting into stage_participants:', error.message);
            } else {
                console.log('Stage participants added successfully:', data);
            }
        } catch (error) {
            console.error('Error in insertStageParticipants:', error.message);
        }
    };

    const generateQRCodesForTickets = async (referenceId, eventId, ticketId) => {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(String(`ReferenceID:${referenceId} && EventID:${eventId} && TicketID:${ticketId}`));
            return qrCodeDataUrl;
        } catch (err) {
            console.log('Error generating QR code:', err);
        }
    }

    return (
        <>
            <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
                {({ values, errors, touched }) => (
                    <Form>
                        <Box sx={{}}>
                            {fields.map((field) => (
                                <Box key={field.name} sx={{ marginBottom: '10px' }}>
                                    <Typography variant="h6" component="label">
                                        {field.name}
                                    </Typography>
                                    {renderField(field)}
                                    {errors[field.name] && touched[field.name] && (
                                        <Typography variant="body2" color="error">
                                            {errors[field.name]}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                            <MDTypography sx={{ marginTop: '10px' }} variant='h6' color='warning' fontWeight='light'>{!categoryId && 'Select any ticket zone and category to continue...'}</MDTypography>
                            <MDButton sx={{ marginTop: '10px' }} ariant="contained" type="submit" color='info' disabled={!categoryId}>
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
    venueId: PropTypes.isRequired,
    eventName: PropTypes.isRequired,
    date: PropTypes.isRequired,
    time: PropTypes.isRequired,
    zoneId: PropTypes.isRequired,
    categoryId: PropTypes.isRequired,
    eventOrganizationId: PropTypes.isRequired,
    price: PropTypes.isRequired,
    venueName: PropTypes.isRequired,
    eventOrganizationId: PropTypes.isRequired,
    bookedBy: PropTypes.isRequired,
};