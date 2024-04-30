import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function EditSoundSystem() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getSoundSystems();
    }, [id]);

    const getSoundSystems = async () => {
        try {
            const { data, error } = await supabase
                .from('soundsystem_types')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                editSoundSystem.setValues({
                    soundsystem_type: data.soundsystem_type,
                });
            }

        } catch (error) {
            console.error('Error fetching sound systems:', error.message);
        }
    };

    const editSoundSystem = useFormik({
        initialValues: {
            soundsystem_type: '',
        },
        validationSchema: Yup.object({
            soundsystem_type: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            await saveDataToSupabase(id, values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
            navigateWithDelay();
        },
    });

    const saveDataToSupabase = async (id, newData) => {
        try {
            const { data, error } = await supabase
                .from('soundsystem_types')
                .update(newData)
                .eq('id', id);

            if (error) {
                throw error;
            }

            console.log('Data updated successfully:', data);
        } catch (error) {
            console.error('Error updating data:', error.message);
        }
    };

    const navigateWithDelay = () => {
        setTimeout(() => {
            navigate(-1);
        }, 1500);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <form onSubmit={editSoundSystem.handleSubmit}>
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
                                        Manage Sound System types
                                    </MDTypography>

                                </MDBox>
                                <MDBox p={2}>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="soundsystem_type"
                                            label="Sound System"
                                            name="soundsystem_type"
                                            value={editSoundSystem.values.soundsystem_type}
                                            onChange={editSoundSystem.handleChange}
                                            onBlur={editSoundSystem.handleBlur}
                                            error={editSoundSystem.touched.soundsystem_type && Boolean(editSoundSystem.errors.soundsystem_type)}
                                            helperText={editSoundSystem.touched.soundsystem_type && editSoundSystem.errors.soundsystem_type}
                                        />
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
                content={snackbarType === 'success' ? 'Sound system type has been edited successfully!' : 'Failed to edit Sound System type!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    );
}
