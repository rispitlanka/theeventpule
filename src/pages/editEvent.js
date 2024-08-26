import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormControl, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { useNavigate, useParams } from 'react-router-dom';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedVenueId, setSelectedVenueId] = useState();
    const [selectedCategoryId, setSelectedCategoryId] = useState();
    const [categoryData, setCategoryData] = useState([]);
    const [venuesData, setVenuesData] = useState([]);

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
            values.categoryId = selectedCategoryId;
            values.venueId = selectedVenueId;
            await editEventData(values);
            resetForm();
            toast.info('Event has been successfully updated!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const editEvent = useFormik({
        initialValues: {
            name: '',
            description: '',
            categoryId: '',
            date: '',
            startTime: '',
            contactEmail: '',
            contactPhone: '',
            venueId: '',
            isActive: '',
            isFree: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const editEventData = async (values) => {
        try {
            const { data, error } = await supabase.from('events').update([values]).select('*').eq('id', id);
            if (data) {
                console.log('Data updated succesfully:');
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error updating data:', error.message);
        }
    };

    const fetchVenuesData = async () => {
        try {
            const { data, error } = await supabase.from('venues').select('*').eq('isActive', true);
            if (error) throw error;
            if (data) {
                setVenuesData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategoryData = async () => {
        try {
            const { data, error } = await supabase.from('event_categories').select('*');
            if (error) throw error;
            if (data) {
                setCategoryData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const { data, error } = await supabase.from('events').select('*').eq('id', id);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const event = data[0];
                    editEvent.setValues({
                        name: event.name,
                        description: event.description,
                        categoryId: event.categoryId,
                        date: event.date,
                        startTime: event.startTime,
                        contactEmail: event.contactEmail,
                        contactPhone: event.contactPhone,
                        venueId: event.venueId,
                        isActive: event.isActive,
                        isFree: event.isFree,
                    });
                    setSelectedVenueId(event.venueId);
                    setSelectedCategoryId(event.categoryId);
                }
            } catch (error) {
                console.error('Error fetching event data:', error.message);
            }
        };

        fetchEventData();
    }, [id]);

    useEffect(() => {
        fetchVenuesData();
        fetchCategoryData();
    }, [])

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={editEvent.handleSubmit}>
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
                                    Edit Event
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
                                        value={editEvent.values.name}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.name && Boolean(editEvent.errors.name)}
                                        helperText={editEvent.touched.name && editEvent.errors.name} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Description"
                                        name="description"
                                        value={editEvent.values.description}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.description && Boolean(editEvent.errors.description)}
                                        helperText={editEvent.touched.description && editEvent.errors.description} />
                                </MDBox>
                                <MDBox p={1}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Category</InputLabel>
                                        {selectedCategoryId &&
                                            <Select
                                                label="Select Category"
                                                value={selectedCategoryId}
                                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                                sx={{ height: '45px' }}
                                            >
                                                {categoryData.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        }
                                    </FormControl>
                                </MDBox>                               
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Contact Email"
                                        name="contactEmail"
                                        value={editEvent.values.contactEmail}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.contactEmail && Boolean(editEvent.errors.contactEmail)}
                                        helperText={editEvent.touched.contactEmail && editEvent.errors.contactEmail} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Contact Phone"
                                        name="contactPhone"
                                        value={editEvent.values.contactPhone}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.contactPhone && Boolean(editEvent.errors.contactPhone)}
                                        helperText={editEvent.touched.contactPhone && editEvent.errors.contactPhone} />
                                </MDBox>
                                <MDBox p={1}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Venue</InputLabel>
                                        {selectedVenueId && (
                                            <Select
                                                label='Select Venue'
                                                value={selectedVenueId}
                                                onChange={(e) => setSelectedVenueId(e.target.value)}
                                                sx={{ height: '45px' }}
                                            >
                                                {venuesData && venuesData.map((venue) => (
                                                    <MenuItem key={venue.id} value={venue.id}>
                                                        {venue.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                </MDBox>
                                <MDBox ml={1} mb={1}>
                                    <Grid sx={{ display: 'flex', flexDirection: 'row', }}>
                                        <MDBox sx={{ mr: 2 }} >
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
                                    <MDTypography fontWeight={'light'}>
                                        Status:
                                        <Switch label="Status" checked={editEvent.values.isActive} onChange={(e) => editEvent.setFieldValue('isActive', e.target.checked)} />
                                        {editEvent.values.isActive ? 'Active' : 'Inactive'}
                                    </MDTypography>
                                </MDBox>
                                <MDBox p={1}>
                                    <MDTypography fontWeight={'light'}>
                                        Ticket:
                                        <Switch label="Ticket" checked={editEvent.values.isFree} onChange={(e) => editEvent.setFieldValue('isFree', e.target.checked)} />
                                        {editEvent.values.isFree ? 'Free' : 'Paid'}
                                    </MDTypography>
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