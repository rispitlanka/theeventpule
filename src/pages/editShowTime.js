import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Button, TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

export default function EditShowTime() {

    const { screenId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShowTimeData = async () => {
            try {
                const { data, error } = await supabase.from('showTime').select('*').eq('screenId', screenId);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const showTime = data[0];
                    editShowTime.setValues({
                        name: showTime.name,
                        time: showTime.time,
                    });
                }
            } catch (error) {
                console.error('Error fetching showTime data:', error.message);
            }
        };

        fetchShowTimeData();
    }, [screenId]);

    const editShowTime = useFormik({
        initialValues: {
            name: '',
            time: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            await editShowTimeData(values);
            resetForm();
        },
    });

    const editShowTimeData = async (values) => {
        try {
            const { error } = await supabase.from('showTime').update(values).eq('screenId', screenId);
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
                                    Manage Theatre
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
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        screenId="outlined-basic"
                                        label="Address"
                                        name="time"
                                        value={editShowTime.values.time}
                                        onChange={editShowTime.handleChange}
                                        onBlur={editShowTime.handleBlur}
                                        error={editShowTime.touched.time && Boolean(editShowTime.errors.time)}
                                        helperText={editShowTime.touched.time && editShowTime.errors.time} />
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
