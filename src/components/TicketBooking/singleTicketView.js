import { Box, Button, Card, CircularProgress, Grid } from '@mui/material'
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
import { useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import ReactToPrint from 'react-to-print';
import QRCode from 'qrcode';

export default function SingleTicketView() {
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const { ticketId } = useParams();
    const [ticketData, setTicketData] = useState([]);
    const [organizationName, setOrganizationName] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [qrCodes, setQrCodes] = useState({});
    const componentRefs = useRef([]);

    const fetchEventData = async () => {
        try {
            const { data, error } = await supabase.from('tickets_events').select('*,events(name,startTime),venues(name),seats_events(seatName)').eq('id', ticketId);
            if (error) {
                throw error;
            }
            if (data) {
                setTicketData(data);
                generateQRCode(data[0]?.id)
            }
        } catch (error) {
            console.error('Error fetching ticket data:', error.message);
        }
    };
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await fetchEventData();
                await fetchOrganization();
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [ticketId]);

    const cancelTicket = async (id) => {
        try {
            const { data, error } = await supabase
                .from('tickets_events')
                .update({ isActive: false })
                .eq('id', id)
                .select('*');
            if (error) {
                throw error;
            }
            if (data) {
                fetchEventData();
                toast.warning('Ticket has been cancelled!');
                console.log('Ticket Cancelled successfully');
            }
        } catch (error) {
            console.error('Error in ticket cancelling:', error.message);
        }
    };

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

    const generateQRCode = async (ticketId) => {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(String(ticketId));
            setQrCodes(qrCodeDataUrl);
        } catch (error) {
            console.error("Error generating QR code", error);
        }
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
                    {ticketData.length > 0 && (
                        <>
                            <MDBox sx={{
                                position: "relative",
                                mt: 2,
                                p: 2,
                            }}>
                                <div ref={componentRefs}>
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
                                                    <Box sx={{ backgroundColor: '#e0e0e0', textAlign: 'center', mt: 1, mb: 3 }}>
                                                        <MDTypography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>{organizationName}</MDTypography>
                                                    </Box>

                                                    <MDTypography variant='body2' sx={{ position: 'absolute', top: { xs: 60, md: 75 }, right: { xs: 15, md: 20 }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                                                        Ticket ID : {ticketData[0].id}
                                                    </MDTypography>
                                                    <Box display="flex" alignItems='center' mt={3}>
                                                        <MDTypography sx={{ mr: 1 }}>Event:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{ticketData[0]?.events?.name}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Time:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
                                                            {formattedTime(ticketData[0]?.events?.startTime)}
                                                        </MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Venue:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{(ticketData[0]?.venues?.name)}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Price:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{(ticketData[0]?.price)}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        {ticketData[0]?.seats_events != null &&
                                                            <>
                                                                <MDTypography sx={{ mr: 1 }}>Seat:</MDTypography>
                                                                <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}> {ticketData[0]?.seats_events?.seatName}</MDTypography>
                                                            </>
                                                        }
                                                    </Box>
                                                    <Grid container mt={3}>
                                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                                                            <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>{formattedDate(ticketData[0]?.created_at)}</MDTypography>
                                                            <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>theEventPulse</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-end' } }}>
                                                            {qrCodes && (
                                                                <img src={qrCodes} alt="qr" style={{ height: '200px', width: '200px', border: '1px solid', maxWidth: '100%' }} />
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </div>
                            </MDBox>
                            <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <MDButton color='warning' variant={ticketData[0]?.isActive ? 'contained' : 'text'} onClick={() => cancelTicket(ticketData[0].id)} disabled={!ticketData[0]?.isActive}>
                                    {ticketData[0]?.isActive ? 'Cancel Ticket' : 'Cancelled'}
                                </MDButton>
                                <ReactToPrint
                                    trigger={() => (
                                        <MDButton
                                            color='primary'
                                            variant='contained'
                                            disabled={!ticketData[0]?.isActive}
                                        >
                                            Print Ticket
                                        </MDButton>
                                    )}
                                    content={() => componentRefs.current}
                                />
                            </Box>
                        </>
                    )}
                </>
            }
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
