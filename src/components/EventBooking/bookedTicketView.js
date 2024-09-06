import { Box, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDTypography from 'components/MDTypography'
import { UserDataContext } from 'context'
import dayjs from 'dayjs'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { supabase } from 'pages/supabaseClient'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactToPrint from 'react-to-print'

export default function BookedTicketView() {
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const componentRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const { bookedTicketsData, qrCodes, eventName, venueName, date, time } = location.state || { bookedTicketsData: [], qrCodes: [] };
    const [organizationName, setOrganizationName] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const { data, error } = await supabase.from('eventOrganizations').select('name').eq('id', userOrganizationId);
                if (error) throw error;
                if (data) {
                    setOrganizationName(data[0].name)
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchOrganization();
    }, [bookedTicketsData])

    const formattedTime = (time) => {
        if (time) {
            const [hours, minutes, seconds] = time.split(':');
            const showDate = new Date(0, 0, 0, hours, minutes, seconds);
            const options = { hour: '2-digit', minute: '2-digit' };
            return showDate.toLocaleTimeString('en-US', options);
        }
    };

    const formattedDate = (date) => {
        return dayjs(date).format('DD/MM/YYYY');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        navigate(-1);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            {isLoading ? (
                <MDBox p={3} display="flex" justifyContent="center">
                    <CircularProgress color="info" />
                </MDBox>
            ) :
                <>
                    {bookedTicketsData.length > 0 && (
                        <>
                            <MDBox sx={{
                                position: "relative",
                                mt: 2,
                                p: 2,
                            }}>
                                <Box sx={{ flexGrow: 1, mt: 5, mb: 2 }}>
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid item xs={12} sm={6} md={4} lg={3} >
                                            <Card sx={{
                                                position: 'relative',
                                                p: 2,
                                                border: '2px solid',
                                                borderRadius: 0,
                                                boxSizing: 'border-box',
                                                width: '100%',
                                            }}>
                                                <div ref={componentRef}>
                                                    <Box sx={{ backgroundColor: '#e0e0e0', textAlign: 'center', mt: 1, mb: 3 }}>
                                                        <MDTypography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>{organizationName}</MDTypography>
                                                    </Box>

                                                    <MDTypography variant='body2' sx={{ position: 'absolute', top: { xs: 60, md: 75 }, right: { xs: 15, md: 20 }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                                                        Ticket ID : {bookedTicketsData[0].id}
                                                    </MDTypography>
                                                    <Box display="flex" alignItems='center' mt={3}>
                                                        <MDTypography sx={{ mr: 1 }}>Event:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{eventName}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Time:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
                                                            {bookedTicketsData[0]?.events?.name} at {formattedTime(time)}
                                                        </MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Venue:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{venueName}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Price:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{(bookedTicketsData[0]?.price)}</MDTypography>
                                                    </Box>
                                                    <Grid container mt={3}>
                                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                                                            <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>{formattedDate(bookedTicketsData[0]?.created_at)}</MDTypography>
                                                            <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>theEventPulse</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-end' } }}>
                                                            {qrCodes && bookedTicketsData && (
                                                                <img src={qrCodes} alt="qr" style={{ height: '200px', width: '200px', border: '1px solid', maxWidth: '100%' }} />
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </MDBox>
                            <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <MDButton color='primary' variant='contained' onClick={() => handleClickOpen()}>Print Ticket</MDButton>
                            </Box>
                        </>
                    )}
                </>
            }
            <Footer />

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Tickets Have Been SuccessFully Booked !
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to print tickets?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ReactToPrint trigger={() => <MDButton disabled={bookedTicketsData.length <= 0}>Yes</MDButton>} content={() => componentRef.current} onAfterPrint={handleClose} />
                    <MDButton onClick={handleClose}>No</MDButton>
                </DialogActions>
            </Dialog>

        </DashboardLayout>
    )
}
