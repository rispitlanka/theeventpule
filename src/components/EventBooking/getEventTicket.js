import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Box, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import MDTypography from 'components/MDTypography';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from 'pages/supabaseClient';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import { UserDataContext } from 'context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactToPrint from 'react-to-print';
import QRCode from 'qrcode';
import ShortUniqueId from 'short-unique-id';
import dayjs from 'dayjs';

export default function GetEventTicket() {
    const uid = new ShortUniqueId({ dictionary: 'number', length: 6 });
    const componentRef = useRef();
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const navigate = useNavigate();
    const location = useLocation();
    const { bookedSeats, eventId, venueId, zoneId, eventName, eventDate, eventTime, venueName, zoneName, ticketsCount, } = location.state || { bookedSeats: [] };
    const [organizationName, setOrganizationName] = useState([]);
    const [stageIds, setStageIds] = useState([]);
    const [bookedTicketsData, setBookedTicketsData] = useState([]);
    const [qrCodes, setQrCodes] = useState({});
    const [open, setOpen] = useState(false);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        fetchOrganization();
        fetchStages();
        fetchTicketCategory();
    }, [bookedSeats])

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

    const fetchStages = async () => {
        try {
            const { data, error } = await supabase.from('stages').select('id').eq('eventId', eventId);
            if (error) throw error;
            if (data) {
                setStageIds(data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const ticketCategoryIds = Object.keys(ticketsCount);

    const fetchTicketCategory = async () => {
        try {
            const { data, error } = await supabase.from('zone_ticket_category').select('id, name, price').eq('zoneId', zoneId).in('id', ticketCategoryIds);
            if (error) throw error;
            if (data) {
                setCategoryData(data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        if (bookedSeats && bookedSeats.length > 0) {
            bookedSeats.forEach(seat => {
                const price = parseInt(seat.price);
                totalPrice += price;
            });
            return totalPrice;
        } else {
            const totalPrice = Object.entries(ticketsCount).reduce((total, [categoryId, count]) => {
                const category = categoryData.find(cat => cat.id === parseInt(categoryId));
                if (category) {
                    total += Number(category.price) * parseInt(count);
                }
                return total;
            }, 0);
            return totalPrice;
        }
    }

    const handleBookTickets = async () => {
        const refId = uid.rnd();

        try {
            let dataToInsert = [];
            if (bookedSeats && bookedSeats.length > 0) {
                dataToInsert = bookedSeats.map(seat => ({
                    seatId: seat.seatId,
                    eventId: seat.eventId,
                    zoneId: seat.zoneId,
                    venueId: seat.venueId,
                    eventOrganizationId: userOrganizationId,
                    bookedBy: organizationName,
                    price: seat.price,
                    totalPrice: calculateTotalPrice(), // Assuming total price for single seat
                    referenceId: refId,
                }));

            } else {
                Object.entries(ticketsCount).forEach(([categoryId, count]) => {
                    const category = categoryData.find(cat => cat.id === parseInt(categoryId));
                    if (category) {
                        for (let i = 0; i < count; i++) {
                            dataToInsert.push({
                                eventId: eventId,
                                venueId: venueId,
                                zoneId: zoneId,
                                eventOrganizationId: userOrganizationId,
                                bookedBy: organizationName,
                                price: category.price,
                                totalPrice: calculateTotalPrice(),
                                referenceId: refId,
                                categoryId: category.id,
                            });
                        }
                    }
                });
            }

            const { data, error } = await supabase.from('tickets_events').insert(dataToInsert).select('*');
            if (data) {
                handleClickOpen();
                toast.info('Tickets have been successfully booked!');
                setBookedTicketsData(data);

                if (stageIds?.length > 0 && data?.length > 0) {
                    const stageParticipantsData = [];
                    data.forEach(ticket => {
                        stageIds.forEach(stage => {
                            stageParticipantsData.push({
                                stageId: stage.id,
                                ticketId: ticket.id,
                                eventId: ticket.eventId
                            });
                        });
                    });

                    const { data: stageParticipantsDataResponse, error: stageParticipantsError } = await supabase
                        .from('stage_participants')
                        .insert(stageParticipantsData)
                        .select('*');

                    if (stageParticipantsError) {
                        console.error('Error inserting into stage_participants', stageParticipantsError);
                    } else {
                        console.log('Stage participants added', stageParticipantsDataResponse);
                    }
                }

                // Generate QR Codes for each ticket
                data.forEach(ticket => generateQRCode(ticket.id));
            }

            if (error) {
                console.log('Error inserting tickets:', error);
            }
        } catch (error) {
            console.log('Error in booking tickets:', error);
        }
    };

    const currentDate = () => {
        return (new Date()).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '');
    }

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const showDate = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return showDate.toLocaleTimeString('en-US', options);
    };

    const formattedDate = (date) => {
        return dayjs(date).format('DD/MM/YYYY');
    }

    const generateQRCode = async (id) => {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(String(id));
            setQrCodes(prevState => ({ ...prevState, [id]: qrCodeDataUrl }));
        } catch (err) {
            console.log('Error generating QR code:', err);
        }
    };

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
            <MDBox sx={{
                position: "relative",
                mt: 2,
                p: 2,
            }}>
                <Box sx={{ flexGrow: 1, mt: 5, mb: 2 }}>
                    <div ref={componentRef}>
                        <Grid container spacing={3} justifyContent="center">
                            {bookedSeats && bookedSeats.length > 0 ?
                                bookedSeats.map((seat, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                                            {bookedTicketsData.length > 0 && (
                                                <MDTypography variant='body2' sx={{ position: 'absolute', top: { xs: 60, md: 75 }, right: { xs: 15, md: 20 }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                                                    Ticket ID : {bookedTicketsData[index]?.id}
                                                </MDTypography>
                                            )}
                                            <Box display="flex" alignItems='center' mt={3}>
                                                <MDTypography sx={{ mr: 1 }}>Event:</MDTypography>
                                                <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{eventName}</MDTypography>
                                            </Box>
                                            <Box display="flex" alignItems='center' mt={1}>
                                                <MDTypography sx={{ mr: 1 }}>Time:</MDTypography>
                                                <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{formattedDate(eventDate)} at {formattedTime(eventTime)}</MDTypography>
                                            </Box>
                                            <Box display="flex" alignItems='center' mt={1}>
                                                <MDTypography sx={{ mr: 1 }}>Venue:</MDTypography>
                                                <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{venueName}-{seat.zoneName}</MDTypography>
                                            </Box>
                                            <Box display="flex" alignItems='center' mt={1}>
                                                <MDTypography sx={{ mr: 1 }}>Price:</MDTypography>
                                                <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{seat.price}</MDTypography>
                                            </Box>
                                            <Box display="flex" alignItems='center' mt={1}>
                                                <MDTypography sx={{ mr: 1 }}>Seat:</MDTypography>
                                                <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{seat.seatName}</MDTypography>
                                            </Box>
                                            <Grid container mt={3}>
                                                <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                                                    <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>{currentDate()}</MDTypography>
                                                    <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>theEventPulse</MDTypography>
                                                </Grid>
                                                <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-end' } }}>
                                                    {qrCodes[bookedTicketsData[index]?.id] && (
                                                        <img src={qrCodes[bookedTicketsData[index]?.id]} alt="qr" style={{ height: '200px', width: '200px', border: '1px solid', maxWidth: '100%' }} />
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))
                                :
                                <>
                                    {Object.entries(ticketsCount).map(([categoryId, count], categoryIndex) => (
                                        Array.from({ length: parseInt(count) }, (_, ticketIndex) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={`${categoryId}-${ticketIndex}`}>
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
                                                    {bookedTicketsData.length > (categoryIndex + ticketIndex) && (
                                                        <MDTypography variant='body2' sx={{ position: 'absolute', top: { xs: 60, md: 75 }, right: { xs: 15, md: 20 }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                                                            Ticket ID : {bookedTicketsData[categoryIndex + ticketIndex]?.id}
                                                        </MDTypography>
                                                    )}
                                                    <Box display="flex" alignItems='center' mt={3}>
                                                        <MDTypography sx={{ mr: 1 }}>Event:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{eventName}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Time:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{formattedDate(eventDate)} at {formattedTime(eventTime)}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Venue:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{venueName}-{zoneName}</MDTypography>
                                                    </Box>
                                                    <Box display="flex" alignItems='center' mt={1}>
                                                        <MDTypography sx={{ mr: 1 }}>Price:</MDTypography>
                                                        <MDTypography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
                                                            {categoryData.find(category => category.id === parseInt(categoryId))?.price || "Price not available"}
                                                        </MDTypography>
                                                    </Box>
                                                    <Grid container mt={3}>
                                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                                                            <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>{currentDate()}</MDTypography>
                                                            <MDTypography sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>theEventPulse</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-end' } }}>
                                                            {qrCodes[bookedTicketsData[categoryIndex + ticketIndex]?.id] && (
                                                                <img src={qrCodes[bookedTicketsData[categoryIndex + ticketIndex]?.id]} alt="qr" style={{ height: '200px', width: '200px', border: '1px solid', maxWidth: '100%' }} />
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        ))
                                    ))}
                                </>

                            }
                        </Grid>
                    </div>
                </Box>
                <Box sx={{ mt: 'auto', textAlign: 'right', p: 2 }}>
                    <MDTypography sx={{ mb: 2 }}>Total Price: LKR {calculateTotalPrice()}</MDTypography>
                    <MDButton color='info' onClick={handleBookTickets} disabled={bookedTicketsData.length > 0}>Book Tickets</MDButton>
                </Box>
            </MDBox>
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
                    <ReactToPrint trigger={() => <MDButton disabled={bookedTicketsData.length <= 0}>Yes</MDButton>} content={() => componentRef.current} />
                    <MDButton onClick={handleClose}>No</MDButton>
                </DialogActions>
            </Dialog>

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