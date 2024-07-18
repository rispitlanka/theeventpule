import React, { useContext, useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from 'context';

export default function AddMainEvent() {
    const navigate = useNavigate();
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;

    const onSubmit = async (values, { resetForm }) => {
        try {
            values.eventOrganizationId = userOrganizationId;
            await addMainEventData(values);
            resetForm();
            toast.info('Main Event has been successfully created!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const newMainEvent = useFormik({
        initialValues: {
            title: '',
            description: '',
            eventOrganizationId: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const addMainEventData = async (values) => {
        try {
            const { data, error } = await supabase.from('mainEvent').insert([values]).select('*');
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

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={newMainEvent.handleSubmit}>
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
                                    Add New Main Event
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
                                        value={newMainEvent.values.title}
                                        onChange={newMainEvent.handleChange}
                                        onBlur={newMainEvent.handleBlur}
                                        error={newMainEvent.touched.title && Boolean(newMainEvent.errors.title)}
                                        helperText={newMainEvent.touched.title && newMainEvent.errors.title} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Description"
                                        name="description"
                                        value={newMainEvent.values.description}
                                        onChange={newMainEvent.handleChange}
                                        onBlur={newMainEvent.handleBlur}
                                        error={newMainEvent.touched.description && Boolean(newMainEvent.errors.description)}
                                        helperText={newMainEvent.touched.description && newMainEvent.errors.description} />
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
