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
            status: '',
            category: '',
            location: '',
            date: '',
            startTime: '',
            price: '',
            contactEmail: '',
            contactPhone: '',
            organizer: '',
            screenId: '',
            isActive: '',
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
                console.log('Data updated succesfully:', data);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error updating data:', error.message);
        }
    };

    const fetchScreensData = async () => {
        try {
            const { data, error } = await supabase.from('screens').select('*');
            if (error) throw error;
            if (data) {
                setScreensData(data);
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
                    console.log('event data', data)
                    const event = data[0];
                    editEvent.setValues({
                        name: event.name,
                        description: event.description,
                        status: event.status,
                        category: event.category,
                        location: event.location,
                        date: event.date,
                        startTime: event.startTime,
                        price: event.price,
                        contactEmail: event.contactEmail,
                        contactPhone: event.contactPhone,
                        organizer: event.organizer,
                        screenId: event.screenId,
                        isActive: event.isActive,

                    });
                    setSelectedScreenId(event.screenId);
                }
            } catch (error) {
                console.error('Error fetching event data:', error.message);
            }
        };

        fetchEventData();
    }, [id]);

    useEffect(() => {
        fetchScreensData();
        selectedScreenId
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
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Status"
                                        name="status"
                                        value={editEvent.values.status}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.status && Boolean(editEvent.errors.status)}
                                        helperText={editEvent.touched.status && editEvent.errors.status} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Category"
                                        name="category"
                                        value={editEvent.values.category}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.category && Boolean(editEvent.errors.category)}
                                        helperText={editEvent.touched.category && editEvent.errors.category} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Location"
                                        name="location"
                                        value={editEvent.values.location}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.location && Boolean(editEvent.errors.location)}
                                        helperText={editEvent.touched.location && editEvent.errors.location} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Price"
                                        name="price"
                                        value={editEvent.values.price}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.price && Boolean(editEvent.errors.price)}
                                        helperText={editEvent.touched.price && editEvent.errors.price} />
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
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Organizer"
                                        name="organizer"
                                        value={editEvent.values.organizer}
                                        onChange={editEvent.handleChange}
                                        onBlur={editEvent.handleBlur}
                                        error={editEvent.touched.organizer && Boolean(editEvent.errors.organizer)}
                                        helperText={editEvent.touched.organizer && editEvent.errors.organizer} />
                                </MDBox>
                                {/* <MDBox p={1}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Screen</InputLabel>
                                        {selectedScreenId && (
                                            <Select
                                                label='Select Screen'
                                                value={selectedScreenId}
                                                onChange={(e) => setSelectedScreenId(e.target.value)}
                                                sx={{ height: '45px' }}
                                            >
                                                {screensData && screensData.map((screen) => (
                                                    <MenuItem key={screen.id} value={screen.id}>
                                                        {screen.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                </MDBox> */}
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