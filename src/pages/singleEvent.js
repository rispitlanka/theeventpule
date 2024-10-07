import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

// @mui material components
import Grid from "@mui/material/Grid";
import { Box, Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

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
import ReactToPrint from 'react-to-print';
import QRCode from 'qrcode';
import parse from 'html-react-parser';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditRegistrationFormModel from './Models/editRegistrationFormModel';


export default function SingleEvent() {
    // const userDetails = useContext(UserDataContext);
    // const userTheatreId = userDetails && userDetails[0].theatreId;
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [eventData, setEventData] = useState(null);
    const [openAddFieldDialogBox, setOpenAddFieldDialogBox] = useState();
    const [openEditFieldDialogBox, setOpenEditFieldDialogBox] = useState();
    const [selectedFieldId, setSelectedFieldId] = useState();
    const [openAddStageDialogBox, setOpenAddStageDialogBox] = useState();
    const [formFieldData, setFormFieldData] = useState([]);
    const [stageData, setStageData] = useState([]);
    const [qrCodes, setQrCodes] = useState({});
    const componentRefs = useRef([]);

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
                setEventData(data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const toggleDescription = () => {
        setShowFullDescription((prev) => !prev);
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

    const handleAddFieldDialogBox = () => {
        setOpenAddFieldDialogBox(true);
    }

    const handleAddFieldDialogClose = () => {
        setOpenAddFieldDialogBox(false);
        fetchRegistrationFormField();
    };

    const handleEditFieldDialogBox = (fieldId) => {
        setSelectedFieldId(fieldId);
        setOpenEditFieldDialogBox(true);
    }

    const handleEditFieldDialogClose = () => {
        setOpenEditFieldDialogBox(false);
        fetchRegistrationFormField();
    };

    const handleAddStageDialogBox = () => {
        setOpenAddStageDialogBox(true);
    }
    const handleAddStageDialogClose = () => {
        setOpenAddStageDialogBox(false);
        fetchStages();
    };

    const handleViewForm = () => {
        navigate(`/events/single-event/${id}/view-form`, { state: { formFieldData, id } });
    }

    const handleViewEventRegistrations = () => {
        navigate(`/events/single-event/${id}/view-registrations`);
    }

    const formattedTime = (time) => {
        console.log(time);
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const formattedDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
    }

    const generateQRCode = async (stageID, eventID) => {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(String(`ReferenceID:${stageID} && EventID:${eventID}`));
            setQrCodes((prevState) => ({
                ...prevState,
                [stageID]: qrCodeDataUrl,
            }));
        } catch (error) {
            console.error("Error generating QR code", error);
        }
    };

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
                            )}, url(${eventData?.eventImage || ''})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                {eventData &&
                    <>
                        <Card
                            sx={{
                                position: "relative",
                                mt: -8,
                                mx: 3,
                                py: 2,
                                px: 2,
                                mb: 10,
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                                        <MDTypography variant="h5" fontWeight="medium">
                                            {eventData.name}
                                        </MDTypography>

                                        <Grid sx={{ display: 'flex', flexDirection: 'row', mt: 0.5 }}>
                                            <MDTypography sx={{ mr: 1 }} variant="body2" color="text" fontWeight="regular">
                                                Date: {formattedDate(eventData.date)}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="body2" color="text" fontWeight="regular">
                                                Time: {formattedTime(eventData.startTime)}
                                            </MDTypography>
                                            <MDTypography variant="body2" color="text" fontWeight="regular">
                                                Venue: {eventData.venues?.name}
                                            </MDTypography>
                                        </Grid>

                                        <Grid sx={{ display: 'flex', flexDirection: 'row', mt: 0.5 }}>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Phone: {eventData.contactPhone}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Mail: {eventData.contactEmail}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Status: {`${eventData.isActive ? 'Active' : 'Inactive'}`}
                                            </MDTypography>
                                            <MDTypography sx={{ mr: 1 }} variant="button" color="text" fontWeight="regular">
                                                Category: {eventData.event_categories?.name}
                                            </MDTypography>

                                        </Grid>
                                        <Grid sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                                            <MDTypography variant="button" color="text" fontWeight="regular"> Description:
                                                {eventData.description.length > 50 ? eventData.description.replace(/<[^>]*>/g, '').substring(0, 50) + '...' : eventData.description.replace(/<[^>]*>/g, '')}
                                            </MDTypography>

                                        </Grid>
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </Card>
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
                                    Form fileds
                                </MDTypography>
                                <MDBox display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                    <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                                        <MDButton onClick={() => handleAddFieldDialogBox()}><AddIcon color="info" /></MDButton>
                                    </MDBox>
                                    <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                                        <MDButton onClick={() => handleViewEventRegistrations()}><VisibilityIcon color="info" /></MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                            {/* <Grid sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 0, mt: 4 }}>
                            <MDButton sx={{ mr: 2 }} color='info' onClick={() => handleAddFieldDialogBox()}>Add Registration Form</MDButton>
                            <MDButton sx={{ mr: 2 }} color='info' onClick={() => handleViewForm()}>View Registration Form</MDButton>
                            <MDButton color='info' onClick={handleViewEventRegistrations}>View Event Registrations</MDButton>
                        </Grid> */}
                            {formFieldData.length > 0 ?
                                <TableContainer component={Paper} sx={{ p: 2 }}>
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
                                                    <TableCell align='center'>
                                                        {/* <Button onClick={() => handleEditFieldDialogBox(row.id)}>Edit</Button> */}
                                                        <Button onClick={() => deleteRow(row.id)}>Delete</Button>
                                                    </TableCell>
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
                        </Card>
                        <Card sx={{ marginTop: 10 }}>
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
                                    Stages
                                </MDTypography>
                                <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                                    <MDButton onClick={() => handleAddStageDialogBox()}><AddIcon color="info" /></MDButton>
                                </MDBox>
                            </MDBox>
                            {/* <Grid sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 0, mt: 4 }}>
                                    <MDButton sx={{ mr: 2 }} color="info" onClick={() => handleAddStageDialogBox()}>
                                        Add Stage
                                    </MDButton>
                                </Grid> */}

                            {stageData.length > 0 ? (
                                <TableContainer component={Paper} sx={{ p: 2 }}>
                                    <Table>
                                        <TableHead sx={{ display: "table-header-group" }}>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell align="center">Description</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stageData.map((row, index) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell align="center">{row.description}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            onClick={async () => {
                                                                await generateQRCode(row.id, row.eventId);
                                                                if (componentRefs.current[index]) {
                                                                    componentRefs.current[index].click();
                                                                }
                                                            }}
                                                        >
                                                            Print QR
                                                        </Button>

                                                        {/* ReactToPrint for printing the QR code */}
                                                        <ReactToPrint
                                                            trigger={() => (
                                                                <Button
                                                                    ref={(el) => (componentRefs.current[index] = el)}
                                                                    style={{ display: "none" }}
                                                                >
                                                                    Print
                                                                </Button>
                                                            )}
                                                            content={() => componentRefs.current[`print_${index}`]}
                                                        />
                                                        <div style={{ display: "none" }}>
                                                            <div ref={(el) => (componentRefs.current[`print_${index}`] = el)}>
                                                                <Box
                                                                    sx={{
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "8px",
                                                                        padding: "16px",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "center",
                                                                        width: "400px",
                                                                        height: "400px",
                                                                    }}
                                                                >
                                                                    {qrCodes[row.id] && (
                                                                        <img
                                                                            src={qrCodes[row.id]}
                                                                            alt="QR Code"
                                                                            style={{
                                                                                maxWidth: "100%",
                                                                                height: "100%",
                                                                                marginBottom: "8px",
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <Grid container justifyContent="center" alignItems="center">
                                                                        <Typography variant="body2" fontWeight="bold" marginRight="4px">
                                                                            Stage ID:
                                                                        </Typography>
                                                                        <Typography variant="body2">{row.id}</Typography>
                                                                    </Grid>
                                                                </Box>
                                                            </div>
                                                        </div>
                                                        <Button onClick={() => deleteStageRow(row.id)}>Delete</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <MDBox sx={{ mt: 11 }}>
                                    <DataNotFound message={'No Stages To Show !'} image={noDataImage} />
                                </MDBox>
                            )}
                        </Card>
                    </>
                }
                <RegistrationFormModel
                    open={openAddFieldDialogBox}
                    onClose={handleAddFieldDialogClose}
                    eventId={id}
                />
                <EditRegistrationFormModel
                    open={openEditFieldDialogBox}
                    onClose={handleEditFieldDialogClose}
                    fieldId={selectedFieldId}
                />
                <AddStageModel
                    open={openAddStageDialogBox}
                    onClose={handleAddStageDialogClose}
                    eventId={id}
                />
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}