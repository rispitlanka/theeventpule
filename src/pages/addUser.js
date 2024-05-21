import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
    const [theatreData, setTheatreData] = useState();
    const [selectedTheatreId, setSelectedTheatreId] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTheatreData()
    }, [])

    const fetchTheatreData = async () => {
        try {
            const { data, error } = await supabase.from('theatres').select('*');
            if (data) {
                setTheatreData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            await addUserData({ ...values, theatreId: selectedTheatreId });
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };

    const newUser = useFormik({
        initialValues: {
            name: '',
            mobile: '',
            email: '',
            userRole: '',
            theatreId: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            mobile: Yup.string()
                .required('Required')
                // .matches(phoneRegExp, 'Mobile number is not valid')
                .min(10, 'Not a valid mobile number')
                .max(10, 'Not a valid mobile number'),
            email: Yup.string().required('Email is required').email('Enter a valid email'),
        }),
        onSubmit,
    });

    const addUserData = async (values) => {
        try {
            const { data, error } = await supabase.from('theatreOwners').insert([values]).select('*');
            if (data) {
                console.log('Data added succesfully:', data);
                toast.info('User has been successfully created!');
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={newUser.handleSubmit}>
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
                                    Add New User
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
                                        value={newUser.values.name}
                                        onChange={newUser.handleChange}
                                        onBlur={newUser.handleBlur}
                                        error={newUser.touched.name && Boolean(newUser.errors.name)}
                                        helperText={newUser.touched.name && newUser.errors.name} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Mobile"
                                        name="mobile"
                                        value={newUser.values.mobile}
                                        onChange={newUser.handleChange}
                                        onBlur={newUser.handleBlur}
                                        error={newUser.touched.mobile && Boolean(newUser.errors.mobile)}
                                        helperText={newUser.touched.mobile && newUser.errors.mobile} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Email"
                                        name="email"
                                        value={newUser.values.email}
                                        onChange={newUser.handleChange}
                                        onBlur={newUser.handleBlur}
                                        error={newUser.touched.email && Boolean(newUser.errors.email)}
                                        helperText={newUser.touched.email && newUser.errors.email} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="User Role"
                                        name="userRole"
                                        value={newUser.values.userRole}
                                        onChange={newUser.handleChange}
                                        onBlur={newUser.handleBlur}
                                        error={newUser.touched.userRole && Boolean(newUser.errors.userRole)}
                                        helperText={newUser.touched.userRole && newUser.errors.userRole} />
                                </MDBox>
                                <MDBox p={1}>
                                    <FormControl fullWidth mb={3}>
                                        <InputLabel>Select Theatre</InputLabel>
                                        <Select
                                            value={selectedTheatreId}
                                            onChange={(e) => setSelectedTheatreId(e.target.value)}
                                            sx={{ height: '45px', mb: 3 }}
                                        >
                                            {theatreData && theatreData.map((theatre) => (
                                                <MenuItem key={theatre.id} value={theatre.id}>
                                                    {theatre.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </MDBox>
                                <MDBox p={1}>
                                    <MDButton color='info' type='submit'>Save</MDButton>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </form>
                </Grid>
            </Grid>
        </MDBox>
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </DashboardLayout>
    )
}