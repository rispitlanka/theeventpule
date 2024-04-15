import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

export default function AddTheatre() {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');

  const newTheatre = useFormik({
    initialValues: {
      name: '',
      address: '',
      telephone: '',
      coordinatorName: '',
      coordinatorMobile: '',
      coordinatorMail: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
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
    onSubmit: (values, { resetForm }) => {
      saveDataToLocal(values);
      setSnackbarOpen(true);
      setSnackbarType('success');
      resetForm();
    },
  });

  const saveDataToLocal = (data) => {
    let newData = JSON.parse(localStorage.getItem('theatreData')) || [];
    newData.push(data);
    localStorage.setItem('theatreData', JSON.stringify(newData));
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
                pt={1}
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
        content={snackbarType === 'success' ? 'New theatre has been added successfully!' : 'Failed to add new theatre!'}
        open={snackbarOpen}
        close={handleCloseSnackbar}
        time={2500}
        bgWhite
      />
    </DashboardLayout>
  )
}
