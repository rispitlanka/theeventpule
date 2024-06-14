import React, { useEffect, useState } from 'react';
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
import DeleteDialog from 'components/DeleteDialogBox/deleteDialog';

export default function EditScreen() {
  const navigate = useNavigate();
  const { screenId } = useParams();
  const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState();

  useEffect(() => {
    const fetchScreenData = async () => {
      try {
        const { data, error } = await supabase.from('screens').select('*').eq('id', screenId);
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          const screen = data[0];
          editScreen.setValues({
            name: screen.name,
            width: screen.width,
            height: screen.height,
            soundType: screen.soundType,
            projectionType: screen.projectionType,
            facilities: screen.facilities,
          });
        }
      } catch (error) {
        console.error('Error fetching screen data:', error.message);
      }
    };

    fetchScreenData();
  }, [screenId]);

  const editScreen = useFormik({
    initialValues: {
      name: '',
      width: '',
      height: '',
      soundType: '',
      projectionType: '',
      facilities: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      await editScreenData(values);
      resetForm();
      toast.info('Screen has been successfully updated!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    },
  });

  const editScreenData = async (values) => {
    try {
      const { error } = await supabase.from('screens').update(values).eq('id', screenId);
      if (error) {
        throw error;
      }
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error updating data:', error.message);
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
      const { error } = await supabase.from('screens').delete().eq('id', screenId);
      if (error) {
        throw error;
      }
      console.log('Data deleted successfully');
      setOpenDeleteDialogBox(false);
      toast.error('Screen has been successfully deleted!');
      setTimeout(() => {
        navigate(-2);
      }, 1500);
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <form onSubmit={editScreen.handleSubmit}>
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
                    Edit Screen
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
                      value={editScreen.values.name}
                      onChange={editScreen.handleChange}
                      onBlur={editScreen.handleBlur}
                      error={editScreen.touched.name && Boolean(editScreen.errors.name)}
                      helperText={editScreen.touched.name && editScreen.errors.name} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Width"
                      name="width"
                      value={editScreen.values.width}
                      onChange={editScreen.handleChange}
                      onBlur={editScreen.handleBlur}
                      error={editScreen.touched.width && Boolean(editScreen.errors.width)}
                      helperText={editScreen.touched.width && editScreen.errors.width} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Height"
                      name="height"
                      value={editScreen.values.height}
                      onChange={editScreen.handleChange}
                      onBlur={editScreen.handleBlur}
                      error={editScreen.touched.height && Boolean(editScreen.errors.height)}
                      helperText={editScreen.touched.height && editScreen.errors.height} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Sound Type"
                      name="soundType"
                      value={editScreen.values.soundType}
                      onChange={editScreen.handleChange}
                      onBlur={editScreen.handleBlur}
                      error={editScreen.touched.soundType && Boolean(editScreen.errors.soundType)}
                      helperText={editScreen.touched.soundType && editScreen.errors.soundType} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Projection Type"
                      name="projectionType"
                      value={editScreen.values.projectionType}
                      onChange={editScreen.handleChange}
                      onBlur={editScreen.handleBlur}
                      error={editScreen.touched.projectionType && Boolean(editScreen.errors.projectionType)}
                      helperText={editScreen.touched.projectionType && editScreen.errors.projectionType} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField fullWidth
                      variant="outlined"
                      id="outlined-basic"
                      label="Facilities"
                      name="facilities"
                      value={editScreen.values.facilities}
                      onChange={editScreen.handleChange}
                      onBlur={editScreen.handleBlur}
                      error={editScreen.touched.facilities && Boolean(editScreen.errors.facilities)}
                      helperText={editScreen.touched.facilities && editScreen.errors.facilities} />
                  </MDBox>
                  <MDBox p={1}>
                    <MDButton color='info' type='submit' sx={{ mr: 1 }}>Update</MDButton>
                    <MDButton color='error' onClick={handleDelete}>Delete</MDButton>
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
        name={'screen'}
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
