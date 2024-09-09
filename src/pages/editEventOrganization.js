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
import { Switch, TextField } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

export default function EditEventOrganization() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [coverImageChanged, setCoverImageChanged] = useState(false);
    const [organizationImagePreview, setOrganizationImagePreview] = useState(null);
    const [organizationImageChanged, setOrganizationImageChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOrganizationImageChange = (event) => {
        const file = event.currentTarget.files[0];
        editOrganization.setFieldValue('organizationImage', file);
        setOrganizationImagePreview(URL.createObjectURL(file));
        setOrganizationImageChanged(true);
    };

    const handleCoverImageChange = (event) => {
        const file = event.currentTarget.files[0];
        editOrganization.setFieldValue('coverImage', file);
        setCoverImagePreview(URL.createObjectURL(file));
        setCoverImageChanged(true);
    };

    useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                const { data, error } = await supabase.from('eventOrganizations').select('*').eq('id', id);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const organization = data[0];
                    editOrganization.setValues({
                        name: organization.name,
                        address: organization.address,
                        telephone: organization.telephone,
                        ownerName: organization.ownerName,
                        ownerMobile: organization.ownerMobile,
                        ownerEmail: organization.ownerEmail,
                        isActive: organization.isActive,
                        organizationImage: organization.organizationImage,
                        coverImage: organization.coverImage,

                    });
                    setOrganizationImagePreview(organization.organizationImage);
                    setCoverImagePreview(organization.coverImage);
                }
            } catch (error) {
                console.error('Error fetching organization data:', error.message);
            }
        };

        fetchOrganizationData();
    }, [id]);

    const editOrganization = useFormik({
        initialValues: {
            name: '',
            address: '',
            telephone: '',
            ownerName: '',
            ownerMobile: '',
            ownerEmail: '',
            isActive: '',
            coverImage: '',
            organizationImage: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            telephone: Yup.string()
                .required('Required')
                .min(10, 'Not a valid Mobile number')
                .max(10, 'Not a valid Mobile number'),
            ownerMobile: Yup.string()
                .min(10, 'Not a valid Mobile number')
                .max(10, 'Not a valid Mobile number'),
            ownerEmail: Yup.string()
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid Email')
                .email('Enter a valid ownerEmail'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);

            try {
                if (organizationImageChanged && editOrganization.values.organizationImage) {
                    const file = editOrganization.values.organizationImage;

                    const { data: imageData, error: imageError } = await supabase.storage
                        .from('organization_images')
                        .upload(`profile_images/${file.name}`, file, {
                            cacheControl: '3600',
                            upsert: false,
                        });

                    if (imageError) {
                        throw imageError;
                    }

                    if (imageData) {
                        const imgURL = supabase.storage.from('organization_images').getPublicUrl(imageData.path);
                        values.organizationImage = imgURL.data.publicUrl;
                    } else {
                        throw new Error('Failed to upload image');
                    }
                }

                if (coverImageChanged && editOrganization.values.coverImage) {
                    const file = editOrganization.values.coverImage;

                    const { data: imageData, error: imageError } = await supabase.storage
                        .from('theatre_images')
                        .upload(`cover_images/${file.name}`, file, {
                            cacheControl: '3600',
                            upsert: false,
                        });

                    if (imageError) {
                        throw imageError;
                    }

                    if (imageData) {
                        const imgURL = supabase.storage.from('organization_images').getPublicUrl(imageData.path);
                        values.coverImage = imgURL.data.publicUrl;
                    } else {
                        throw new Error('Failed to upload image');
                    }
                }
            } catch (error) {
                console.log(error);
            }

            await editOrganizationData(values);
            resetForm();
            toast.info('Organization has been successfully updated!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
            setIsLoading(false);
        },
    });

    const editOrganizationData = async (values) => {
        try {
            const { error } = await supabase.from('eventOrganizations').update(values).eq('id', id);
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
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={editOrganization.handleSubmit}>
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
                                    Manage Organization
                                </MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <MDTypography>Organization Info</MDTypography>
                                <Grid container spacing={5} display={'flex'} flexDirection={'row'}>
                                    <Grid item xs={6}>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="name"
                                                label="Name"
                                                name="name"
                                                value={editOrganization.values.name}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.name && Boolean(editOrganization.errors.name)}
                                                helperText={editOrganization.touched.name && editOrganization.errors.name} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="address"
                                                label="Address"
                                                name="address"
                                                value={editOrganization.values.address}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.address && Boolean(editOrganization.errors.address)}
                                                helperText={editOrganization.touched.address && editOrganization.errors.address} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="telephone"
                                                label="Telephone"
                                                name="telephone"
                                                value={editOrganization.values.telephone}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.telephone && Boolean(editOrganization.errors.telephone)}
                                                helperText={editOrganization.touched.telephone && editOrganization.errors.telephone} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={6} >
                                        <MDBox p={1}>
                                            <MDTypography>
                                                Status:
                                                <Switch label="Status" checked={editOrganization.values.isActive} onChange={(e) => editOrganization.setFieldValue('isActive', e.target.checked)} />
                                                {editOrganization.values.isActive ? 'Active' : 'Inactive'}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox p={1}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                                                    <MDTypography>Logo Image</MDTypography>
                                                    {organizationImagePreview ? (
                                                        <MDBox
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            border="1px dashed"
                                                            borderRadius="4px"
                                                            width="50%"
                                                            maxHeight="200px"
                                                            mb={1}
                                                            height="100px"
                                                        >
                                                            <img src={organizationImagePreview} alt="Theatre Preview" style={{ width: '100%', maxHeight: '100px' }} />
                                                        </MDBox>
                                                    ) : (
                                                        <MDBox
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            border="1px dashed"
                                                            borderRadius="4px"
                                                            width="50%"
                                                            maxHeheight="200px"
                                                            mb={1}
                                                            height="100px"
                                                        >
                                                            <ImageIcon />
                                                        </MDBox>
                                                    )}
                                                    <MDBox display="flex" justifyContent='left'>
                                                        <MDButton
                                                            size="small"
                                                            variant="outlined"
                                                            component="label"
                                                            color="info"
                                                            startIcon={<UploadIcon />}
                                                        >
                                                            Upload
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={handleOrganizationImageChange}
                                                            />
                                                        </MDButton>
                                                    </MDBox>
                                                    {editOrganization.touched.organizationImage && editOrganization.errors.organizationImage && (
                                                        <MDTypography color="error">{editOrganization.errors.organizationImage}</MDTypography>
                                                    )}
                                                </Grid>
                                                <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                                                    <MDTypography>Cover Image</MDTypography>
                                                    {coverImagePreview ? (
                                                        <MDBox
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            border="1px dashed"
                                                            borderRadius="4px"
                                                            width="50%"
                                                            maxHeight="200px"
                                                            mb={1}
                                                            height="100px"
                                                        >
                                                            <img src={coverImagePreview} alt="Cover Preview" style={{ width: '100%', maxHeight: '100px' }} />
                                                        </MDBox>
                                                    ) : (
                                                        <MDBox
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            border="1px dashed"
                                                            borderRadius="4px"
                                                            width="50%"
                                                            maxHeight="200px"
                                                            mb={1}
                                                            height="100px"
                                                        >
                                                            <ImageIcon />
                                                        </MDBox>
                                                    )}
                                                    <MDBox display="flex" justifyContent='left'>
                                                        <MDButton
                                                            size="small"
                                                            variant="outlined"
                                                            component="label"
                                                            color="info"
                                                            startIcon={<UploadIcon />}
                                                        >
                                                            Upload
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={handleCoverImageChange}
                                                            />
                                                        </MDButton>
                                                    </MDBox>
                                                    {editOrganization.touched.coverImage && editOrganization.errors.coverImage && (
                                                        <MDTypography color="error">{editOrganization.errors.coverImage}</MDTypography>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </MDBox>
                                    </Grid>
                                </Grid>
                                <Grid mt={2}>
                                    <MDTypography>Organization Owner Info</MDTypography>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="ownerName"
                                            label="Owner Name"
                                            name="ownerName"
                                            value={editOrganization.values.ownerName}
                                            onChange={editOrganization.handleChange}
                                            onBlur={editOrganization.handleBlur}
                                            error={editOrganization.touched.ownerName && Boolean(editOrganization.errors.ownerName)}
                                            helperText={editOrganization.touched.ownerName && editOrganization.errors.ownerName} />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="ownerMobile"
                                            label="Owner Phone Number"
                                            name="ownerMobile"
                                            value={editOrganization.values.ownerMobile}
                                            onChange={editOrganization.handleChange}
                                            onBlur={editOrganization.handleBlur}
                                            error={editOrganization.touched.ownerMobile && Boolean(editOrganization.errors.ownerMobile)}
                                            helperText={editOrganization.touched.ownerMobile && editOrganization.errors.ownerMobile} />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField fullWidth
                                            variant="outlined"
                                            id="ownerEmail"
                                            label="Owner Mail"
                                            name="ownerEmail"
                                            value={editOrganization.values.ownerEmail}
                                            onChange={editOrganization.handleChange}
                                            onBlur={editOrganization.handleBlur}
                                            error={editOrganization.touched.ownerEmail && Boolean(editOrganization.errors.ownerEmail)}
                                            helperText={editOrganization.touched.ownerEmail && editOrganization.errors.ownerEmail} />
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