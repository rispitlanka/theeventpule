import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';

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
import { useNavigate, useParams } from 'react-router-dom';

export default function AddScreen() {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id: theatreId } = useParams();
  console.log(theatreId);


  const onSubmit = async (values, { resetForm }) => {
    try {
      await addScreenData(values);
      setSnackbarOpen(true);
      setSnackbarType('success');
      resetForm();
      navigate(-1);
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setSnackbarOpen(true);
      setSnackbarType('error');
      setError(error.message);
    }
  };

  const newScreen = useFormik({
    initialValues: {
      name: '',
      width: '',
      height: '',
      soundType: '',
      projectionType: '',
      facilities: '',
      theatreId: theatreId,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
    }),
    onSubmit,
  });



  const addScreenData = async (values) => {
    try {
      const { data, error } = await supabase.from('screens').insert([values]);
      if (error) {
        throw error;
      }
      console.log('Data inserted successfully:', data);
    } catch (error) {
      throw new Error('Error inserting data:', error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <DashboardLayout><DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <form onSubmit={newScreen.handleSubmit}>
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
                    Add New Screens
                  </MDTypography>
                  <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                    <Button type='submit'>Save</Button>
                  </MDBox>
                </MDBox>
                <MDBox p={2}>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Name"
                      name="name"
                      value={newScreen.values.name}
                      onChange={newScreen.handleChange}
                      onBlur={newScreen.handleBlur}
                      error={newScreen.touched.name && Boolean(newScreen.errors.name)}
                      helperText={newScreen.touched.name && newScreen.errors.name} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Width"
                      name="width"
                      value={newScreen.values.width}
                      onChange={newScreen.handleChange}
                      onBlur={newScreen.handleBlur}
                      error={newScreen.touched.width && Boolean(newScreen.errors.width)}
                      helperText={newScreen.touched.width && newScreen.errors.width} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Height"
                      name="height"
                      value={newScreen.values.height}
                      onChange={newScreen.handleChange}
                      onBlur={newScreen.handleBlur}
                      error={newScreen.touched.height && Boolean(newScreen.errors.height)}
                      helperText={newScreen.touched.height && newScreen.errors.height} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Sound Type"
                      name="soundType"
                      value={newScreen.values.soundType}
                      onChange={newScreen.handleChange}
                      onBlur={newScreen.handleBlur}
                      error={newScreen.touched.soundType && Boolean(newScreen.errors.soundType)}
                      helperText={newScreen.touched.soundType && newScreen.errors.soundType} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Projection Type"
                      name="projectionType"
                      value={newScreen.values.projectionType}
                      onChange={newScreen.handleChange}
                      onBlur={newScreen.handleBlur}
                      error={newScreen.touched.projectionType && Boolean(newScreen.errors.projectionType)}
                      helperText={newScreen.touched.projectionType && newScreen.errors.projectionType} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Facilities"
                      name="facilities"
                      value={newScreen.values.facilities}
                      onChange={newScreen.handleChange}
                      onBlur={newScreen.handleBlur}
                      error={newScreen.touched.facilities && Boolean(newScreen.errors.facilities)}
                      helperText={newScreen.touched.facilities && newScreen.errors.facilities} />
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
        content={snackbarType === 'success' ? 'New screen has been added successfully!' : 'Failed to add new screen!'}
        open={snackbarOpen}
        close={handleCloseSnackbar}
        time={2500}
        bgWhite
      />
    </DashboardLayout>
  )
}
