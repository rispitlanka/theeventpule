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

export default function AddTheatre() {
  const navigate = useNavigate();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);
  const [regDate, setRegDate] = useState();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [theatreImagePreview, setTheatreImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (date) => {
    setRegDate(date);
  }

  const handleCheckboxChange = (facilityId) => {
    setSelectedFacilityIds((prevSelected) =>
      prevSelected.includes(facilityId)
        ? prevSelected.filter((id) => id !== facilityId)
        : [...prevSelected, facilityId]
    );
  };

  const handleCoverImageChange = (event) => {
    const file = event.currentTarget.files[0];
    newTheatre.setFieldValue('coverImage', file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleTheatreImageChange = (event) => {
    const file = event.currentTarget.files[0];
    newTheatre.setFieldValue('theatreImage', file);
    setTheatreImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { data, error } = await supabase.from('facilities').select('*').eq('isActive', true);
        if (error) throw error;
        if (data) {
          setFacilitiesData(data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error.message);
      }
    };
    fetchFacilities();
  }, [])

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      if (newTheatre.values.coverImage) {
        const file = newTheatre.values.coverImage;

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
          const imgURL = supabase.storage.from('theatre_images').getPublicUrl(imageData.path);
          values.coverImage = imgURL.data.publicUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      if (newTheatre.values.theatreImage) {
        const file = newTheatre.values.theatreImage;

        const { data: imageData, error: imageError } = await supabase.storage
          .from('theatre_images')
          .upload(`images/${file.name}`, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (imageError) {
          throw imageError;
        }

        if (imageData) {
          const imgURL = supabase.storage.from('theatre_images').getPublicUrl(imageData.path);
          values.theatreImage = imgURL.data.publicUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const selectedFacilityNames = facilitiesData
        .filter(facility => selectedFacilityIds.includes(facility.id))
        .map(facility => facility.facility_name);
      values.facilities = selectedFacilityNames
      const formattedDate = dayjs(regDate).format('YYYY-MM-DD');
      values.registeredDate = formattedDate;

      await addTheatreData(values);
      resetForm();
      toast.info('Theatre has been successfully created!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
      setIsLoading(false);

    } catch (error) {
      console.error('Error submitting form:', error.message);
      setIsLoading(false);
    }
  };

  const newTheatre = useFormik({
    initialValues: {
      name: '',
      address: '',
      city: '',
      telephone: '',
      ownerName: '',
      ownerPhoneNumber: '',
      ownerEmail: '',
      facilities: [],
      websiteURL: '',
      // latitude: '',
      // longitude: '',
      licenseInfo: '',
      description: '',
      isActive: true,
      registeredDate: '',
      notes: '',
      coverImage: '',
      theatreImage: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      ownerName: Yup.string().required('Required'),
      ownerPhoneNumber: Yup.string()
        .required('Required')
        // .matches(phoneRegExp, 'Mobile number is not valid')
        .min(10, 'Not a valid mobile number')
        .max(10, 'Not a valid mobile number'),
      telephone: Yup.string()
        .required('Required')
        // .matches(phoneRegExp, 'Telephone number is not valid')
        .min(10, 'Not a valid telephone number')
        .max(10, 'Not a valid telephone number'),
      ownerEmail: Yup.string().required('Email is required').email('Enter a valid email'),
    }),
    onSubmit,
  });

  const addTheatreData = async (values) => {
    try {
      const { data, error } = await supabase.from('theatres').insert([values]).select('*');
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
          <form onSubmit={newTheatre.handleSubmit}>
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
                  Add New Theatres
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <MDTypography>Theatre Info</MDTypography>
                <Grid container spacing={5} display={'flex'} flexDirection={'row'}>
                  <Grid item xs={6}>
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Name"
                        name="name"
                        value={newTheatre.values.name}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.name && Boolean(newTheatre.errors.name)}
                        helperText={newTheatre.touched.name && newTheatre.errors.name} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Address"
                        name="address"
                        value={newTheatre.values.address}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.address && Boolean(newTheatre.errors.address)}
                        helperText={newTheatre.touched.address && newTheatre.errors.address} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="City"
                        name="city"
                        value={newTheatre.values.city}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.city && Boolean(newTheatre.errors.city)}
                        helperText={newTheatre.touched.city && newTheatre.errors.city} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Telephone"
                        name="telephone"
                        value={newTheatre.values.telephone}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.telephone && Boolean(newTheatre.errors.telephone)}
                        helperText={newTheatre.touched.telephone && newTheatre.errors.telephone} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Website URL"
                        name="websiteURL"
                        value={newTheatre.values.websiteURL}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.websiteURL && Boolean(newTheatre.errors.websiteURL)}
                        helperText={newTheatre.touched.websiteURL && newTheatre.errors.websiteURL} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="License Information"
                        name="licenseInfo"
                        value={newTheatre.values.licenseInfo}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.licenseInfo && Boolean(newTheatre.errors.licenseInfo)}
                        helperText={newTheatre.touched.licenseInfo && newTheatre.errors.licenseInfo} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Description"
                        name="description"
                        value={newTheatre.values.description}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.description && Boolean(newTheatre.errors.description)}
                        helperText={newTheatre.touched.description && newTheatre.errors.description} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField fullWidth
                        variant="outlined"
                        id="outlined-basic"
                        label="Notes"
                        name="notes"
                        value={newTheatre.values.notes}
                        onChange={newTheatre.handleChange}
                        onBlur={newTheatre.handleBlur}
                        error={newTheatre.touched.notes && Boolean(newTheatre.errors.notes)}
                        helperText={newTheatre.touched.notes && newTheatre.errors.notes} />
                    </MDBox>
                    <MDBox p={1} >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="Select Registered Date"
                            value={regDate}
                            onChange={handleDateChange}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </MDBox>
                  </Grid>
                  <Grid item xs={6} >
                    <MDBox p={1}>
                      <MDTypography>
                        Status:
                        <Switch label="Status" checked={newTheatre.values.isActive} onChange={(e) => newTheatre.setFieldValue('isActive', e.target.checked)} />
                        {newTheatre.values.isActive ? 'Active' : 'Inactive'}
                      </MDTypography>
                    </MDBox>
                    <MDBox p={1} display="flex" flexDirection="row" alignItems="center">
                      <MDTypography mr={1}>Facilities: </MDTypography>
                      {facilitiesData && facilitiesData.length > 0 && facilitiesData.map((facility) => (
                        <MDBox key={facility.id} mr={1}>
                          <FormControlLabel control={<Checkbox checked={selectedFacilityIds.includes(facility.id)} onChange={() => handleCheckboxChange(facility.id)} />} label={facility.facility_name} />
                        </MDBox>
                      ))}
                    </MDBox>
                    <MDBox p={1}>
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
                          {newTheatre.touched.theatreImage && newTheatre.errors.theatreImage && (
                            <MDTypography color="error">{newTheatre.errors.theatreImage}</MDTypography>
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
                          {newTheatre.touched.coverImage && newTheatre.errors.coverImage && (
                            <MDTypography color="error">{newTheatre.errors.coverImage}</MDTypography>
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Grid>
                </Grid>
                <Grid mt={2}>
                  <MDTypography>Theatre Owner Info</MDTypography>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Owner Name"
                      name="ownerName"
                      value={newTheatre.values.ownerName}
                      onChange={newTheatre.handleChange}
                      onBlur={newTheatre.handleBlur}
                      error={newTheatre.touched.ownerName && Boolean(newTheatre.errors.ownerName)}
                      helperText={newTheatre.touched.ownerName && newTheatre.errors.ownerName} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Owner Phone Number"
                      name="ownerPhoneNumber"
                      value={newTheatre.values.ownerPhoneNumber}
                      onChange={newTheatre.handleChange}
                      onBlur={newTheatre.handleBlur}
                      error={newTheatre.touched.ownerPhoneNumber && Boolean(newTheatre.errors.ownerPhoneNumber)}
                      helperText={newTheatre.touched.ownerPhoneNumber && newTheatre.errors.ownerPhoneNumber} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Owner Mail"
                      name="ownerEmail"
                      value={newTheatre.values.ownerEmail}
                      onChange={newTheatre.handleChange}
                      onBlur={newTheatre.handleBlur}
                      error={newTheatre.touched.ownerEmail && Boolean(newTheatre.errors.ownerEmail)}
                      helperText={newTheatre.touched.ownerEmail && newTheatre.errors.ownerEmail} />
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