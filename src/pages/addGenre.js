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


export default function AddGenre() {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');

    const newGenre = useFormik({
        initialValues: {
            genre_name: '',
        },
        validationSchema: Yup.object({
            genre_name: Yup.string().required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            saveGenre(values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
        },
    });

    const saveGenre = async (genre) => {
        try {
            const { data, error } = await supabase
                .from('genres')
                .insert({ genre_name: genre.genre_name }); // Extract facility_name from the facility object

            if (error) {
                throw error;
            } else {
                console.log('Genre added successfully:', data);
                setSnackbarOpen(true);
                setSnackbarType('success');
            }
        } catch (error) {
            console.error('Error adding genre:', error.message);
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
                    <form onSubmit={newGenre.handleSubmit}>
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
                                    Add New Genres
                                </MDTypography>

                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Genre"
                                        name="genre_name"
                                        value={newGenre.values.genre_name}
                                        onChange={newGenre.handleChange}
                                        onBlur={newGenre.handleBlur}
                                        error={newGenre.touched.genre_name && Boolean(newGenre.errors.genre_name)}
                                        helperText={newGenre.touched.genre_name && newGenre.errors.genre_name} />
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
                content={snackbarType === 'success' ? 'New genre has been added successfully!' : 'Failed to add new genre!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    )
}
