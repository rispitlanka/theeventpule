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

export default function EditZone() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState();

    useEffect(() => {
        const fetchZoneData = async () => {
            try {
                const { data, error } = await supabase.from('zones').select('*').eq('id', id);
                if (error) {
                    throw error;
                }
                if (data && data.length > 0) {
                    const zone = data[0];
                    editZone.setValues({
                        name: zone.name,
                        price: zone.price,
                        halfPrice: zone.halfPrice,
                    });
                }
            } catch (error) {
                console.error('Error fetching zone data:', error.message);
            }
        };

        fetchZoneData();
    }, [id]);

    const editZone = useFormik({
        initialValues: {
            name: '',
            price: '',
            halfPrice: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            price: Yup.string().required('Required'),
            halfPrice: Yup.string().required('Required'),

        }),
        onSubmit: async (values, { resetForm }) => {
            await editZoneData(values);
            resetForm();
            toast.info('Zone has been successfully updated!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        },
    });

    const editZoneData = async (values) => {
        try {
            const { error } = await supabase.from('zones').update(values).eq('id', id);
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
            const { error } = await supabase.from('zones').delete().eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data deleted successfully');
            setOpenDeleteDialogBox(false);
            toast.error('Zone has been successfully deleted!');
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
                        <form onSubmit={editZone.handleSubmit}>
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
                                        Edit Zone
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
                                            value={editZone.values.name}
                                            onChange={editZone.handleChange}
                                            onBlur={editZone.handleBlur}
                                            error={editZone.touched.name && Boolean(editZone.errors.name)}
                                            helperText={editZone.touched.name && editZone.errors.name} />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Full Ticket Price"
                                            name="price"
                                            value={editZone.values.price}
                                            onChange={editZone.handleChange}
                                            onBlur={editZone.handleBlur}
                                            error={editZone.touched.price && Boolean(editZone.errors.price)}
                                            helperText={editZone.touched.price && editZone.errors.price} />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Half Ticket Price"
                                            name="halfPrice"
                                            value={editZone.values.halfPrice}
                                            onChange={editZone.handleChange}
                                            onBlur={editZone.handleBlur}
                                            error={editZone.touched.halfPrice && Boolean(editZone.errors.halfPrice)}
                                            helperText={editZone.touched.halfPrice && editZone.errors.halfPrice} />
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
                name={'zone'}
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