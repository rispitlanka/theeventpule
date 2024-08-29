import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormControl, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

export default function EditVenue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [locationData, setLocationData] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const { data, error } = await supabase.from('venue_locations').select('*');
                if (error) throw error;
                if (data) {
                    setLocationData(data);
                }
            } catch (error) {
                console.error('Error fetching questions:', error.message);
            }
        };
        fetchLocations();
    }, [])

    useEffect(() => {
        const fetchVenueData = async () => {
            try {
                const { data, error } = await supabase.from('venues').select('*').eq('id', id);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const venue = data[0];
                    editVenue.setValues({
                        name: venue.name,
                        locationId: venue.locationId,
                        telephone: venue.telephone,
                        ownerName: venue.ownerName,
                        ownerMobile: venue.ownerMobile,
                        ownerEmail: venue.ownerEmail,
                        isActive: venue.isActive,
                    });
                }
            } catch (error) {
                console.error('Error fetching venue data:', error.message);
            }
        };
        fetchVenueData();
    }, [id]);

    const editVenue = useFormik({
        initialValues: {
            name: '',
            locationId: '',
            city: '',
            telephone: '',
            ownerName: '',
            ownerMobile: '',
            ownerEmail: '',
            isActive: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            ownerName: Yup.string().required('Required'),
            ownerMobile: Yup.string()
                .required('Required')
                .min(10, 'Not a valid Mobile number')
                .max(10, 'Not a valid Mobile number'),
            telephone: Yup.string()
                .required('Required')
                .min(10, 'Not a valid telephone number')
                .max(10, 'Not a valid telephone number'),
            ownerEmail: Yup.string()
                .required('Email is required')
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid Email')
                .email('Enter a valid ownerEmail'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            await editVenueData(values);
            resetForm();
            toast.info('Venue has been successfully updated!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
            setIsLoading(false);
        },
    });

    const editVenueData = async (values) => {
        try {
            const { error } = await supabase.from('venues').update(values).eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data updated successfully');

        } catch (error) {
            console.error('Error updating data:', error.message);
            throw new Error('Error updating data:', error.message);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <form onSubmit={editVenue.handleSubmit}>
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
                                        Edit Venue
                                    </MDTypography>
                                </MDBox>
                                <MDBox p={2}>
                                    <MDTypography>Venue Info</MDTypography>
                                    <Grid container spacing={5} display={'flex'} flexDirection={'row'}>
                                        <Grid item xs={6}>
                                            <MDBox p={1}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    id="outlined-basic"
                                                    label="Name"
                                                    name="name"
                                                    value={editVenue.values.name}
                                                    onChange={editVenue.handleChange}
                                                    onBlur={editVenue.handleBlur}
                                                    error={editVenue.touched.name && Boolean(editVenue.errors.name)}
                                                    helperText={editVenue.touched.name && editVenue.errors.name} />
                                            </MDBox>
                                            <MDBox p={1}>
                                                <FormControl fullWidth >
                                                    <InputLabel>Select Location</InputLabel>
                                                    <Select
                                                        label="Select Location"
                                                        name="locationId"
                                                        value={editVenue.values.locationId}
                                                        onChange={(e) => editVenue.setFieldValue('locationId', e.target.value)}
                                                        onBlur={editVenue.handleBlur}
                                                        sx={{ height: '45px' }}
                                                    >
                                                        {locationData.map((location) => (
                                                            <MenuItem key={location.id} value={location.id}>
                                                                {location.city}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {/* {editVenue.touched.locationId && editVenue.errors.locationId && (
                                                        <FormHelperText>{editVenue.errors.locationId}</FormHelperText>
                                                    )} */}
                                                </FormControl>
                                            </MDBox>
                                            <MDBox p={1}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    id="outlined-basic"
                                                    label="Telephone"
                                                    name="telephone"
                                                    value={editVenue.values.telephone}
                                                    onChange={editVenue.handleChange}
                                                    onBlur={editVenue.handleBlur}
                                                    error={editVenue.touched.telephone && Boolean(editVenue.errors.telephone)}
                                                    helperText={editVenue.touched.telephone && editVenue.errors.telephone} />
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <MDBox p={1}>
                                                <MDTypography>
                                                    Status:
                                                    <Switch label="Status" checked={editVenue.values.isActive} onChange={(e) => editVenue.setFieldValue('isActive', e.target.checked)} />
                                                    {editVenue.values.isActive ? 'Active' : 'Inactive'}
                                                </MDTypography>
                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                    <Grid mt={2}>
                                        <MDTypography>Venue Owner Info</MDTypography>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Owner Name"
                                                name="ownerName"
                                                value={editVenue.values.ownerName}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.ownerName && Boolean(editVenue.errors.ownerName)}
                                                helperText={editVenue.touched.ownerName && editVenue.errors.ownerName} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Owner Phone Number"
                                                name="ownerMobile"
                                                value={editVenue.values.ownerMobile}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.ownerMobile && Boolean(editVenue.errors.ownerMobile)}
                                                helperText={editVenue.touched.ownerMobile && editVenue.errors.ownerMobile} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Owner Mail"
                                                name="ownerEmail"
                                                value={editVenue.values.ownerEmail}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.ownerEmail && Boolean(editVenue.errors.ownerEmail)}
                                                helperText={editVenue.touched.ownerEmail && editVenue.errors.ownerEmail} />
                                        </MDBox>
                                    </Grid>
                                    <MDBox p={1} display={'flex'} flexDirection={'row'} alignItems='center'>
                                        <MDButton color='info' type='submit' sx={{ mr: 1 }} disabled={isLoading}>Update</MDButton>
                                        {isLoading &&
                                            <MDTypography variant='body2' ml={1}>updating....</MDTypography>
                                        }
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