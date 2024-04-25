import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import MDButton from 'components/MDButton';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function EditShowTime() {

    const { showTimeId } = useParams();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState();
    const [initialTime, setInitialTime] = useState();

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };

    useEffect(() => {
        const fetchShowTimeData = async () => {
            try {
                const { data, error } = await supabase.from('showTime').select('*').eq('id', showTimeId);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const showTime = data[0];
                    editShowTime.setValues({
                        name: showTime.name,
                        time: showTime.time,
                    });
                    const formattedTime = (dayjs(showTime.time)).format('hh:mm A');
                    setInitialTime(formattedTime);
                    setSelectedTime(formattedTime);
                }
            } catch (error) {
                console.error('Error fetching showTime data:', error.message);
            }
        };

        fetchShowTimeData();
    }, [showTimeId]);

    const editShowTime = useFormik({
        initialValues: {
            name: '',
            time: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const formattedTime = (dayjs(selectedTime)).format('hh:mm A');
            values.time = formattedTime;
            await editShowTimeData(values);
            resetForm();
        },
    });

    const editShowTimeData = async (values) => {
        try {
            const { error } = await supabase.from('showTime').update(values).eq('id', showTimeId);
            if (error) {
                throw error;
            }
            console.log('Data updated successfully');
            navigate(-1);
        } catch (error) {
            console.error('Error updating data:', error.message);
            throw new Error('Error updating data:', error.message);
        }
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={editShowTime.handleSubmit}>
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
                                    Edit Show Time
                                </MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        screenId="outlined-basic"
                                        label="Name"
                                        name="name"
                                        value={editShowTime.values.name}
                                        onChange={editShowTime.handleChange}
                                        onBlur={editShowTime.handleBlur}
                                        error={editShowTime.touched.name && Boolean(editShowTime.errors.name)}
                                        helperText={editShowTime.touched.name && editShowTime.errors.name} />
                                </MDBox>
                                <MDBox p={1}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['MobileTimePicker']}>
                                            <MobileTimePicker
                                                label={'Time'}
                                                openTo="hours"
                                                value={selectedTime ? dayjs(selectedTime) : dayjs(initialTime)}
                                                onChange={handleTimeChange}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </MDBox>
                                <MDBox p={1}>
                                    <MDButton color='info' type='submit'>Update</MDButton>
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
