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
import MDSnackbar from 'components/MDSnackbar';
import MDButton from 'components/MDButton';

export default function EditTheatre() {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const navigateWithDelay = () => {
        setTimeout(() => {
            navigate(-1);
        }, 1500);
    };

    useEffect(() => {
        const fetchTheatreData = async () => {
            try {
                const { data, error } = await supabase.from('theatres').select('*').eq('id', id);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const theatre = data[0];
                    editTheatre.setValues({
                        name: theatre.name,
                        address: theatre.address,
                        telephone: theatre.telephone,
                        coordinatorName: theatre.coordinatorName,
                        coordinatorMobile: theatre.coordinatorMobile,
                        coordinatorMail: theatre.coordinatorMail,
                    });
                }
            } catch (error) {
                console.error('Error fetching theatre data:', error.message);
            }
        };

        fetchTheatreData();
        // eslint-disable-next-line
    }, [id]);

    const editTheatre = useFormik({
        initialValues: {
            name: '',
            address: '',
            telephone: '',
            coordinatorName: '',
            coordinatorMobile: '',
            coordinatorMail: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            coordinatorName: Yup.string().required('Required'),
            coordinatorMobile: Yup.string()
                .required('Required')
                // .matches(phoneRegExp, 'Mobile number is not valid')
                .min(10, 'Not a valid mobile number')
                .max(10, 'Not a valid mobile number'),
            telephone: Yup.string()
                .required('Required')
                // .matches(phoneRegExp, 'Telephone number is not valid')
                .min(10, 'Not a valid telephone number')
                .max(10, 'Not a valid telephone number'),
            coordinatorMail: Yup.string().required('Email is required').email('Enter a valid email'),
        }),
        onSubmit: async (values, { resetForm }) => {
            await editTheatreData(values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
            navigateWithDelay();
        },
    });

    const editTheatreData = async (values) => {
        try {
            const { error } = await supabase.from('theatres').update(values).eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error.message);
            throw new Error('Error updating data:', error.message);
        }
    };



    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={editTheatre.handleSubmit}>
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
                                        id="outlined-basic"
                                        label="Name"
                                        name="name"
                                        value={editTheatre.values.name}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.name && Boolean(editTheatre.errors.name)}
                                        helperText={editTheatre.touched.name && editTheatre.errors.name} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Address"
                                        name="address"
                                        value={editTheatre.values.address}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.address && Boolean(editTheatre.errors.address)}
                                        helperText={editTheatre.touched.address && editTheatre.errors.address} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Telephone"
                                        name="telephone"
                                        value={editTheatre.values.telephone}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.telephone && Boolean(editTheatre.errors.telephone)}
                                        helperText={editTheatre.touched.telephone && editTheatre.errors.telephone} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Coordinator Name"
                                        name="coordinatorName"
                                        value={editTheatre.values.coordinatorName}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.coordinatorName && Boolean(editTheatre.errors.coordinatorName)}
                                        helperText={editTheatre.touched.coordinatorName && editTheatre.errors.coordinatorName} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Coordinator Mobile"
                                        name="coordinatorMobile"
                                        value={editTheatre.values.coordinatorMobile}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.coordinatorMobile && Boolean(editTheatre.errors.coordinatorMobile)}
                                        helperText={editTheatre.touched.coordinatorMobile && editTheatre.errors.coordinatorMobile} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Coordinator Mail"
                                        name="coordinatorMail"
                                        value={editTheatre.values.coordinatorMail}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.coordinatorMail && Boolean(editTheatre.errors.coordinatorMail)}
                                        helperText={editTheatre.touched.coordinatorMail && editTheatre.errors.coordinatorMail} />
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
            <MDSnackbar
                color={snackbarType}
                icon={snackbarType === 'success' ? 'check' : 'warning'}
                title={snackbarType === 'success' ? 'Success' : 'Error'}
                content={snackbarType === 'success' ? 'Theatre has been edited successfully!' : 'Failed to edit theatre!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    )
}
