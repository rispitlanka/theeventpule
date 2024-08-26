import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormControl, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';

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
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedVenueId, setSelectedVenueId] = useState();
    const [selectedCategoryId, setSelectedCategoryId] = useState();
    const [venuesData, setVenuesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [mainEventData, setMainEventdata] = useState([]);
    const [selectedMainEventId, setSelectedMainEventId] = useState(null);
    const [eventImagePreview, setEventImagePreview] = useState(null);

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };
    const handleDateChange = (date) => {
        setSelectedDate((date));
    }

    const handleEventImagePreview = (event) => {
        const file = event.currentTarget.files[0];
        newEvent.setFieldValue('eventImage', file);
        setEventImagePreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            if (newEvent.values.eventImage) {
                const file = newEvent.values.eventImage;

                const { data: imageData, error: imageError } = await supabase.storage
                    .from('events_images')
                    .upload(`${file.name}`, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (imageError) {
                    throw imageError;
                }

                if (imageData) {
                    const imgURL = supabase.storage.from('events_images').getPublicUrl(imageData.path);
                    values.eventImage = imgURL.data.publicUrl;
                } else {
                    throw new Error('Failed to upload image');
                }
            }
            const formattedTime = dayjs(selectedTime).format('hh:mm A');
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            values.startTime = formattedTime;
            values.date = formattedDate;
            values.categoryId = selectedCategoryId;
            values.venueId = selectedVenueId;
            values.mainEventId = selectedMainEventId;
            values.eventOrganizationId = userOrganizationId;
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
            categoryId: '',
            date: '',
            startTime: '',
            contactEmail: '',
            contactPhone: '',
            venueId: '',
            eventOrganizationId: '',
            mainEventId: '',
            isActive: true,
            isFree: false,
            eventImage: '',
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
                console.log('Data added succesfully:');
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
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

    const fetchMainEventData = async () => {
        try {
            const { data, error } = await supabase.from('mainEvent').select('*').eq('eventOrganizationId', userOrganizationId);
            if (data) {
                setMainEventdata(data);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };

    useEffect(() => {
        fetchVenuesData();
        fetchCategoryData();
        fetchMainEventData();
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
                                <Grid container spacing={5} display={'flex'} flexDirection={'row'}>

                                    <Grid item xs={6}>
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
                                            <FormControl fullWidth>
                                                <InputLabel>Select Category</InputLabel>
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
                                            </FormControl>
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
                                                <InputLabel>Select Venue</InputLabel>
                                                <Select
                                                    label="Select Venue"
                                                    value={selectedVenueId}
                                                    onChange={(e) => setSelectedVenueId(e.target.value)}
                                                    sx={{ height: '45px' }}
                                                >
                                                    {venuesData.map((venue) => (
                                                        <MenuItem key={venue.id} value={venue.id}>
                                                            {venue.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </MDBox>
                                        <MDBox p={1}>
                                            <FormControl fullWidth>
                                                <InputLabel>Select Main Event</InputLabel>
                                                <Select
                                                    label="Select Main Event"
                                                    value={selectedMainEventId}
                                                    onChange={(e) => setSelectedMainEventId(e.target.value)}
                                                    sx={{ height: '45px' }}
                                                >
                                                    <MenuItem value={null}>Null</MenuItem>
                                                    {mainEventData.map((event) => (
                                                        <MenuItem key={event.id} value={event.id}>
                                                            {event.title}
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
                                    </Grid>

                                    <Grid item xs={6} >
                                        <MDBox p={1}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                                                    <MDTypography>Event Image</MDTypography>
                                                    {eventImagePreview ? (
                                                        <MDBox
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
                                                            <img src={eventImagePreview} alt="Theatre Preview" style={{ width: '100%', maxHeight: '100px' }} />
                                                        </MDBox>
                                                    ) : (
                                                        <MDBox
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            border="1px dashed"
                                                            borderRadius="4px"
                                                            width="50%"
                                                            maxHeheight="200px"
                                                            mb={1}
                                                            height="100px"
                                                        >
                                                            <ImageIcon />
                                                        </MDBox>
                                                    )}
                                                    <MDBox display="flex" justifyContent='left'>
                                                        <MDButton
                                                            size="small"
                                                            variant="outlined"
                                                            component="label"
                                                            color="info"
                                                            startIcon={<UploadIcon />}
                                                        >
                                                            Upload
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={handleEventImagePreview}
                                                            />
                                                        </MDButton>
                                                    </MDBox>
                                                    {newEvent.touched.eventImage && newEvent.errors.eventImage && (
                                                        <MDTypography color="error">{newEvent.errors.eventImage}</MDTypography>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </MDBox>
                                        <MDBox p={1}>
                                            <MDTypography fontWeight={'light'}>
                                                Status:
                                                <Switch label="Status" checked={newEvent.values.isActive} onChange={(e) => newEvent.setFieldValue('isActive', e.target.checked)} />
                                                {newEvent.values.isActive ? 'Active' : 'Inactive'}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox p={1}>
                                            <MDTypography fontWeight={'light'}>
                                                Ticket:
                                                <Switch label="Ticket" checked={newEvent.values.isFree} onChange={(e) => newEvent.setFieldValue('isFree', e.target.checked)} />
                                                {newEvent.values.isFree ? 'Free' : 'Paid'}
                                            </MDTypography>
                                        </MDBox>
                                    </Grid>
                                </Grid>

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
