import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';
import { UserDataContext } from 'context';

export default function AddEvent() {
    const navigate = useNavigate();
    const userDetails = useContext(UserDataContext);
    const userTheatreId = userDetails[0].theatreId;
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedScreenId, setSelectedScreenId] = useState();
    const [screensData, setScreensData] = useState([]);

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };
    const handleDateChange = (date) => {
        setSelectedDate((date));
    }

    const onSubmit = async (values, { resetForm }) => {
        try {
            const formattedTime = dayjs(selectedTime).format('hh:mm A');
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            values.startTime = formattedTime;
            values.date = formattedDate;
            values.screenId = selectedScreenId;
            values.theatreId = userTheatreId;
            await addEventData(values);
            resetForm();
            toast.info('Event has been successfully created!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const newEvent = useFormik({
        initialValues: {
            name: '',
            description: '',
            status: '',
            category: '',
            location: '',
            date: '',
            startTime: '',
            price: '',
            contactEmail: '',
            contactPhone: '',
            screenId: '',
            theatreId: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const addEventData = async (values) => {
        try {
            const { data, error } = await supabase.from('events').insert([values]).select('*');
            if (data) {
                console.log('Data added succesfully:', data);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };

    const fetchScreensData = async () => {
        try {
            const { data, error } = await supabase.from('screens').select('*').eq('theatreId', userTheatreId);
            if (error) throw error;
            if (data) {
                setScreensData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchScreensData();
        selectedScreenId
    }, [])

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={newEvent.handleSubmit}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                            >
                                <MDTypography variant="h6" color="white">
                                    Add New Event
                                </MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Name"
                                        name="name"
                                        value={newEvent.values.name}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.name && Boolean(newEvent.errors.name)}
                                        helperText={newEvent.touched.name && newEvent.errors.name} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Description"
                                        name="description"
                                        value={newEvent.values.description}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.description && Boolean(newEvent.errors.description)}
                                        helperText={newEvent.touched.description && newEvent.errors.description} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Status"
                                        name="status"
                                        value={newEvent.values.status}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.status && Boolean(newEvent.errors.status)}
                                        helperText={newEvent.touched.status && newEvent.errors.status} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Category"
                                        name="category"
                                        value={newEvent.values.category}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.category && Boolean(newEvent.errors.category)}
                                        helperText={newEvent.touched.category && newEvent.errors.category} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Location"
                                        name="location"
                                        value={newEvent.values.location}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.location && Boolean(newEvent.errors.location)}
                                        helperText={newEvent.touched.location && newEvent.errors.location} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Price"
                                        name="price"
                                        value={newEvent.values.price}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.price && Boolean(newEvent.errors.price)}
                                        helperText={newEvent.touched.price && newEvent.errors.price} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Contact Email"
                                        name="contactEmail"
                                        value={newEvent.values.contactEmail}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.contactEmail && Boolean(newEvent.errors.contactEmail)}
                                        helperText={newEvent.touched.contactEmail && newEvent.errors.contactEmail} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Contact Phone"
                                        name="contactPhone"
                                        value={newEvent.values.contactPhone}
                                        onChange={newEvent.handleChange}
                                        onBlur={newEvent.handleBlur}
                                        error={newEvent.touched.contactPhone && Boolean(newEvent.errors.contactPhone)}
                                        helperText={newEvent.touched.contactPhone && newEvent.errors.contactPhone} />
                                </MDBox>
                                <MDBox p={1}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Screen</InputLabel>
                                        <Select
                                            label="Select Screen"
                                            value={selectedScreenId}
                                            onChange={(e) => setSelectedScreenId(e.target.value)}
                                            sx={{ height: '45px' }}
                                        >
                                            {screensData.map((screen) => (
                                                <MenuItem key={screen.id} value={screen.id}>
                                                    {screen.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </MDBox>
                                <MDBox ml={1} mb={1}>
                                    <Grid sx={{ display: 'flex', flexDirection: 'row', }}>
                                        <MDBox sx={{ mr: 2 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        label="Select Date"
                                                        value={selectedDate}
                                                        onChange={handleDateChange}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </MDBox>
                                        <MDBox sx={{ ml: 2 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['MobileTimePicker']}>
                                                    <MobileTimePicker
                                                        label={'Time'}
                                                        openTo="hours"
                                                        value={selectedTime}
                                                        onChange={handleTimeChange}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </MDBox>
                                    </Grid>
                                </MDBox>
                                <MDBox p={1}>
                                    <MDButton color='info' type='submit'>Save</MDButton>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </form>
                </Grid>
            </Grid>
        </MDBox>
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </DashboardLayout>
    )
}
