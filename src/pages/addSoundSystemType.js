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


export default function AddSoundSystem() {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');

    const newSoundSystem = useFormik({
        initialValues: {
            soundsystem_type: '',
        },
        validationSchema: Yup.object({
            soundsystem_type: Yup.string().required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            saveSoundSystem(values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
        },
    });

    const saveSoundSystem = async (soundsys) => {
        try {
            const { data, error } = await supabase
                .from('soundsystem_types')
                .insert({ soundsystem_type: soundsys.soundsystem_type }); // Extract facility_name from the facility object

            if (error) {
                throw error;
            } else {
                console.log('Sound system added successfully:', data);
                setSnackbarOpen(true);
                setSnackbarType('success');
            }
        } catch (error) {
            console.error('Error adding sound system type:', error.message);
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
                    <form onSubmit={newSoundSystem.handleSubmit}>
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
                                    Add New Sound System types
                                </MDTypography>

                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Sound System "
                                        name="soundsystem_type"
                                        value={newSoundSystem.values.soundsystem_type}
                                        onChange={newSoundSystem.handleChange}
                                        onBlur={newSoundSystem.handleBlur}
                                        error={newSoundSystem.touched.soundsystem_type && Boolean(newSoundSystem.errors.soundsystem_type)}
                                        helperText={newSoundSystem.touched.soundsystem_type && newSoundSystem.errors.soundsystem_type} />
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
                content={snackbarType === 'success' ? 'New Sound system type has been added successfully!' : 'Failed to add new Sound system type!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    )
}
