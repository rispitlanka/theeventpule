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

export default function EditVenue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState();
    // const [selectedDate, setSelectedDate] = useState();
    // const [existingDate, setExistingDate] = useState();
    // const [coverImagePreview, setCoverImagePreview] = useState(null);
    // const [coverImageChanged, setCoverImageChanged] = useState(false);
    // const [theatreImagePreview, setTheatreImagePreview] = useState(null);
    // const [theatreImageChanged, setTheatreImageChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // const handleDateChange = (date) => {
    //     setSelectedDate(date);
    // }

    // const handleTheatreImageChange = (event) => {
    //     const file = event.currentTarget.files[0];
    //     editVenue.setFieldValue('theatreImage', file);
    //     setTheatreImagePreview(URL.createObjectURL(file));
    //     setTheatreImageChanged(true);
    // };

    // const handleCoverImageChange = (event) => {
    //     const file = event.currentTarget.files[0];
    //     editVenue.setFieldValue('coverImage', file);
    //     setCoverImagePreview(URL.createObjectURL(file));
    //     setCoverImageChanged(true);
    // };

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
                        location: venue.location,
                        telephone: venue.telephone,
                        ownerName: venue.ownerName,
                        ownerMobile: venue.ownerMobile,
                        ownerEmail: venue.ownerEmail,
                        isActive: venue.isActive,
                        // theatreImage: venue.theatreImage,
                        // coverImage: venue.coverImage,

                    });
                    // setExistingDate(venue.registeredDate);
                    // setSelectedDate(venue.registeredDate);
                    // setTheatreImagePreview(venue.theatreImage);
                    // setCoverImagePreview(venue.coverImage);
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
            location: '',
            city: '',
            telephone: '',
            ownerName: '',
            ownerMobile: '',
            ownerEmail: '',
            // facilities: [],
            // websiteURL: '',
            // latitude: '',
            // longitude: '',
            // licenseInfo: '',
            // description: '',
            isActive: '',
            // registeredDate: '',
            // notes: '',
            // coverImage: '',
            // theatreImage: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            // city: Yup.string().required('Required'),
            // ownerName: Yup.string().required('Required'),
            // ownerMobile: Yup.string()
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
            // try {
            //     if (theatreImageChanged && editVenue.values.theatreImage) {
            //         const file = editVenue.values.theatreImage;

            //         const { data: imageData, error: imageError } = await supabase.storage
            //             .from('theatre_images')
            //             .upload(`images/${file.name}`, file, {
            //                 cacheControl: '3600',
            //                 upsert: false,
            //             });

            //         if (imageError) {
            //             throw imageError;
            //         }

            //         if (imageData) {
            //             const imgURL = supabase.storage.from('theatre_images').getPublicUrl(imageData.path);
            //             values.theatreImage = imgURL.data.publicUrl;
            //         } else {
            //             throw new Error('Failed to upload image');
            //         }
            //     }

            //     if (coverImageChanged && editVenue.values.coverImage) {
            //         const file = editVenue.values.coverImage;

            //         const { data: imageData, error: imageError } = await supabase.storage
            //             .from('theatre_images')
            //             .upload(`cover_images/${file.name}`, file, {
            //                 cacheControl: '3600',
            //                 upsert: false,
            //             });

            //         if (imageError) {
            //             throw imageError;
            //         }

            //         if (imageData) {
            //             const imgURL = supabase.storage.from('theatre_images').getPublicUrl(imageData.path);
            //             values.coverImage = imgURL.data.publicUrl;
            //         } else {
            //             throw new Error('Failed to upload image');
            //         }
            //     }
            // } catch (error) {
            //     console.log(error);
            // }

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

    // const handleDelete = async () => {
    //     setOpenDeleteDialogBox(true);
    // };

    // const closeDeleteDialogBox = () => {
    //     setOpenDeleteDialogBox(false);
    // };

    // const handleDeleteConfirm = async () => {
    //     try {
    //         const { error } = await supabase.from('theatres').delete().eq('id', id);
    //         if (error) {
    //             throw error;
    //         }
    //         console.log('Data deleted successfully');
    //         setOpenDeleteDialogBox(false);
    //         toast.error('Theatre has been successfully deleted!');
    //         setTimeout(() => {
    //             navigate(-1);
    //         }, 1500);
    //     } catch (error) {
    //         console.error('Error deleting data:', error.message);
    //     }
    // };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
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
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Address"
                                                name="location"
                                                value={editVenue.values.location}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.location && Boolean(editVenue.errors.location)}
                                                helperText={editVenue.touched.location && editVenue.errors.location} />
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
                                        {/* <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Website URL"
                                                name="websiteURL"
                                                value={editVenue.values.websiteURL}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.websiteURL && Boolean(editVenue.errors.websiteURL)}
                                                helperText={editVenue.touched.websiteURL && editVenue.errors.websiteURL} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="License Information"
                                                name="licenseInfo"
                                                value={editVenue.values.licenseInfo}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.licenseInfo && Boolean(editVenue.errors.licenseInfo)}
                                                helperText={editVenue.touched.licenseInfo && editVenue.errors.licenseInfo} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Description"
                                                name="description"
                                                value={editVenue.values.description}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.description && Boolean(editVenue.errors.description)}
                                                helperText={editVenue.touched.description && editVenue.errors.description} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField fullWidth
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Notes"
                                                name="notes"
                                                value={editVenue.values.notes}
                                                onChange={editVenue.handleChange}
                                                onBlur={editVenue.handleBlur}
                                                error={editVenue.touched.notes && Boolean(editVenue.errors.notes)}
                                                helperText={editVenue.touched.notes && editVenue.errors.notes} />
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
                                                <Switch label="Status" checked={editVenue.values.isActive} onChange={(e) => editVenue.setFieldValue('isActive', e.target.checked)} />
                                                {editVenue.values.isActive ? 'Active' : 'Inactive'}
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
                                        {/* <MDBox p={1}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                                                    <MDTypography>Theatre Image</MDTypography>
                                                    {theatreImagePreview ? (
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
                                                            <img src={theatreImagePreview} alt="Theatre Preview" style={{ width: '100%', maxHeight: '100px' }} />
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
                                                                onChange={handleTheatreImageChange}
                                                            />
                                                        </MDButton>
                                                    </MDBox>
                                                    {editVenue.touched.theatreImage && editVenue.errors.theatreImage && (
                                                        <MDTypography color="error">{editVenue.errors.theatreImage}</MDTypography>
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
                                                    {editVenue.touched.coverImage && editVenue.errors.coverImage && (
                                                        <MDTypography color="error">{editVenue.errors.coverImage}</MDTypography>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </MDBox> */}
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
            {/* <DeleteDialog
                open={openDeleteDialogBox}
                onClose={closeDeleteDialogBox}
                onDelete={handleDeleteConfirm}
                name={'venue'}
            /> */}
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