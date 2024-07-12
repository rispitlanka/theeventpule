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
import { useNavigate } from 'react-router-dom';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import MDButton from 'components/MDButton';
import { toast, ToastContainer } from 'react-toastify';

export default function AddCensorType() {
    const [iconPreview, setIconPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleIconUpload = (event) => {
        const file = event.currentTarget.files[0];
        newCensorType.setFieldValue('icons', file);
        setIconPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        try {
            if (newCensorType.values.icons) {
                const file = newCensorType.values.icons;
                const { data: iconData, error: iconError } = await supabase.storage
                    .from('icons')
                    .upload(`censor_type_icons/${file.name}`, file, {
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
            await saveCensorType(values);
            resetForm();
            toast.info('Censor has been successfully created!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setIsLoading(false);
        }
    };

    const newCensorType = useFormik({
        initialValues: {
            censor_type: '',
            icons: '',
        },
        validationSchema: Yup.object({
            censor_type: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const saveCensorType = async (values) => {
        try {
            const { data, error } = await supabase
                .from('censor_types')
                .insert([values]);

            if (error) {
                throw error;
            } else {
                console.log('Censor Types added successfully:', data);
            }
        } catch (error) {
            console.error('Error adding Censor Types:', error.message);
        }
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={newCensorType.handleSubmit}>
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
                                    Add New Censor Types
                                </MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Censor-Type"
                                        name="censor_type"
                                        value={newCensorType.values.censor_type}
                                        onChange={newCensorType.handleChange}
                                        onBlur={newCensorType.handleBlur}
                                        error={newCensorType.touched.censor_type && Boolean(newCensorType.errors.censor_type)}
                                        helperText={newCensorType.touched.censor_type && newCensorType.errors.censor_type} />
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
                                        {newCensorType.touched.icons && newCensorType.errors.icons && (
                                            <MDTypography color="error">{newCensorType.errors.icons}</MDTypography>
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
