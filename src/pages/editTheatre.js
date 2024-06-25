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
import { TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DeleteDialog from 'components/DeleteDialogBox/deleteDialog';

export default function EditTheatre() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState();

    useEffect(() => {
        const fetchTheatreData = async () => {
            try {
                const { data, error } = await supabase.from('theatres').select('*').eq('id', id);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const theatre = data[0];
                    editTheatre.setValues({
                        name: theatre.name,
                        address: theatre.address,
                        city: theatre.city,
                        telephone: theatre.telephone,
                        ownerName: theatre.ownerName,
                        ownerPhoneNumber: theatre.ownerPhoneNumber,
                        ownerEmail: theatre.ownerEmail,
                    });
                }
            } catch (error) {
                console.error('Error fetching theatre data:', error.message);
            }
        };

        fetchTheatreData();
    }, [id]);

    const editTheatre = useFormik({
        initialValues: {
            name: '',
            address: '',
            city: '',
            telephone: '',
            ownerName: '',
            ownerPhoneNumber: '',
            ownerEmail: '',
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
        onSubmit: async (values, { resetForm }) => {
            await editTheatreData(values);
            resetForm();
            toast.info('Theatre has been successfully updated!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        },
    });

    const editTheatreData = async (values) => {
        try {
            const { error } = await supabase.from('theatres').update(values).eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error.message);
            throw new Error('Error updating data:', error.message);
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
            const { error } = await supabase.from('theatres').delete().eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data deleted successfully');
            setOpenDeleteDialogBox(false);
            toast.error('Theatre has been successfully deleted!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error deleting data:', error.message);
        }
    };

    return (
        <DashboardLayout><DashboardNavbar /> <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <form onSubmit={editTheatre.handleSubmit}>
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
                                    Manage Theatre
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
                                        value={editTheatre.values.name}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.name && Boolean(editTheatre.errors.name)}
                                        helperText={editTheatre.touched.name && editTheatre.errors.name} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Address"
                                        name="address"
                                        value={editTheatre.values.address}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.address && Boolean(editTheatre.errors.address)}
                                        helperText={editTheatre.touched.address && editTheatre.errors.address} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="City"
                                        name="city"
                                        value={editTheatre.values.city}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.city && Boolean(editTheatre.errors.city)}
                                        helperText={editTheatre.touched.city && editTheatre.errors.city} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Telephone"
                                        name="telephone"
                                        value={editTheatre.values.telephone}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.telephone && Boolean(editTheatre.errors.telephone)}
                                        helperText={editTheatre.touched.telephone && editTheatre.errors.telephone} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Coordinator Name"
                                        name="ownerName"
                                        value={editTheatre.values.ownerName}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.ownerName && Boolean(editTheatre.errors.ownerName)}
                                        helperText={editTheatre.touched.ownerName && editTheatre.errors.ownerName} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Coordinator Mobile"
                                        name="ownerPhoneNumber"
                                        value={editTheatre.values.ownerPhoneNumber}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.ownerPhoneNumber && Boolean(editTheatre.errors.ownerPhoneNumber)}
                                        helperText={editTheatre.touched.ownerPhoneNumber && editTheatre.errors.ownerPhoneNumber} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Coordinator Mail"
                                        name="ownerEmail"
                                        value={editTheatre.values.ownerEmail}
                                        onChange={editTheatre.handleChange}
                                        onBlur={editTheatre.handleBlur}
                                        error={editTheatre.touched.ownerEmail && Boolean(editTheatre.errors.ownerEmail)}
                                        helperText={editTheatre.touched.ownerEmail && editTheatre.errors.ownerEmail} />
                                </MDBox>
                                <MDBox p={1}>
                                    <MDButton color='info' type='submit' sx={{ mr: 1 }}>Update</MDButton>
                                    {/* <MDButton color='error' onClick={handleDelete}>Delete</MDButton> */}
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
                name={'theatre'}
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
