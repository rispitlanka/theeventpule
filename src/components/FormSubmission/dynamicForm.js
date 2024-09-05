import React, { useEffect, useRef, useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { supabase } from 'pages/supabaseClient';
import MDButton from 'components/MDButton';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ShortUniqueId from 'short-unique-id';
import ReactToPrint from 'react-to-print';

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

const DynamicForm = ({ fields, eventId, venueId, eventName, date, time, zoneId, categoryId, price }) => {
    const uid = new ShortUniqueId({ dictionary: 'number', length: 6 });
    const [qrCodes, setQrCodes] = useState({});
    const [bookedTicketsData, setBookedTicketsData] = useState([]);
    const [open, setOpen] = useState(false);
    const [stageIds, setStageIds] = useState([]);

    const initialValues = fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});

    const navigate = useNavigate();

    const validate = (values) => {
        const errors = {};
        fields.forEach((field) => {
            if (!values[field.name]) {
                errors[field.name] = `${field.name} is required`;
            }
        });
        return errors;
    };

    useEffect(()=>{
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
    },[eventId])

    const handleSubmit = async (values, { resetForm }) => {
        try {
            // Prepare the data for registration
            const dataToAdd = {
                eventId: eventId,
                details: JSON.stringify(values),  // Directly stringify here
            };

            // Submit registration data and then submit ticket data using the registration ID
            const registrationData = await addRegistrationData(dataToAdd);

            if (registrationData && registrationData.length > 0) {
                // Use the registrationData to submit ticket data
                await addTicketData({
                    registrationId: registrationData[0].id,  // From the registration response
                    eventId: eventId,
                    venueId: venueId,
                    zoneId: zoneId,  // Assuming zoneId and categoryId are available in the context
                    categoryId: categoryId
                });

                console.log('Registration and Ticket Data processed successfully:', registrationData);
                resetForm();
                toast.info('Entries have been successfully registered!');
                document.activeElement.blur();
                // Optionally, navigate back
                // setTimeout(() => navigate(-1), 1500);
            }
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const addRegistrationData = async (dataToAdd) => {
        try {
            // Insert the registration data
            const { data, error } = await supabase.from('eventRegistrations').insert(dataToAdd).select('*');
            if (error) throw error;
            return data; // Return the registration data if successful
        } catch (error) {
            console.error('Error adding registration data:', error.message);
            throw error;  // Propagate error to handle it in handleSubmit
        }
    };

    const addTicketData = async ({ registrationId, eventId, venueId, zoneId, categoryId, eventOrganizationId }) => {
        const refId = uid.rnd();  // If a unique ID is needed for tickets
        try {
            // Data to insert into tickets_events
            const dataToInsert = {
                registrationId,
                eventId,
                venueId,
                zoneId,
                categoryId,
                referenceId: refId,
                eventOrganizationId: 1,
                price,
            };

            const { data, error } = await supabase.from('tickets_events').insert(dataToInsert).select('*');
            if (error) throw error;

            if (data?.length > 0) {
                setBookedTicketsData(data);  // Set booked ticket data
                toast.info('Tickets have been successfully booked!');
                handleClickOpen();  // Open the modal or dialog

                // Optionally, handle stage participants if there are any stage IDs
                if (stageIds?.length > 0) {
                    await insertStageParticipants(data);  // Separate function for better code structure
                }

                // Generate QR Codes for each ticket
                data.forEach(ticket => generateQRCode(ticket.id));
            }
        } catch (error) {
            console.log('Error in booking tickets:', error.message);
            throw error;  // Handle errors gracefully
        }
    };

    // Insert stage participants function (optional, separated for cleaner code)
    const insertStageParticipants = async (tickets) => {
        try {
            const stageParticipantsData = tickets.flatMap(ticket =>
                stageIds.map(stage => ({
                    stageId: stage.id,
                    ticketId: ticket.id,
                    eventId: ticket.eventId,
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

    // QR Code generation function (unchanged)
    const generateQRCode = async (id) => {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(String(id));
            setQrCodes(prevState => ({ ...prevState, [id]: qrCodeDataUrl }));
        } catch (err) {
            console.log('Error generating QR code:', err.message);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        navigate(-1);
    };

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
                            <MDButton sx={{ marginTop: '10px' }} ariant="contained" type="submit" color='info' >
                                Submit
                            </MDButton>
                        </Box>
                    </Form>
                )}
            </Formik>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Tickets Have Been SuccessFully Booked !
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to print tickets?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ReactToPrint trigger={() => <MDButton disabled={bookedTicketsData.length <= 0}>Yes</MDButton>} content={() => componentRef.current} onAfterPrint={handleClose} />
                    <MDButton onClick={handleClose}>No</MDButton>
                </DialogActions>
            </Dialog>

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
};