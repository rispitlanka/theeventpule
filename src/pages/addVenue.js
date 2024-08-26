import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
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

export default function AddVenue() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase.from('venue_locations').select('*');
        if (error) throw error;
        if (data) {
          setLocationData(data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error.message);
      }
    };
    fetchLocations();
  }, [])

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      values.locationId = selectedLocationId;
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
      locationId: '',
      telephone: '',
      ownerName: '',
      ownerMobile: '',
      ownerEmail: '',
      isActive: true,
      isSeat: false,
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
                      <FormControl fullWidth>
                        <InputLabel>Select Location</InputLabel>
                        <Select
                          label="Select Location"
                          value={selectedLocationId}
                          onChange={(e) => setSelectedLocationId(e.target.value)}
                          sx={{ height: '45px' }}
                        >
                          {locationData.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                              {location.city}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </MDBox>
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
                  </Grid>
                  <Grid item xs={6} >
                    <MDBox p={1}>
                      <MDTypography>
                        Status:
                        <Switch label="Status" checked={newVenue.values.isActive} onChange={(e) => newVenue.setFieldValue('isActive', e.target.checked)} />
                        {newVenue.values.isActive ? 'Active' : 'Inactive'}
                      </MDTypography>
                    </MDBox>
                    <MDBox p={1}>
                      <MDTypography>
                        Enable Seat Setup:
                        <Switch label="Seats" checked={newVenue.values.isSeat} onChange={(e) => newVenue.setFieldValue('isSeat', e.target.checked)} />
                        {newVenue.values.isSeat ? 'Yes' : 'No'}
                      </MDTypography>
                    </MDBox>
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