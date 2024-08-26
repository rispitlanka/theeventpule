import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
import backgroundImage from "assets/images/events.jpg";
import noDataImage from "assets/images/illustrations/noData3.svg";
import { UserDataContext } from 'context';
import MDButton from 'components/MDButton';
import RegistrationFormModel from './Models/registrationFormModel';
import dayjs from 'dayjs';
import DataNotFound from 'components/NoData/dataNotFound';
import AddStageModel from './Models/addStageModel';

export default function SingleEvent() {
    // const userDetails = useContext(UserDataContext);
    // const userTheatreId = userDetails && userDetails[0].theatreId;
    const [eventData, setEventData] = useState([]);
    const [openEditDialogBox, setOpenEditDialogBox] = useState();
    const [openEditStageDialogBox, setOpenEditStageDialogBox] = useState();
    const [formFieldData, setFormFieldData] = useState([]);
    const [stageData, setStageData] = useState([]);

    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };
    const { id } = useParams();
    // const theatreID = userTheatreId ? userTheatreId : id;

    const fetchSingleEventData = async () => {
        try {
            const { data, error } = await supabase.from('events').select(`*,venues(name),event_categories(name)`).eq('id', id);
            if (error) throw error;
            if (data) {
                setEventData(data);
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
            }

            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    const fetchStages = async () => {
        try {
            const { data, error } = await supabase.from('stages').select('*').eq('eventId', id);
            if (data) {
                setStageData(data);
            }

            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };


    useEffect(() => {
        fetchSingleEventData();
        fetchRegistrationFormField();
        fetchStages();
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

    const deleteStageRow = (id) => {
        deleteStage(id, fetchStages);
    };

    const deleteStage = async (stageId, fetchDataCallback) => {
        try {
            const response = await supabase.from('stages').delete().eq('id', stageId);
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

    const handleStageDialogBox = () => {
        setOpenEditStageDialogBox(true);
    }
    const handleEditStageDialogClose = () => {
        setOpenEditStageDialogBox(false);
        fetchStages();
    };

    const handleViewForm = () => {
        navigate(`/events/single-event/${id}/view-form`, { state: { formFieldData, id } });
    }

    const handleViewEventRegistrations = () => {
        navigate(`/events/single-event/${id}/view-registrations`);
    }

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const formattedDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
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
                            )}, url(${eventData[0]?.eventImage || ''})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                {eventData && eventData.length > 0 &&
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

                                        <Grid sx={{ display: 'flex', flexDirection: 'row', mt: 0.5 }}>
                                            <MDTypography sx={{ mr: 1 }} variant="body2" color="text" fontWeight="regular">
                                                Date: {formattedDate(eventData[0].date)}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="body2" color="text" fontWeight="regular">
                                                Time: {formattedTime(eventData[0].startTime)}
                                            </MDTypography>
                                            <MDTypography variant="body2" color="text" fontWeight="regular">
                                                Venue: {eventData[0].venues?.name}
                                            </MDTypography>
                                        </Grid>

                                        <Grid sx={{ display: 'flex', flexDirection: 'row', mt: 0.5 }}>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Phone: {eventData[0].contactPhone}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Mail: {eventData[0].contactEmail}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Status: {`${eventData[0].isActive ? 'Active' : 'Inactive'}`}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Category: {eventData[0].event_categories?.name}
                                            </MDTypography>
                                            <MDTypography variant="button" color="text" fontWeight="regular">
                                                Description: {eventData[0].description}
                                            </MDTypography>
                                        </Grid>

                                    </MDBox>
                                </Grid>
                            </Grid>
                        </Card>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 0, mt: 4 }}>
                            <MDButton sx={{ mr: 2 }} color='info' onClick={() => handleDialogBox()}>Add Registration Form</MDButton>
                            <MDButton sx={{ mr: 2 }} color='info' onClick={() => handleViewForm()}>View Registration Form</MDButton>
                            <MDButton color='info' onClick={handleViewEventRegistrations}>View Event Registrations</MDButton>
                        </Grid>
                        {formFieldData.length > 0 ?
                            <TableContainer component={Paper} sx={{ mt: 11, p: 2 }}>
                                <Table>
                                    <TableHead sx={{ display: "table-header-group" }}>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align='center'>Type</TableCell>
                                            <TableCell align='center'>Options</TableCell>
                                            <TableCell align='center'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formFieldData.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell >{row.name}</TableCell>
                                                <TableCell align='center'>{row.type}</TableCell>
                                                <TableCell align='center'>{row.options || '--'}</TableCell>
                                                <TableCell align='center'><Button onClick={() => deleteRow(row.id)}>Delete</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            :
                            <MDBox sx={{ mt: 11 }}>
                                <DataNotFound message={'No Fields To Show !'} image={noDataImage} />
                            </MDBox>
                        }
                        <>
                            <Grid sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 0, mt: 4 }}>
                                <MDButton sx={{ mr: 2 }} color='info' onClick={() => handleStageDialogBox()}>Add Stage</MDButton>
                            </Grid>
                            {stageData.length > 0 ?
                                <TableContainer component={Paper} sx={{ mt: 11, p: 2 }}>
                                    <Table>
                                        <TableHead sx={{ display: "table-header-group" }}>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell align='center'>Description</TableCell>
                                                <TableCell align='center'>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stageData.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell >{row.name}</TableCell>
                                                    <TableCell align='center'>{row.description}</TableCell>
                                                    <TableCell align='center'><Button onClick={() => deleteStageRow(row.id)}>Delete</Button></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                :
                                <MDBox sx={{ mt: 11 }}>
                                    <DataNotFound message={'No Stages To Show !'} image={noDataImage} />
                                </MDBox>
                            }
                        </>
                    </>
                }
                <RegistrationFormModel
                    open={openEditDialogBox}
                    onClose={handleEditDialogClose}
                    eventId={id}
                />
                <AddStageModel
                    open={openEditStageDialogBox}
                    onClose={handleEditStageDialogClose}
                    eventId={id}
                />
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}