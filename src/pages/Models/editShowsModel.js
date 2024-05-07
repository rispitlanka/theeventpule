import { Dialog, DialogTitle, Grid, List, ListItem, ListItemText, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from 'pages/supabaseClient';
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
import { useNavigate } from 'react-router-dom';

export default function EditShowsModel({ open, onClose, showsDataProps, onUpdateShowsData }) {
    const [selectedTime, setSelectedTime] = useState(null);
    const navigate = useNavigate();
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
                await addShowTimeData(values);
                resetForm();
                console.log('hi')
            } catch (error) {
                console.error('Error submitting form:', error.message);
                setError(error.message);
            }
        },
    });

    const addShowTimeData = async (values) => {
        try {
            const { data, error } = await supabase.from('showTime').insert([values]).select('*');
            if (data) {
                console.log('Data inserted successfully:', data);
            }
            if (error) {
                throw error;
            }

        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };

    const updateShowsDataProps = () => {
        const newData = {
            name: newShowTime.values.name,
            time: dayjs(selectedTime).format('hh:mm A'),
            screenId: showsDataProps && showsDataProps.shows && showsDataProps.shows.length > 0 ? showsDataProps.shows[0].screenId : null,
            type: 'special',
        };
        const updatedData = showsDataProps
            ? {
                ...showsDataProps,
                shows: showsDataProps.shows ? [...showsDataProps.shows, newData] : [newData]
            }
            : {
                shows: [newData]
            };
        onUpdateShowsData(updatedData);
        newShowTime.resetForm();

    }

    useEffect(() => {
        showsDataProps
    }, [onUpdateShowsData]);
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth>
            <DialogTitle> Existing Shows</DialogTitle>
            <List>
                {showsDataProps && showsDataProps.shows.map((show, index) => (
                    <ListItem disableGutters key={index}>
                        <ListItemText primary={`${show.name}`} secondary={`${show.time}`} sx={{ ml: 2 }} />
                    </ListItem>
                ))}
            </List>
            <DialogTitle> Add Show</DialogTitle>
            <form ref={newShowTimeFormRef} onSubmit={newShowTime.handleSubmit}>
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
                    <MDButton onClick={updateShowsDataProps} sx={{ mr: 1 }}>Update</MDButton>
                    <MDButton onClick={handleClose}>Cancel</MDButton>
                </Grid>
            </form>
        </Dialog>
    )
}

EditShowsModel.propTypes = {
    open: PropTypes.isRequired,
    onClose: PropTypes.isRequired,
    showsDataProps: PropTypes.isRequired,
    onUpdateShowsData: PropTypes.isRequired,
};