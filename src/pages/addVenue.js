import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';

export default function AddVenue() {
  const navigate = useNavigate();
  //   const [facilitiesData, setFacilitiesData] = useState([]);
  //   const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);
  //   const [regDate, setRegDate] = useState();
  //   const [coverImagePreview, setCoverImagePreview] = useState(null);
  //   const [theatreImagePreview, setTheatreImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const handleDateChange = (date) => {
  //   setRegDate(date);
  // }

  //   const handleCheckboxChange = (facilityId) => {
  //     setSelectedFacilityIds((prevSelected) =>
  //       prevSelected.includes(facilityId)
  //         ? prevSelected.filter((id) => id !== facilityId)
  //         : [...prevSelected, facilityId]
  //     );
  //   };

  //   const handleCoverImageChange = (event) => {
  //     const file = event.currentTarget.files[0];
  //     newVenue.setFieldValue('coverImage', file);
  //     setCoverImagePreview(URL.createObjectURL(file));
  //   };

  //   const handleTheatreImageChange = (event) => {
  //     const file = event.currentTarget.files[0];
  //     newVenue.setFieldValue('theatreImage', file);
  //     setTheatreImagePreview(URL.createObjectURL(file));
  //   };

  //   useEffect(() => {
  //     const fetchFacilities = async () => {
  //       try {
  //         const { data, error } = await supabase.from('facilities').select('*').eq('isActive', true);
  //         if (error) throw error;
  //         if (data) {
  //           setFacilitiesData(data);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching questions:', error.message);
  //       }
  //     };
  //     fetchFacilities();
  //   }, [])

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      //   if (newVenue.values.coverImage) {
      //     const file = newVenue.values.coverImage;

      //     const { data: imageData, error: imageError } = await supabase.storage
      //       .from('theatre_images')
      //       .upload(`cover_images/${file.name}`, file, {
      //         cacheControl: '3600',
      //         upsert: false,
      //       });

      //     if (imageError) {
      //       throw imageError;
      //     }

      //     if (imageData) {
      //       const imgURL = supabase.storage.from('theatre_images').getPublicUrl(imageData.path);
      //       values.coverImage = imgURL.data.publicUrl;
      //     } else {
      //       throw new Error('Failed to upload image');
      //     }
      //   }

      //   if (newVenue.values.theatreImage) {
      //     const file = newVenue.values.theatreImage;

      //     const { data: imageData, error: imageError } = await supabase.storage
      //       .from('theatre_images')
      //       .upload(`images/${file.name}`, file, {
      //         cacheControl: '3600',
      //         upsert: false,
      //       });

      //     if (imageError) {
      //       throw imageError;
      //     }

      //     if (imageData) {
      //       const imgURL = supabase.storage.from('theatre_images').getPublicUrl(imageData.path);
      //       values.theatreImage = imgURL.data.publicUrl;
      //     } else {
      //       throw new Error('Failed to upload image');
      //     }
      //   }

      //   const selectedFacilityNames = facilitiesData
      //     .filter(facility => selectedFacilityIds.includes(facility.id))
      //     .map(facility => facility.facility_name);
      //   values.facilities = selectedFacilityNames
      //   const formattedDate = dayjs(regDate).format('YYYY-MM-DD');
      //   values.registeredDate = dayjs(new Date).format('YYYY-MM-DD');

      await addVenue(values);
      resetForm();
      toast.info('Venue has been successfully created!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
      setIsLoading(false);

    } catch (error) {
      console.error('Error submitting form:', error.message);
      setIsLoading(false);
    }
  };

  const newVenue = useFormik({
    initialValues: {
      name: '',
      location: '',
      //   city: '',
      telephone: '',
      ownerName: '',
      ownerMobile: '',
      ownerEmail: '',
      //   facilities: [],
      //   websiteURL: '',
      //   latitude: '',
      //   longitude: '',
      //   licenseInfo: '',
      //   description: '',
      isActive: true,
      //   registeredDate: '',
      //   notes: '',
      //   coverImage: '',
      //   theatreImage: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      //   city: Yup.string().required('Required'),
      //   ownerName: Yup.string().required('Required'),
      //   ownerMobile: Yup.string()
      //     .required('Required')
      //     .matches(phoneRegExp, 'Mobile number is not valid')
      //     .min(10, 'Not a valid telephone number')
      //     .max(10, 'Not a valid telephone number'),
      //   telephone: Yup.string()
      //     .required('Required')
      //     .matches(phoneRegExp, 'Telephone number is not valid')
      //     .min(10, 'Not a valid telephone number')
      //     .max(10, 'Not a valid telephone number'),
      //   ownerEmail: Yup.string().required('Email is required').ownerEmail('Enter a valid ownerEmail'),
    }),
    onSubmit,
  });

  const addVenue = async (values) => {
    try {
      const { data, error } = await supabase.from('venues').insert([values]).select('*');
      if (data) {
        console.log('Data added succesfully:', data);
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
          <form onSubmit={newVenue.handleSubmit}>
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
                  Add New Venue
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
                        value={newVenue.values.name}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.name && Boolean(newVenue.errors.name)}
                        helperText={newVenue.touched.name && newVenue.errors.name} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Location"
                        name="location"
                        value={newVenue.values.location}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.location && Boolean(newVenue.errors.location)}
                        helperText={newVenue.touched.location && newVenue.errors.location} />
                    </MDBox>
                    {/* <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="City"
                        name="city"
                        value={newVenue.values.city}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.city && Boolean(newVenue.errors.city)}
                        helperText={newVenue.touched.city && newVenue.errors.city} />
                    </MDBox> */}
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Telephone"
                        name="telephone"
                        value={newVenue.values.telephone}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.telephone && Boolean(newVenue.errors.telephone)}
                        helperText={newVenue.touched.telephone && newVenue.errors.telephone} />
                    </MDBox>
                    {/* <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Website URL"
                        name="websiteURL"
                        value={newVenue.values.websiteURL}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.websiteURL && Boolean(newVenue.errors.websiteURL)}
                        helperText={newVenue.touched.websiteURL && newVenue.errors.websiteURL} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="License Information"
                        name="licenseInfo"
                        value={newVenue.values.licenseInfo}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.licenseInfo && Boolean(newVenue.errors.licenseInfo)}
                        helperText={newVenue.touched.licenseInfo && newVenue.errors.licenseInfo} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Description"
                        name="description"
                        value={newVenue.values.description}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.description && Boolean(newVenue.errors.description)}
                        helperText={newVenue.touched.description && newVenue.errors.description} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Notes"
                        name="notes"
                        value={newVenue.values.notes}
                        onChange={newVenue.handleChange}
                        onBlur={newVenue.handleBlur}
                        error={newVenue.touched.notes && Boolean(newVenue.errors.notes)}
                        helperText={newVenue.touched.notes && newVenue.errors.notes} />
                    </MDBox> */}
                    {/* <MDBox p={1} >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="Select Registered Date"
                            value={regDate}
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
                        <Switch label="Status" checked={newVenue.values.isActive} onChange={(e) => newVenue.setFieldValue('isActive', e.target.checked)} />
                        {newVenue.values.isActive ? 'Active' : 'Inactive'}
                      </MDTypography>
                    </MDBox>
                    {/* <MDBox p={1} display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
                      <MDTypography mr={1}>Facilities: </MDTypography>
                      {facilitiesData && facilitiesData.length > 0 && facilitiesData.map((facility) => (
                        <MDBox key={facility.id} mr={1} minWidth="100px">
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
                          {newVenue.touched.theatreImage && newVenue.errors.theatreImage && (
                            <MDTypography color="error">{newVenue.errors.theatreImage}</MDTypography>
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
                          {newVenue.touched.coverImage && newVenue.errors.coverImage && (
                            <MDTypography color="error">{newVenue.errors.coverImage}</MDTypography>
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
                      value={newVenue.values.ownerName}
                      onChange={newVenue.handleChange}
                      onBlur={newVenue.handleBlur}
                      error={newVenue.touched.ownerName && Boolean(newVenue.errors.ownerName)}
                      helperText={newVenue.touched.ownerName && newVenue.errors.ownerName} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Owner Phone Number"
                      name="ownerMobile"
                      value={newVenue.values.ownerMobile}
                      onChange={newVenue.handleChange}
                      onBlur={newVenue.handleBlur}
                      error={newVenue.touched.ownerMobile && Boolean(newVenue.errors.ownerMobile)}
                      helperText={newVenue.touched.ownerMobile && newVenue.errors.ownerMobile} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Owner Mail"
                      name="ownerEmail"
                      value={newVenue.values.ownerEmail}
                      onChange={newVenue.handleChange}
                      onBlur={newVenue.handleBlur}
                      error={newVenue.touched.ownerEmail && Boolean(newVenue.errors.ownerEmail)}
                      helperText={newVenue.touched.ownerEmail && newVenue.errors.ownerEmail} />
                  </MDBox>
                </Grid>
                <MDBox p={1} display={'flex'} flexDirection={'row'} alignItems='center'>
                  <MDButton color='info' type='submit' disabled={isLoading}>Save</MDButton>
                  {isLoading &&
                    <MDTypography variant='body2' ml={1}>saving....</MDTypography>
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