import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';


// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Button, TextField } from '@mui/material';

import { supabase } from './supabaseClient';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDSnackbar from 'components/MDSnackbar';


export default function AddLanguages() {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');

    const newLanguage = useFormik({
        initialValues: {
            language_name: '',
        },
        validationSchema: Yup.object({
            language_name: Yup.string().required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            saveLanguage(values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
        },
    });

    const saveLanguage = async (language) => {
        try {
            const { data, error } = await supabase
                .from('languages')
                .insert({ language_name: language.language_name }); // Extract facility_name from the facility object

            if (error) {
                throw error;
            } else {
                console.log('Language added successfully:', data);
                setSnackbarOpen(true);
                setSnackbarType('success');
            }
        } catch (error) {
            console.error('Error adding language:', error.message);
            setSnackbarOpen(true);
            setSnackbarType('error');
        }
    };


    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={newLanguage.handleSubmit}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                pt={1}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex"
                                justifyContent="space-between"
                            >
                                <MDTypography variant="h6" color="white">
                                    Add New Languages
                                </MDTypography>

                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Language"
                                        name="language_name"
                                        value={newLanguage.values.language_name}
                                        onChange={newLanguage.handleChange}
                                        onBlur={newLanguage.handleBlur}
                                        error={newLanguage.touched.language_name && Boolean(newLanguage.errors.language_name)}
                                        helperText={newLanguage.touched.language_name && newLanguage.errors.language_name} />
                                </MDBox>
                                <MDBox mt={-3} p={4}>
                                    <Button
                                        fullWidth
                                        type='submit'
                                        variant="contained"
                                        color="primary"
                                    >
                                        <span style={{ color: 'white' }}>Save</span>
                                    </Button>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </form>
                </Grid>
            </Grid>
        </MDBox>
            <Footer />
            <MDSnackbar
                color={snackbarType}
                icon={snackbarType === 'success' ? 'check' : 'warning'}
                title={snackbarType === 'success' ? 'Success' : 'Error'}
                content={snackbarType === 'success' ? 'New language has been added successfully!' : 'Failed to add new language!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    )
}
