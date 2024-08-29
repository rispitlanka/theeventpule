import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';

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
import { UserDataContext } from 'context';

export default function EditEvent() {
    const { id } = useParams();
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState([]);
    const [venuesData, setVenuesData] = useState([]);
    const [eventImagePreview, setEventImagePreview] = useState(null);
    const [eventImageChanged, setEventImageChanged] = useState(false);
    const [mainEventData, setMainEventdata] = useState([]);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState();
    const [selectedEndDate, setSelectedEndDate] = useState();
    const today = dayjs();

    const handleTimeChange = (newTime) => {
        setSelectedStartTime(newTime);
    };
    const handleDateChange = (date) => {
        setSelectedStartDate((date));
    }

    const handleEndTimeChange = (newTime) => {
        setSelectedEndTime(newTime);
    };
    const handleEndDateChange = (date) => {
        setSelectedEndDate((date));
    }

    const handleEventImageChange = (event) => {
        const file = event.currentTarget.files[0];
        editEvent.setFieldValue('eventImage', file);
        setEventImagePreview(URL.createObjectURL(file));
        setEventImageChanged(true);
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            if (eventImageChanged && editEvent.values.eventImage) {
                const file = editEvent.values.eventImage;

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
            const formattedTime = dayjs(selectedStartTime).format('hh:mm A');
            const formattedDate = dayjs(selectedStartDate).format('YYYY-MM-DD');
            const formattedEndTime = dayjs(selectedEndTime).format('hh:mm A');
            const formattedEndDate = dayjs(selectedEndDate).format('YYYY-MM-DD');
            values.startTime = formattedTime;
            values.date = formattedDate;
            values.endTime = formattedEndTime;
            values.endDate = formattedEndDate;
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
            endDate: '',
            startTime: '',
            endTime: '',
            contactEmail: '',
            contactPhone: '',
            venueId: '',
            isActive: '',
            isFree: '',
            eventImage: '',
            mainEventId: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            categoryId: Yup.mixed().required('Category is required'),
            venueId: Yup.mixed().required('Venue is required'),
            contactPhone: Yup.string()
                .required('Required')
                .min(10, 'Not a valid phone number')
                .max(10, 'Not a valid phone number'),
            contactEmail: Yup.string()
                .required('Email is required')
                .email('Enter a valid Email'),
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
            throw new Error('Error fetching data:', error.message);
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
                        endDate: event.endDate,
                        startTime: event.startTime,
                        endTime: event.endTime,
                        contactEmail: event.contactEmail,
                        contactPhone: event.contactPhone,
                        venueId: event.venueId,
                        isActive: event.isActive,
                        isFree: event.isFree,
                        eventImage: event.eventImage,
                        mainEventId: event.mainEventId,
                    });
                    setEventImagePreview(event.eventImage);
                    setSelectedStartDate(event.date);
                    setSelectedEndDate(event.endDate);
                    const parsedStartTime = dayjs().startOf('day').set('hour', dayjs(event.startTime, "HH:mm:ss").hour())
                        .set('minute', dayjs(event.startTime, "HH:mm:ss").minute())
                        .set('second', dayjs(event.startTime, "HH:mm:ss").second());
                    setSelectedStartTime(parsedStartTime);
                    const parsedEndTime = dayjs().startOf('day').set('hour', dayjs(event.endTime, "HH:mm:ss").hour())
                        .set('minute', dayjs(event.endTime, "HH:mm:ss").minute())
                        .set('second', dayjs(event.endTime, "HH:mm:ss").second());
                    setSelectedEndTime(parsedEndTime);
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
        fetchMainEventData();
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
                                <Grid container spacing={5} display={'flex'} flexDirection={'row'}>
                                    <Grid item xs={6}>
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
                                            <FormControl fullWidth error={Boolean(editEvent.touched.categoryId && editEvent.errors.categoryId)}>
                                                <InputLabel>Select Category</InputLabel>
                                                <Select
                                                    label="Select Category"
                                                    name="categoryId"
                                                    value={editEvent.values.categoryId}
                                                    onChange={(e) => editEvent.setFieldValue('categoryId', e.target.value)}
                                                    onBlur={editEvent.handleBlur}
                                                    sx={{ height: '45px' }}
                                                >
                                                    {categoryData?.map((category) => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {editEvent.touched.categoryId && editEvent.errors.categoryId && (
                                                    <FormHelperText>{editEvent.errors.categoryId}</FormHelperText>
                                                )}
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
                                            <FormControl fullWidth error={Boolean(editEvent.touched.venueId && editEvent.errors.venueId)}>
                                                <InputLabel>Select Venue</InputLabel>
                                                <Select
                                                    label="Select Venue"
                                                    name="venueId"
                                                    value={editEvent.values.venueId}
                                                    onChange={(e) => editEvent.setFieldValue('venueId', e.target.value)}
                                                    onBlur={editEvent.handleBlur}
                                                    sx={{ height: '45px' }}
                                                >
                                                    {venuesData?.map((venue) => (
                                                        <MenuItem key={venue.id} value={venue.id}>
                                                            {venue.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {editEvent.touched.venueId && editEvent.errors.venueId && (
                                                    <FormHelperText>{editEvent.errors.venueId}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </MDBox>
                                        <MDBox p={1}>
                                            <FormControl fullWidth>
                                                <InputLabel>Select Main Event</InputLabel>
                                                <Select
                                                    label="Select Main Event"
                                                    name="mainEventId"
                                                    value={editEvent.values.mainEventId}
                                                    onChange={(e) => editEvent.setFieldValue('mainEventId', e.target.value)}
                                                    onBlur={editEvent.handleBlur}
                                                    sx={{ height: '45px' }}
                                                >
                                                    <MenuItem value={null}>Null</MenuItem>
                                                    {mainEventData?.map((event) => (
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
                                                                disablePast
                                                                label="Select Start Date"
                                                                value={dayjs(selectedStartDate)}
                                                                onChange={handleDateChange}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </MDBox>
                                                <MDBox sx={{ ml: 2 }}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['MobileTimePicker']}>
                                                            <MobileTimePicker
                                                                label={'Start Time'}
                                                                openTo="hours"
                                                                value={selectedStartTime}
                                                                onChange={handleTimeChange}
                                                                minTime={selectedStartDate && dayjs(selectedStartDate).isSame(today, 'day') ? today : null}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </MDBox>
                                            </Grid>
                                        </MDBox>
                                        <MDBox ml={1} mb={1}>
                                            <Grid sx={{ display: 'flex', flexDirection: 'row', }}>
                                                <MDBox sx={{ mr: 2 }}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker
                                                                disablePast
                                                                label="Select End Date"
                                                                value={dayjs(selectedEndDate)}
                                                                onChange={handleEndDateChange}
                                                                minDate={dayjs(selectedStartDate)}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </MDBox>
                                                <MDBox sx={{ ml: 2 }}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['MobileTimePicker']}>
                                                            <MobileTimePicker
                                                                label={'End Time'}
                                                                openTo="hours"
                                                                value={selectedEndTime}
                                                                onChange={handleEndTimeChange}
                                                                minTime={
                                                                    selectedStartDate &&
                                                                        selectedEndDate &&
                                                                        dayjs(selectedStartDate).isSame(selectedEndDate, 'day') &&
                                                                        selectedStartTime
                                                                        ? selectedStartTime
                                                                        : null
                                                                }
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </MDBox>
                                            </Grid>
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={6}>
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
                                                                onChange={handleEventImageChange}
                                                            />
                                                        </MDButton>
                                                    </MDBox>
                                                    {editEvent.touched.eventImage && editEvent.errors.eventImage && (
                                                        <MDTypography color="error">{editEvent.errors.eventImage}</MDTypography>
                                                    )}
                                                </Grid>
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