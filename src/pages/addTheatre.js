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
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';

export default function AddTheatre() {
  const navigate = useNavigate();

  const onSubmit = async (values, { resetForm }) => {
    try {
      await addTheatreData(values);
      resetForm();
      toast.info('Theatre has been successfully created!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setError(error.message);
    }
  };

  const newTheatre = useFormik({
    initialValues: {
      name: '',
      address: '',
      city: '',
      telephone: '',
      coordinatorName: '',
      coordinatorMobile: '',
      coordinatorMail: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      coordinatorName: Yup.string().required('Required'),
      coordinatorMobile: Yup.string()
        .required('Required')
        // .matches(phoneRegExp, 'Mobile number is not valid')
        .min(10, 'Not a valid mobile number')
        .max(10, 'Not a valid mobile number'),
      telephone: Yup.string()
        .required('Required')
        // .matches(phoneRegExp, 'Telephone number is not valid')
        .min(10, 'Not a valid telephone number')
        .max(10, 'Not a valid telephone number'),
      coordinatorMail: Yup.string().required('Email is required').email('Enter a valid email'),
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
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="outlined-basic"
                    label="Coordinator Name"
                    name="coordinatorName"
                    value={newTheatre.values.coordinatorName}
                    onChange={newTheatre.handleChange}
                    onBlur={newTheatre.handleBlur}
                    error={newTheatre.touched.coordinatorName && Boolean(newTheatre.errors.coordinatorName)}
                    helperText={newTheatre.touched.coordinatorName && newTheatre.errors.coordinatorName} />
                </MDBox>
                <MDBox p={1}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="outlined-basic"
                    label="Coordinator Mobile"
                    name="coordinatorMobile"
                    value={newTheatre.values.coordinatorMobile}
                    onChange={newTheatre.handleChange}
                    onBlur={newTheatre.handleBlur}
                    error={newTheatre.touched.coordinatorMobile && Boolean(newTheatre.errors.coordinatorMobile)}
                    helperText={newTheatre.touched.coordinatorMobile && newTheatre.errors.coordinatorMobile} />
                </MDBox>
                <MDBox p={1}>
                  <TextField fullWidth
                    variant="outlined"
                    id="outlined-basic"
                    label="Coordinator Mail"
                    name="coordinatorMail"
                    value={newTheatre.values.coordinatorMail}
                    onChange={newTheatre.handleChange}
                    onBlur={newTheatre.handleBlur}
                    error={newTheatre.touched.coordinatorMail && Boolean(newTheatre.errors.coordinatorMail)}
                    helperText={newTheatre.touched.coordinatorMail && newTheatre.errors.coordinatorMail} />
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
