import { Dialog, DialogTitle, Grid, List, ListItem, ListItemText, TextField } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import MDButton from 'components/MDButton';

export default function EditShowsModel({ open, onClose, showsDataProps }) {
    const [selectedTime, setSelectedTime] = useState(null);
    const [showFormFields, setShowFormFields] = useState(false);
    const [listOfShows, setListOfShows] = useState([]);

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('en-US', options);
    };

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };

    const newShowTime = useFormik({
        initialValues: {
            name: '',
            time: '',
            type: 'special',
            screenId: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const formattedTime = dayjs(selectedTime).format('hh:mm A');
                values.time = formattedTime;
                values.screenId = showsDataProps && showsDataProps[0].screenId;
                resetForm();
            } catch (error) {
                console.error('Error submitting form:', error.message);
                setError(error.message);
            }
        },
    });

    const handleClose = () => {
        onClose();
        newShowTime.resetForm();
        setSelectedTime(null);
        setShowFormFields(false);
        setListOfShows([]);
    };

    const handleAddShow = () => {
        setShowFormFields(true);
    }

    function convertTo24HourFormat(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');    
        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        }    
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }    
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    }

    const handleSave = async () => {
        try {
            if (listOfShows && showsDataProps && showsDataProps.shows) {
                listOfShows.forEach(show => {
                    const newShow = {
                        name: show.name,
                        time: convertTo24HourFormat(show.time),
                        screenId: show.screenId,
                        type: show.type
                    };
                    showsDataProps.shows.push(newShow);
                });
            }
            handleClose();
        } catch (error) {
            console.error('Error saving shows:', error.message);
        }
    };

    const handleAdd = async () => {
        try {
            const newShow = {
                name: newShowTime.values.name,
                time: dayjs(selectedTime).format('HH:mm A'),
                screenId: showsDataProps && showsDataProps.shows && showsDataProps.shows.length > 0 ? showsDataProps.shows[0].screenId : null,
                type: 'special',
            };
            const updatedListOfShows = [...listOfShows];
            updatedListOfShows.push(newShow);
            setListOfShows(updatedListOfShows);
            setShowFormFields(false);
            newShowTime.resetForm();
            setSelectedTime(null);
        } catch (error) {
            console.error('Error adding show:', error.message);
        }
    };

    const handleCancelAdd = () => {
        setShowFormFields(false);
        newShowTime.resetForm();
        setSelectedTime(null);
    }

    return (
        <Dialog onClose={handleClose} open={open} fullWidth>
            <DialogTitle> Existing Shows</DialogTitle>
            <List>
                {showsDataProps && showsDataProps.shows.map((show, index) => (
                    <ListItem disableGutters key={index}>
                        <ListItemText primary={`${show.name}`} secondary={`${formattedTime(show.time)}`} sx={{ ml: 2 }} />
                    </ListItem>
                ))}
                {listOfShows && listOfShows.map((show, index) => (
                    <ListItem disableGutters key={index}>
                        <ListItemText primary={`${show.name}`} secondary={`${show.time}`} sx={{ ml: 2 }} />
                    </ListItem>
                ))}
            </List>
            <DialogTitle onClick={handleAddShow} style={{ cursor: 'pointer' }}> Add Show</DialogTitle>
            {showFormFields &&
                <form onSubmit={newShowTime.handleSubmit}>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 1 }}>
                        <MDBox sx={{ p: 1, mr: 3 }}>
                            <TextField
                                variant="outlined"
                                id="outlined-basic"
                                label="Name"
                                name="name"
                                value={newShowTime.values.name}
                                onChange={newShowTime.handleChange}
                                onBlur={newShowTime.handleBlur}
                                error={newShowTime.touched.name && Boolean(newShowTime.errors.name)}
                                helperText={newShowTime.touched.name && newShowTime.errors.name}
                            />
                        </MDBox>
                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ p: 1 }}>
                            <DemoContainer components={['MobileTimePicker']}>
                                <MobileTimePicker
                                    label={'Time'}
                                    openTo="hours"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid container justifyContent="flex-end" p={1}>
                        {showFormFields &&
                            <>
                                <MDButton onClick={handleAdd} sx={{ mr: 1 }}>Add</MDButton>
                                <MDButton onClick={handleCancelAdd} sx={{ mr: 1 }}>Cancel</MDButton>
                            </>
                        }
                    </Grid>
                </form>
            }
            <Grid container justifyContent="flex-end" p={1}>
                {!showFormFields &&
                    <>
                        <MDButton onClick={handleSave} sx={{ mr: 1 }}>Update</MDButton>
                        <MDButton onClick={handleClose}>Cancel</MDButton>
                    </>
                }
            </Grid>
        </Dialog>
    )
}

EditShowsModel.propTypes = {
    open: PropTypes.isRequired,
    onClose: PropTypes.isRequired,
    showsDataProps: PropTypes.isRequired,
};