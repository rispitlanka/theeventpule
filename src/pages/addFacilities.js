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
// Data
import facilitiesTableData from "layouts/tables/data/facilitiesTableData";

export default function AddFacilities() {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');

    const newFacility = useFormik({
        initialValues: {
            facility_name: '',
        },
        validationSchema: Yup.object({
            facility_name: Yup.string().required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            saveFacility(values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
        },
    });

    const saveFacility = async (facility) => {
        try {
            const { data, error } = await supabase
                .from('facilities')
                .insert({ facility_name: facility.facility_name }); // Extract facility_name from the facility object

            if (error) {
                throw error;
            } else {
                console.log('Facility added successfully:', data);
                setSnackbarOpen(true);
                setSnackbarType('success');
            }
        } catch (error) {
            console.error('Error adding facility:', error.message);
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
                    <form onSubmit={newFacility.handleSubmit}>
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
                                    Add New Facilities
                                </MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Facility Name"
                                        name="facility_name"
                                        value={newFacility.values.facility_name}
                                        onChange={newFacility.handleChange}
                                        onBlur={newFacility.handleBlur}
                                        error={newFacility.touched.facility_name && Boolean(newFacility.errors.facility_name)}
                                        helperText={newFacility.touched.facility_name && newFacility.errors.name} />
                                </MDBox>
                                <MDBox mt={-3} p={4}>
                                    <Button
                                        fullWidth
                                        type='submit'
                                        variant="contained"
                                        color="primary"
                                    >
                                        <span style={{ color: 'white' }}>Update</span>
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
                content={snackbarType === 'success' ? 'New facility has been added successfully!' : 'Failed to add new facility!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    )
}