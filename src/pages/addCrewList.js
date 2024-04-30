import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

// Import supabase instance
import { supabase } from './supabaseClient';

const AddCrewList = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const [image, setImage] = useState(null);

    const generateUniquePath = (prefix) => {
        const uniqueIdentifier = new Date().getTime(); // You can use a different method to generate a unique identifier
        return `${prefix}/${uniqueIdentifier}`;
    };

    const uploadImage = async (folder, name, image) => {
        const uniquePath = generateUniquePath(name);

        const result = await supabase.storage.from(folder).upload(uniquePath, image, {
            // cacheControl: '1',
            upsert: false,
        });
        if (result.error) {
            console.log('network issue', result.error);
            return null;
        }
        console.log(result)
        return result;
    };

    const newCrew = useFormik({
        initialValues: {
            name: '',
            category: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            category: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await saveCrew(values);
                setSnackbarOpen(true);
                setSnackbarType('success');
                resetForm();
                setImage(null);
            } catch (error) {
                console.error('Error adding crew member:', error.message);
                setSnackbarOpen(true);
                setSnackbarType('error');
            }
        },
    });

    const saveCrew = async (crew) => {
        try {

            const crewImg = await uploadImage('ticket_booking', `crew/tktBooking`, image);
            if (crewImg !== null) {
                console.log(crewImg.data);
                const crewImgUrl = await supabase.storage
                    .from('ticket_booking').
                    getPublicUrl(crewImg.data.path);


                const { data, error } = await supabase
                    .from('crew')
                    .insert({ name: crew.name, category: crew.category, image: crewImgUrl.data.publicUrl });

                if (error) {
                    throw error;
                } else {
                    console.log('Crew member added successfully:', data);
                    setImage(null)
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
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
                        <form onSubmit={newCrew.handleSubmit}>
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
                                        Add New Crew Member
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
                                            value={newCrew.values.name}
                                            onChange={newCrew.handleChange}
                                            onBlur={newCrew.handleBlur}
                                            error={newCrew.touched.name && Boolean(newCrew.errors.name)}
                                            helperText={newCrew.touched.name && newCrew.errors.name}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Category"
                                            name="category"
                                            value={newCrew.values.category}
                                            onChange={newCrew.handleChange}
                                            onBlur={newCrew.handleBlur}
                                            error={newCrew.touched.category && Boolean(newCrew.errors.category)}
                                            helperText={newCrew.touched.category && newCrew.errors.category}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="image-upload"
                                            type="file"
                                            onChange={(e) => handleFileChange(e)}
                                        />
                                        {image !== null &&
                                            (<img src={URL.createObjectURL(image)} alt="Selected" style={{ width: "100px", height: "100px" }} />)}
                                        <label htmlFor="image-upload">
                                            <Button variant="contained" component="span">
                                                <span style={{ color: 'white' }}>Upload Image</span>
                                            </Button>
                                        </label>
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
                content={snackbarType === 'success' ? 'New crew member has been added successfully!' : 'Failed to add new crew member!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    );
};


export default AddCrewList
