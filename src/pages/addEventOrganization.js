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

export default function AddEventOrganization() {
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [organizationImagePreview, setOrganizationImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCoverImageChange = (event) => {
    const file = event.currentTarget.files[0];
    newOrganization.setFieldValue('coverImage', file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleOrganizationImageChange = (event) => {
    const file = event.currentTarget.files[0];
    newOrganization.setFieldValue('organizationImage', file);
    setOrganizationImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      if (newOrganization.values.coverImage) {
        const file = newOrganization.values.coverImage;

        const { data: imageData, error: imageError } = await supabase.storage
          .from('organization_images')
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

      if (newOrganization.values.organizationImage) {
        const file = newOrganization.values.organizationImage;

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

      await addEventOrganization(values);
      resetForm();
      toast.info('Organization has been successfully created!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
      setIsLoading(false);

    } catch (error) {
      console.error('Error submitting form:', error.message);
      setIsLoading(false);
    }
  };

  const newOrganization = useFormik({
    initialValues: {
      name: '',
      address: '',
      telephone: '',
      ownerName: '',
      ownerMobile: '',
      ownerEmail: '',
      isActive: true,
      coverImage: '',
      organizationImage: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      telephone: Yup.string()
        .required('Required')
        .min(10, 'Not a valid Mobile number')
        .max(10, 'Not a valid Mobile number'),
      ownerMobile: Yup.string()
        .min(10, 'Not a valid Mobile number')
        .max(10, 'Not a valid Mobile number'),
      ownerEmail: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid Email')
        .email('Enter a valid ownerEmail'),
    }),
    onSubmit,
  });

  const addEventOrganization = async (values) => {
    try {
      const { data, error } = await supabase.from('eventOrganizations').insert([values]).select('*');
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
          <form onSubmit={newOrganization.handleSubmit}>
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
                  Add New Organization
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
                        id="name"
                        label="Name"
                        name="name"
                        value={newOrganization.values.name}
                        onChange={newOrganization.handleChange}
                        onBlur={newOrganization.handleBlur}
                        error={newOrganization.touched.name && Boolean(newOrganization.errors.name)}
                        helperText={newOrganization.touched.name && newOrganization.errors.name} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="address"
                        label="Address"
                        name="address"
                        value={newOrganization.values.address}
                        onChange={newOrganization.handleChange}
                        onBlur={newOrganization.handleBlur}
                        error={newOrganization.touched.address && Boolean(newOrganization.errors.address)}
                        helperText={newOrganization.touched.address && newOrganization.errors.address} />
                    </MDBox>
                    <MDBox p={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        id="telephone"
                        label="Telephone"
                        name="telephone"
                        value={newOrganization.values.telephone}
                        onChange={newOrganization.handleChange}
                        onBlur={newOrganization.handleBlur}
                        error={newOrganization.touched.telephone && Boolean(newOrganization.errors.telephone)}
                        helperText={newOrganization.touched.telephone && newOrganization.errors.telephone} />
                    </MDBox>
                  </Grid>
                  <Grid item xs={6} >
                    <MDBox p={1}>
                      <MDTypography>
                        Status:
                        <Switch label="Status" checked={newOrganization.values.isActive} onChange={(e) => newOrganization.setFieldValue('isActive', e.target.checked)} />
                        {newOrganization.values.isActive ? 'Active' : 'Inactive'}
                      </MDTypography>
                    </MDBox>
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
                              <img src={organizationImagePreview} alt="Organization Icon" style={{ width: '100%', maxHeight: '100px' }} />
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
                          {newOrganization.touched.organizationImage && newOrganization.errors.organizationImage && (
                            <MDTypography color="error">{newOrganization.errors.organizationImage}</MDTypography>
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
                          {newOrganization.touched.coverImage && newOrganization.errors.coverImage && (
                            <MDTypography color="error">{newOrganization.errors.coverImage}</MDTypography>
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Grid>
                </Grid>
                <Grid mt={2}>
                  <MDTypography>Organization Owner Info</MDTypography>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="ownerName"
                      label="Owner Name"
                      name="ownerName"
                      value={newOrganization.values.ownerName}
                      onChange={newOrganization.handleChange}
                      onBlur={newOrganization.handleBlur}
                      error={newOrganization.touched.ownerName && Boolean(newOrganization.errors.ownerName)}
                      helperText={newOrganization.touched.ownerName && newOrganization.errors.ownerName} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="ownerMobile"
                      label="Owner Phone Number"
                      name="ownerMobile"
                      value={newOrganization.values.ownerMobile}
                      onChange={newOrganization.handleChange}
                      onBlur={newOrganization.handleBlur}
                      error={newOrganization.touched.ownerMobile && Boolean(newOrganization.errors.ownerMobile)}
                      helperText={newOrganization.touched.ownerMobile && newOrganization.errors.ownerMobile} />
                  </MDBox>
                  <MDBox p={1}>
                    <TextField fullWidth
                      variant="outlined"
                      id="ownerEmail"
                      label="Owner Mail"
                      name="ownerEmail"
                      value={newOrganization.values.ownerEmail}
                      onChange={newOrganization.handleChange}
                      onBlur={newOrganization.handleBlur}
                      error={newOrganization.touched.ownerEmail && Boolean(newOrganization.errors.ownerEmail)}
                      helperText={newOrganization.touched.ownerEmail && newOrganization.errors.ownerEmail} />
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