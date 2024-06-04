import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { useNavigate, useParams } from 'react-router-dom';

export default function EditMainEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const onSubmit = async (values, { resetForm }) => {
        try {
            await editMainEventData(values);
            resetForm();
            toast.info('Main Event has been successfully updated!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const editMainEvent = useFormik({
        initialValues: {
            title: '',
            description: '',
            organizer: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const editMainEventData = async (values) => {
        try {
            const { data, error } = await supabase.from('mainEvent').update([values]).select('*').eq('id', id);
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

    useEffect(() => {
        const fetchMainEventData = async () => {
            try {
                const { data, error } = await supabase.from('mainEvent').select('*').eq('id', id);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const event = data[0];
                    editMainEvent.setValues({
                        title: event.title,
                        description: event.description,
                        organizer: event.organizer,
                    });
                }
            } catch (error) {
                console.error('Error fetching event data:', error.message);
            }
        };
        fetchMainEventData();
    }, [id]);

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={editMainEvent.handleSubmit}>
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
                                    Edit Main Event
                                </MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Title"
                                        name="title"
                                        value={editMainEvent.values.title}
                                        onChange={editMainEvent.handleChange}
                                        onBlur={editMainEvent.handleBlur}
                                        error={editMainEvent.touched.title && Boolean(editMainEvent.errors.title)}
                                        helperText={editMainEvent.touched.title && editMainEvent.errors.title} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Description"
                                        name="description"
                                        value={editMainEvent.values.description}
                                        onChange={editMainEvent.handleChange}
                                        onBlur={editMainEvent.handleBlur}
                                        error={editMainEvent.touched.description && Boolean(editMainEvent.errors.description)}
                                        helperText={editMainEvent.touched.description && editMainEvent.errors.description} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Organizer"
                                        name="organizer"
                                        value={editMainEvent.values.organizer}
                                        onChange={editMainEvent.handleChange}
                                        onBlur={editMainEvent.handleBlur}
                                        error={editMainEvent.touched.organizer && Boolean(editMainEvent.errors.organizer)}
                                        helperText={editMainEvent.touched.organizer && editMainEvent.errors.organizer} />
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