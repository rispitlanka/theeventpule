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
import Genre from './genre';
import CensorTypes from './censorTypes';
import { useNavigate } from 'react-router-dom';


export default function AddCensorType() {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');

    const navigate = useNavigate();

    const newCensorType = useFormik({
        initialValues: {
            censor_type: '',
        },
        validationSchema: Yup.object({
            censor_type: Yup.string().required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            saveCensorType(values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
            navigateWithDelay();
        },
    });

    const saveCensorType = async (censor) => {
        try {
            const { data, error } = await supabase
                .from('censor_types')
                .insert({ censor_type: censor.censor_type });

            if (error) {
                throw error;
            } else {
                console.log('Censor Types added successfully:', data);
                setSnackbarOpen(true);
                setSnackbarType('success');
            }
        } catch (error) {
            console.error('Error adding Censor Types:', error.message);
            setSnackbarOpen(true);
            setSnackbarType('error');
        }
    };

    const navigateWithDelay = () => {
        setTimeout(() => {
            navigate(-1);
        }, 2500);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={newCensorType.handleSubmit}>
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
                                    Add New Censor Types
                                </MDTypography>

                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Censor-Type"
                                        name="censor_type"
                                        value={newCensorType.values.censor_type}
                                        onChange={newCensorType.handleChange}
                                        onBlur={newCensorType.handleBlur}
                                        error={newCensorType.touched.censor_type && Boolean(newCensorType.errors.censor_type)}
                                        helperText={newCensorType.touched.censor_type && newCensorType.errors.censor_type} />
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
                content={snackbarType === 'success' ? 'New Censor Type has been added successfully!' : 'Failed to add Censor Type!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    )
}
