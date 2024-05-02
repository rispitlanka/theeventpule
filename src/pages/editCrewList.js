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
import { Category } from '@mui/icons-material';

export default function EditCrewList() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getCrews();
    }, [id]);

    const getCrews = async () => {
        try {
            const { data, error } = await supabase
                .from('crew')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                editCrew.setValues({
                    name: data.name,
                    category: data.category,
                });
            }

        } catch (error) {
            console.error('Error fetching crews:', error.message);
        }
    };

    const editCrew = useFormik({
        initialValues: {
            name: '',
            category: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            category: Yup.string().required('Required'),
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
                .from('crew')
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
                        <form onSubmit={editCrew.handleSubmit}>
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
                                        Manage Crew List
                                    </MDTypography>

                                </MDBox>
                                <MDBox p={2}>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="name"
                                            label="Crew Name"
                                            name="name"
                                            value={editCrew.values.name}
                                            onChange={editCrew.handleChange}
                                            onBlur={editCrew.handleBlur}
                                            error={editCrew.touched.name && Boolean(editCrew.errors.name)}
                                            helperText={editCrew.touched.name && editCrew.errors.name}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="category"
                                            label="Crew Category"
                                            name="category"
                                            value={editCrew.values.category}
                                            onChange={editCrew.handleChange}
                                            onBlur={editCrew.handleBlur}
                                            error={editCrew.touched.category && Boolean(editCrew.errors.category)}
                                            helperText={editCrew.touched.category && editCrew.errors.category}
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
                content={snackbarType === 'success' ? 'genre has been edited successfully!' : 'Failed to edit genre!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    );
}
