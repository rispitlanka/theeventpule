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

const AddCastList = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const [image, setImage] = useState(null); // State to store the selected image

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

    const newCast = useFormik({
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
                await saveCast({ ...values, image }); // Pass the image URL along with other form values
                setSnackbarOpen(true);
                setSnackbarType('success');
                resetForm();
                setImage(null); // Reset image state after submission
            } catch (error) {
                console.error('Error adding cast member:', error.message);
                setSnackbarOpen(true);
                setSnackbarType('error');
            }
        },
    });

    const saveCast = async (cast) => {
        try {
            const castImg = await uploadImage('ticket_booking', `cast/tktBooking`, image);
            if (castImg !== null) {
                console.log(castImg.data);
                const castImgUrl = await supabase.storage.from('ticket_booking').getPublicUrl(castImg.data.path);


                const { data, error } = await supabase
                    .from('cast')
                    .insert({ name: cast.name, category: cast.category, image: castImgUrl.data.publicUrl })
                    .select('*');

                if (error) {
                    throw error;
                } else {
                    console.log('Cast member added successfully:', data);
                    setImage(null);
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <form onSubmit={newCast.handleSubmit}>
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
                                        Add New Cast Member
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
                                            value={newCast.values.name}
                                            onChange={newCast.handleChange}
                                            onBlur={newCast.handleBlur}
                                            error={newCast.touched.name && Boolean(newCast.errors.name)}
                                            helperText={newCast.touched.name && newCast.errors.name}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Category"
                                            name="category"
                                            value={newCast.values.category}
                                            onChange={newCast.handleChange}
                                            onBlur={newCast.handleBlur}
                                            error={newCast.touched.category && Boolean(newCast.errors.category)}
                                            helperText={newCast.touched.category && newCast.errors.category}
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
                content={snackbarType === 'success' ? 'New cast member has been added successfully!' : 'Failed to add new cast member!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    );
};

export default AddCastList;
