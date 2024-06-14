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
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DeleteDialog from 'components/DeleteDialogBox/deleteDialog';

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [theatreData, setTheatreData] = useState();
    const [selectedTheatreId, setSelectedTheatreId] = useState();
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data, error } = await supabase.from('theatreOwners').select('*').eq('id', id);
                if (data && data.length > 0) {
                    const user = data[0];
                    editUser.setValues({
                        name: user.name,
                        userRole: user.userRole,
                        mobile: user.mobile,
                        email: user.email,
                        theatreId: user.theatreId
                    });
                    setSelectedTheatreId(user.theatreId);
                    if (error) {
                        throw error;
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        const fetchTheatreData = async () => {
            try {
                const { data, error } = await supabase.from('theatres').select('*');
                if (data) {
                    setTheatreData(data);
                }
                if (error) throw error;
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
        fetchTheatreData();
    }, [id]);

    const editUser = useFormik({
        initialValues: {
            name: '',
            userRole: '',
            mobile: '',
            email: '',
            theatreId: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            mobile: Yup.string()
                .required('Required')
                // .matches(phoneRegExp, 'Mobile number is not valid')
                .min(10, 'Not a valid mobile number')
                .max(10, 'Not a valid mobile number'),
            email: Yup.string().required('Email is required').email('Enter a valid email'),
        }),
        onSubmit: async (values, { resetForm }) => {
            await editUserData({ ...values, theatreId: selectedTheatreId });
            resetForm();
        },
    });

    const editUserData = async (values) => {
        try {
            const { data, error } = await supabase.from('theatreOwners').update(values).eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data updated successfully');
            toast.info('User has been successfully updated!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
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
            const { error } = await supabase.from('theatreOwners').delete().eq('id', id);
            if (error) {
                throw error;
            }
            console.log('Data deleted successfully');
            setOpenDeleteDialogBox(false);
            toast.error('User has been successfully deleted!');
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
                    <form onSubmit={editUser.handleSubmit}>
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
                                    Manage User
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
                                        value={editUser.values.name}
                                        onChange={editUser.handleChange}
                                        onBlur={editUser.handleBlur}
                                        error={editUser.touched.name && Boolean(editUser.errors.name)}
                                        helperText={editUser.touched.name && editUser.errors.name} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Mobile"
                                        name="mobile"
                                        value={editUser.values.mobile}
                                        onChange={editUser.handleChange}
                                        onBlur={editUser.handleBlur}
                                        error={editUser.touched.mobile && Boolean(editUser.errors.mobile)}
                                        helperText={editUser.touched.mobile && editUser.errors.mobile} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="Email"
                                        name="email"
                                        value={editUser.values.email}
                                        onChange={editUser.handleChange}
                                        onBlur={editUser.handleBlur}
                                        error={editUser.touched.email && Boolean(editUser.errors.email)}
                                        helperText={editUser.touched.email && editUser.errors.email} />
                                </MDBox>
                                <MDBox p={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="outlined-basic"
                                        label="User Role"
                                        name="userRole"
                                        value={editUser.values.userRole}
                                        onChange={editUser.handleChange}
                                        onBlur={editUser.handleBlur}
                                        error={editUser.touched.userRole && Boolean(editUser.errors.userRole)}
                                        helperText={editUser.touched.userRole && editUser.errors.userRole} />
                                </MDBox>
                                <MDBox p={1}>
                                    <FormControl fullWidth mb={3}>
                                        <InputLabel>Select Theatre</InputLabel>
                                        {selectedTheatreId && (
                                            <Select
                                                value={selectedTheatreId}
                                                onChange={(e) => setSelectedTheatreId(e.target.value)}
                                                sx={{ height: '45px', mb: 3 }}
                                            >
                                                {theatreData && theatreData.map((theatre) => (
                                                    <MenuItem key={theatre.id} value={theatre.id}>
                                                        {theatre.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                </MDBox>
                                <MDBox p={1}>
                                    <MDButton color='info' type='submit' sx={{ mr: 1 }}>Update</MDButton>
                                    <MDButton color='error' onClick={handleDelete} disabled>Delete</MDButton>
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
                name={'user'}
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
