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
import { toast } from 'react-toastify';
import MDButton from 'components/MDButton';

export default function AddProjectionType() {
    const [iconPreview, setIconPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleIconUpload = (event) => {
        const file = event.currentTarget.files[0];
        newProjectionType.setFieldValue('icons', file);
        setIconPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        try {
            if (newProjectionType.values.icons) {
                const file = newProjectionType.values.icons;
                const { data: iconData, error: iconError } = await supabase.storage
                    .from('icons')
                    .upload(`projection_type_icons/${file.name}`, file, {
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
            await saveProjectionType(values);
            resetForm();
            toast.info('Projection type has been successfully created!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setIsLoading(false);
        }
    };

    const newProjectionType = useFormik({
        initialValues: {
            projection_type: '',
            icons: '',
        },
        validationSchema: Yup.object({
            projection_type: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    const saveProjectionType = async (values) => {
        try {
            const { data, error } = await supabase
                .from('projection_types')
                .insert([values]);

            if (error) {
                throw error;
            } else {
                console.log('Projection Type added successfully:', data);
            }
        } catch (error) {
            console.error('Error adding Projection type:', error.message);
        }
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={newProjectionType.handleSubmit}>
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
                                    Add New Projection types
                                </MDTypography>

                            </MDBox>
                            <MDBox p={2}>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Projection Type"
                                        name="projection_type"
                                        value={newProjectionType.values.projection_type}
                                        onChange={newProjectionType.handleChange}
                                        onBlur={newProjectionType.handleBlur}
                                        error={newProjectionType.touched.projection_type && Boolean(newProjectionType.errors.projection_type)}
                                        helperText={newProjectionType.touched.projection_type && newProjectionType.errors.projection_type} />
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
                                        {newProjectionType.touched.icons && newProjectionType.errors.icons && (
                                            <MDTypography color="error">{newProjectionType.errors.icons}</MDTypography>
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
        </DashboardLayout>
    )
}
