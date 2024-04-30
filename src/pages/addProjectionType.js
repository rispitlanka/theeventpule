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
import SoundSystem from './soundSystemType';


export default function AddProjectionType() {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');

    const newProjectionType = useFormik({
        initialValues: {
            projection_type: '',
        },
        validationSchema: Yup.object({
            projection_type: Yup.string().required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            saveProjectionType(values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
        },
    });

    const saveProjectionType = async (projtyp) => {
        try {
            const { data, error } = await supabase
                .from('projection_types')
                .insert({ projection_type: projtyp.projection_type }); // Extract facility_name from the facility object

            if (error) {
                throw error;
            } else {
                console.log('Projection Type added successfully:', data);
                setSnackbarOpen(true);
                setSnackbarType('success');
            }
        } catch (error) {
            console.error('Error adding Projection type:', error.message);
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
                    <form onSubmit={newProjectionType.handleSubmit}>
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
                                    Add New Projection types
                                </MDTypography>

                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Projection Type"
                                        name="projection_type"
                                        value={newProjectionType.values.projection_type}
                                        onChange={newProjectionType.handleChange}
                                        onBlur={newProjectionType.handleBlur}
                                        error={newProjectionType.touched.projection_type && Boolean(newProjectionType.errors.projection_type)}
                                        helperText={newProjectionType.touched.projection_type && newProjectionType.errors.projection_type} />
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
                content={snackbarType === 'success' ? 'New Projection type has been added successfully!' : 'Failed to add new Projection type!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    )
}
