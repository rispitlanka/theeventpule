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
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import MDButton from 'components/MDButton';

export default function AddFacilities() {
    const [iconPreview, setIconPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleIconUpload = (event) => {
        const file = event.currentTarget.files[0];
        newFacility.setFieldValue('icons', file);
        setIconPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        try {
            if (newFacility.values.icons) {
                const file = newFacility.values.icons;
                const { data: iconData, error: iconError } = await supabase.storage
                    .from('icons')
                    .upload(`facility_icons/${file.name}`, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });
                if (iconError) {
                    throw iconError;
                }
                if (iconData) {
                    const iconURL = supabase.storage.from('icons').getPublicUrl(iconData.path);
                    values.icons = iconURL.data.publicUrl;
                } else {
                    throw new Error('Failed to upload icon');
                }
            }
            await saveFacility(values);
            resetForm();
            toast.info('Facility has been successfully created!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setIsLoading(false);
        }
    };

    const newFacility = useFormik({
        initialValues: {
            facility_name: '',
            icons: '',
        },
        validationSchema: Yup.object({
            facility_name: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const saveFacility = async (values) => {
        try {
            const { data, error } = await supabase
                .from('facilities')
                .insert([values]);

            if (error) {
                throw error;
            } else {
                console.log('Facility added successfully:', data);
            }
        } catch (error) {
            console.error('Error adding facility:', error.message);
        }
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
                                <MDBox p={1}>
                                    <Grid xs={3} display={'flex'} flexDirection={'column'}>
                                        {iconPreview ? (
                                            <MDBox
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                border="1px dashed"
                                                borderRadius="4px"
                                                width="50%"
                                                maxHeight="100px"
                                                mb={1}
                                                height="100px"
                                            >
                                                <img src={iconPreview} alt="Cover Preview" style={{ width: '50%', maxHeight: '100px' }} />
                                            </MDBox>
                                        ) : (
                                            <MDBox
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                border="1px dashed"
                                                borderRadius="4px"
                                                width="50%"
                                                maxHeight="100px"
                                                mb={1}
                                                height="100px"
                                            >
                                                <ImageIcon />
                                            </MDBox>
                                        )}
                                        <MDBox display="flex">
                                            <MDButton
                                                size="small"
                                                variant="outlined"
                                                component="label"
                                                color="info"
                                                startIcon={<UploadIcon />}
                                            >
                                                Click to Upload icon
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={handleIconUpload}
                                                />
                                            </MDButton>
                                        </MDBox>
                                        {newFacility.touched.icons && newFacility.errors.icons && (
                                            <MDTypography color="error">{newFacility.errors.icons}</MDTypography>
                                        )}
                                    </Grid>
                                </MDBox>
                                <MDBox mt={-3} p={4}>
                                    <Button
                                        disabled={isLoading}
                                        fullWidth
                                        type='submit'
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isLoading ?
                                            <span style={{ color: 'black' }}>Loading....</span>
                                            :
                                            <span style={{ color: 'white' }}>Save</span>
                                        }
                                    </Button>
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
