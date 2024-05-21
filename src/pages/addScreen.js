import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useNavigate, useParams } from 'react-router-dom';
import MDButton from 'components/MDButton';

export default function AddScreen() {

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id: theatreId } = useParams();

  const onSubmit = async (values, { resetForm }) => {
    try {
      await addScreenData(values);
      resetForm();
      toast.info('Screen has been successfully created!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error.message);
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
      const { data, error } = await supabase.from('screens').insert([values]).select('*');
      if (data) {
        console.log('Data inserted successfully:', data);
      }
      if (error) {
        throw error;
      }

    } catch (error) {
      throw new Error('Error inserting data:', error.message);
    }
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
                  <MDBox p={1}>
                    <MDButton color='info' type='submit'>Save</MDButton>
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
