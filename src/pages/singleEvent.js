import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// @mui icons


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
import backgroundImage from "assets/images/bg-profile.jpeg";
import { UserDataContext } from 'context';
import MDButton from 'components/MDButton';
import RegistrationFormModel from './Models/registrationFormModel';

export default function SingleEvent() {
    const userDetails = useContext(UserDataContext);
    const userTheatreId = userDetails[0].theatreId;
    const [eventData, setEventData] = useState([]);
    const [openEditDialogBox, setOpenEditDialogBox] = useState();
    const [formFieldData, setFormFieldData] = useState([]);

    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };
    const { id } = useParams();
    const theatreID = userTheatreId ? userTheatreId : id;

    const fetchSingleEventData = async () => {
        try {
            const { data, error } = await supabase.from('events').select().eq('id', id);
            if (error) throw error;
            if (data) {
                setEventData(data);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRegistrationFormField = async () => {
        try {
            const { data, error } = await supabase.from('registrationForm').select('*').eq('eventId', id);
            if (data) {
                setFormFieldData(data);
                console.log('form data', data);
            }

            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchSingleEventData();
        fetchRegistrationFormField();
    }, [id])

    const deleteRow = (id) => {
        deleteRegistrationFormField(id, fetchRegistrationFormField);
    };

    const deleteRegistrationFormField = async (formId, fetchDataCallback) => {
        try {
            const response = await supabase.from('registrationForm').delete().eq('id', formId);
            console.log('Response from Supabase:', response);

            const { data, error } = response;
            if (error) throw error;

            if (data && data.length > 0) {
                console.log('Deleted:', data);
            } else {
                console.log('No data returned, but deletion was successful');
            }
            fetchDataCallback();
        } catch (error) {
            console.log('Error:', error.message);
        }
    };
    const handleDialogBox = () => {
        setOpenEditDialogBox(true);
    }
    const handleEditDialogClose = () => {
        setOpenEditDialogBox(false);
        fetchRegistrationFormField();
    };

    const handleViewForm = () => {
        navigate(`/events/single-event/${id}/view-form`, { state: { formFieldData, id } });
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <MDBox position="relative" mb={5}>
                <MDBox
                    display="flex"
                    alignItems="center"
                    position="relative"
                    minHeight="18.75rem"
                    borderRadius="xl"
                    sx={{
                        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
                            `${linearGradient(
                                rgba(gradients.info.main, 0.6),
                                rgba(gradients.info.state, 0.6)
                            )}, url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                {eventData.length > 0 &&
                    <>
                        <Card
                            sx={{
                                position: "relative",
                                mt: -8,
                                mx: 3,
                                py: 2,
                                px: 2,
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                                        <MDTypography variant="h5" fontWeight="medium">
                                            {eventData[0].name}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            {eventData[0].category}
                                        </MDTypography>
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </Card>
                        <MDButton sx={{ position: 'absolute', right: '300px', m: 2 }} color='info' onClick={() => handleDialogBox()}>Add Registration Form</MDButton>
                        {formFieldData &&
                            <MDButton sx={{ position: 'absolute', right: '10px', m: 2 }} color='info' onClick={() => handleViewForm()}>View Registration Form</MDButton>
                        }

                        {formFieldData.length > 0 && (
                            <TableContainer component={Paper} sx={{ mt: 9 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Name</TableCell>
                                            <TableCell align="right">Type</TableCell>
                                            <TableCell align="center">Option</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formFieldData.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="center">{row.type}</TableCell>
                                                <TableCell align="center">{row.option}</TableCell>
                                                <TableCell align="center"><Button onClick={() => deleteRow(row.id)}>Delete</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                }
                <RegistrationFormModel
                    open={openEditDialogBox}
                    onClose={handleEditDialogClose}
                    eventId={id}
                />
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}