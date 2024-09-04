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
import { Checkbox, FormControlLabel, Switch, TextField } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DeleteDialog from 'components/DeleteDialogBox/deleteDialog';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';

export default function EditEventOrganization() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState();
    // const [selectedDate, setSelectedDate] = useState();
    // const [existingDate, setExistingDate] = useState();
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [coverImageChanged, setCoverImageChanged] = useState(false);
    const [organizationImagePreview, setOrganizationImagePreview] = useState(null);
    const [organizationImageChanged, setOrganizationImageChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // const handleDateChange = (date) => {
    //     setSelectedDate(date);
    // }

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
                        // address: organization.address,
                        // city: organization.city,
                        // telephone: organization.telephone,
                        // ownerName: organization.ownerName,
                        // ownerPhoneNumber: organization.ownerPhoneNumber,
                        // ownerEmail: organization.ownerEmail,
                        // websiteURL: organization.websiteURL,
                        // licenseInfo: organization.licenseInfo,
                        // description: organization.description,
                        // notes: organization.notes,
                        // registeredDate: organization.registeredDate,
                        // isActive: organization.isActive,
                        organizationImage: organization.organizationImage,
                        coverImage: organization.coverImage,

                    });
                    // setExistingDate(organization.registeredDate);
                    // setSelectedDate(organization.registeredDate);
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
            // address: '',
            // city: '',
            // telephone: '',
            // ownerName: '',
            // ownerPhoneNumber: '',
            // ownerEmail: '',
            // facilities: [],
            // websiteURL: '',
            // latitude: '',
            // longitude: '',
            // licenseInfo: '',
            // description: '',
            // isActive: '',
            // registeredDate: '',
            // notes: '',
            coverImage: '',
            organizationImage: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            // city: Yup.string().required('Required'),
            // ownerName: Yup.string().required('Required'),
            // ownerPhoneNumber: Yup.string()
            //     .required('Required')
            //     // .matches(phoneRegExp, 'Mobile number is not valid')
            //     .min(10, 'Not a valid mobile number')
            //     .max(10, 'Not a valid mobile number'),
            // telephone: Yup.string()
            //     .required('Required')
            //     // .matches(phoneRegExp, 'Telephone number is not valid')
            //     .min(10, 'Not a valid telephone number')
            //     .max(10, 'Not a valid telephone number'),
            // ownerEmail: Yup.string().required('Email is required').email('Enter a valid email'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            // values.registeredDate = (dayjs(selectedDate).format("YYYY-MM-DD"));

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

    const handleDelete = async () => {
        setOpenDeleteDialogBox(true);
    };

    const closeDeleteDialogBox = () => {
        setOpenDeleteDialogBox(false);
    };

    const handleDeleteConfirm = async () => {
        try {
            const { error } = await supabase.from('theatres').delete().eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data deleted successfully');
            setOpenDeleteDialogBox(false);
            toast.error('Theatre has been successfully deleted!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error deleting data:', error.message);
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
                                                id="outlined-basic"
                                                label="Name"
                                                name="name"
                                                value={editOrganization.values.name}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.name && Boolean(editOrganization.errors.name)}
                                                helperText={editOrganization.touched.name && editOrganization.errors.name} />
                                        </MDBox>
                                        {/* <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
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
                                                id="outlined-basic"
                                                label="City"
                                                name="city"
                                                value={editOrganization.values.city}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.city && Boolean(editOrganization.errors.city)}
                                                helperText={editOrganization.touched.city && editOrganization.errors.city} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Telephone"
                                                name="telephone"
                                                value={editOrganization.values.telephone}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.telephone && Boolean(editOrganization.errors.telephone)}
                                                helperText={editOrganization.touched.telephone && editOrganization.errors.telephone} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Website URL"
                                                name="websiteURL"
                                                value={editOrganization.values.websiteURL}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.websiteURL && Boolean(editOrganization.errors.websiteURL)}
                                                helperText={editOrganization.touched.websiteURL && editOrganization.errors.websiteURL} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="License Information"
                                                name="licenseInfo"
                                                value={editOrganization.values.licenseInfo}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.licenseInfo && Boolean(editOrganization.errors.licenseInfo)}
                                                helperText={editOrganization.touched.licenseInfo && editOrganization.errors.licenseInfo} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Description"
                                                name="description"
                                                value={editOrganization.values.description}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.description && Boolean(editOrganization.errors.description)}
                                                helperText={editOrganization.touched.description && editOrganization.errors.description} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Notes"
                                                name="notes"
                                                value={editOrganization.values.notes}
                                                onChange={editOrganization.handleChange}
                                                onBlur={editOrganization.handleBlur}
                                                error={editOrganization.touched.notes && Boolean(editOrganization.errors.notes)}
                                                helperText={editOrganization.touched.notes && editOrganization.errors.notes} />
                                        </MDBox> */}
                                        {/* <MDBox p={1} >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        label="Select Registered Date"
                                                        value={selectedDate ? dayjs(selectedDate) : dayjs(existingDate)}
                                                        onChange={handleDateChange}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </MDBox> */}
                                    </Grid>
                                    <Grid item xs={6} >
                                        <MDBox p={1}>
                                            <MDTypography>
                                                Status:
                                                <Switch label="Status" checked={editOrganization.values.isActive} onChange={(e) => editOrganization.setFieldValue('isActive', e.target.checked)} />
                                                {editOrganization.values.isActive ? 'Active' : 'Inactive'}
                                            </MDTypography>
                                        </MDBox>
                                        {/* <MDBox p={1} display="flex" flexDirection="row" alignItems="center">
                                            <MDTypography mr={1}>Facilities: </MDTypography>
                                            {facilitiesData && facilitiesData.length > 0 && facilitiesData.map((facility) => (
                                                <MDBox key={facility.id} mr={1}>
                                                    <FormControlLabel control={<Checkbox checked={selectedFacilityIds.includes(facility.id)} onChange={() => handleCheckboxChange(facility.id)} />} label={facility.facility_name} />
                                                </MDBox>
                                            ))}
                                        </MDBox> */}
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
                                {/* <Grid mt={2}>
                                    <MDTypography>Theatre Owner Info</MDTypography>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
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
                                            id="outlined-basic"
                                            label="Owner Phone Number"
                                            name="ownerPhoneNumber"
                                            value={editOrganization.values.ownerPhoneNumber}
                                            onChange={editOrganization.handleChange}
                                            onBlur={editOrganization.handleBlur}
                                            error={editOrganization.touched.ownerPhoneNumber && Boolean(editOrganization.errors.ownerPhoneNumber)}
                                            helperText={editOrganization.touched.ownerPhoneNumber && editOrganization.errors.ownerPhoneNumber} />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Owner Mail"
                                            name="ownerEmail"
                                            value={editOrganization.values.ownerEmail}
                                            onChange={editOrganization.handleChange}
                                            onBlur={editOrganization.handleBlur}
                                            error={editOrganization.touched.ownerEmail && Boolean(editOrganization.errors.ownerEmail)}
                                            helperText={editOrganization.touched.ownerEmail && editOrganization.errors.ownerEmail} />
                                    </MDBox>
                                </Grid> */}
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
            <DeleteDialog
                open={openDeleteDialogBox}
                onClose={closeDeleteDialogBox}
                onDelete={handleDeleteConfirm}
                name={'organization'}
            />
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