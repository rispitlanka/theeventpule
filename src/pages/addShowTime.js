import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import dayjs from 'dayjs';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useNavigate, useParams } from 'react-router-dom';
import MDButton from 'components/MDButton';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

export default function AddShowTime() {

    const [error, setError] = useState(null);
    const { screenId } = useParams();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState(null);

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            const formattedTime = dayjs(selectedTime).format('hh:mm A');
            values.time = formattedTime;
            await addShowTimeData(values);
            resetForm();
            navigate(-1);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setError(error.message);
        }
    };

    const newShowTime = useFormik({
        initialValues: {
            name: '',
            time: '',
            type: 'default',
            screenId: screenId,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit,
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

    return (
        <DashboardLayout><DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <form onSubmit={newShowTime.handleSubmit}>
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
                                        Add New Show Time
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
                                            value={newShowTime.values.name}
                                            onChange={newShowTime.handleChange}
                                            onBlur={newShowTime.handleBlur}
                                            error={newShowTime.touched.name && Boolean(newShowTime.errors.name)}
                                            helperText={newShowTime.touched.name && newShowTime.errors.name} />
                                    </MDBox>
                                    <MDBox p={1}>
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
        </DashboardLayout>
    )
}