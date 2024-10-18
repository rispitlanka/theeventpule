import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Card, CardContent, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DataNotFound from 'components/NoData/dataNotFound'
import { useContext, useEffect, useMemo, useState } from 'react';
import noTicketImage from "assets/images/illustrations/noTicket.png";
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import { supabase } from './supabaseClient';
import { UserDataContext } from 'context';
import MDInput from 'components/MDInput';
import { CSVLink } from "react-csv";
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom'
import _ from 'lodash';
import TicketEmail from 'components/TicketBooking/ticketEmailTemplate'
import dayjs, { Dayjs } from 'dayjs'



export default function ViewTickets() {
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('all');
    const [allEventTickets, setAllEventTickets] = useState([]);
    const [registrationFormData, setRegistrationFormData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [eventFree, setEventFree] = useState(false);
    const [qrCodes, setQrCodes] = useState({});
    // const [totalPendingCount, setTotalPendingCount] = useState(0);
    // const [totalDoneCount, setTotalDoneCount] = useState(0);


    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchRegistrationForm = async () => {
        try {
            const { data, error } = await supabase.from('registrationForm').select('*');
            if (data) {
                setRegistrationFormData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    const getAllEventTickets = async () => {
        try {
            const { data, error } = await supabase
                .from('tickets_events')
                .select('*,events(name,isFree,eventImage,startTime,endTime,date),zone_ticket_category(name),eventOrganizations(name),zones_events(name),venues(name),eventRegistrations(details,paymentStatus)')
                .eq('eventOrganizationId', userOrganizationId)
                .order('id', { ascending: false });

            if (error) {
                console.log('ticketsResponseError', error);
            }

            if (data) {

                const updatedData = await Promise.all(data.map(async (ticket) => {
                    const qrCodeDataUrl = await generateQRCode(ticket.referenceId, ticket.eventId, ticket.id);
                    return { ...ticket, qrCode: qrCodeDataUrl };
                }));

                setAllEventTickets(updatedData);


                const isAnyEventFree = updatedData.some(ticket => ticket.events?.isFree);
                setEventFree(isAnyEventFree);


            }
        } catch (error) {
            console.error('Error in fetching tickets:', error.message);
        }
    };

    const generateQRCode = async (referenceId, eventId, ticketId) => {
        try {
            const qrValue = `ReferenceID:${referenceId} && EventID:${eventId} && TicketID:${ticketId}`;


            const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrValue)}&size=128x128`;

            return qrCodeDataUrl;
        } catch (error) {
            console.error("Error generating QR code", error);
            return null;
        }
    };


    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_event_ticket_count', { eventorganization_id: userOrganizationId });
            if (error) throw error;
            const labels = data.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', });
            }); const count = data.map(item => item.ticket_count);
            setChartData({ labels, datasets: { label: "Count", data: count } });

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                await fetchData();
                await fetchRegistrationForm();
                await getAllEventTickets();
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [userOrganizationId]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredRows = useMemo(() => {
        return allEventTickets?.filter((row) => {
            const reference = row.referenceId;
            const status = row.eventRegistrations?.paymentStatus;
            const matchesSearch = reference?.includes(searchTerm);
            const matchesStatus =
                paymentStatus === 'all' || (paymentStatus === 'done' && status?.includes('done')) || (paymentStatus === 'pending' && status?.includes('pending')) || (paymentStatus === 'manual' && status?.includes('manual'));
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, paymentStatus, allEventTickets]);

    const handlePaymentStatusChange = (event, newStatus) => {
        if (newStatus !== null) {
            setPaymentStatus(newStatus);

        }
    };


    const allKeysOfRegisteredEvents = [
        ...new Set(
            allEventTickets
                .filter(item => item?.eventRegistrations?.details)
                .flatMap(item => Object.keys(JSON.parse(item.eventRegistrations.details)))
        )
    ];
    const allKeysOfForm = [...new Set(registrationFormData.map(item => (item.name)))];
    const matchingKeys = allKeysOfRegisteredEvents.filter(key => allKeysOfForm.includes(key) && key !== 'id');

    const headers = [
        { label: "Id", key: "id" },
        { label: "Reference Id", key: "referenceId" },
        { label: "Category", key: "category" },
        { label: "Price", key: "price" },
        { label: "Date", key: "bookedDate" },
        { label: "Time", key: "bookedTime" },
        { label: "Event", key: "eventName" },
        ...matchingKeys.map(key => ({ label: key, key }))
    ];

    const data = allEventTickets ? allEventTickets.filter(ticket => {
        const status = ticket.eventRegistrations?.paymentStatus;
        return (
            paymentStatus === 'all' ||
            (paymentStatus === 'done' && status?.includes('done')) ||
            (paymentStatus === 'pending' && status?.includes('pending')) || (paymentStatus === 'manual' && status?.includes('manual'))
        );
    })
        .map(ticket => {
            const parsedDetails = ticket.eventRegistrations?.details ? JSON.parse(ticket.eventRegistrations.details) : {};
            const formattedDate = new Date(ticket.created_at).toLocaleDateString('en-GB', {
                day: '2-digit', month: '2-digit', year: 'numeric',
            });
            const formattedTime = new Date(ticket.created_at).toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit', hour12: true,
            });

            const dataObject = {
                id: ticket.id,
                referenceId: ticket.referenceId,
                category: ticket.zone_ticket_category?.name || "N/A",
                price: ticket.price || "N/A",
                bookedDate: formattedDate,
                bookedTime: formattedTime,
                eventName: ticket.events?.name || "N/A",
            };

            matchingKeys.forEach(key => {
                dataObject[key] = parsedDetails[key] || "N/A";
            });

            return dataObject;
        })
        : [];

    const formattedDate = (date) => {
        return ((new Date(date)).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }))
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const categoryWiseCount = _.groupBy(filteredRows, (row) => {
        const paymentStatus = row.eventRegistrations?.paymentStatus;
        const category = row.zone_ticket_category?.name || "N/A";
        return `${category}_${paymentStatus}`;
    });

    const renderCategoryCounts = () => {
        const categories = Object.keys(_.groupBy(filteredRows, (row) => row.zone_ticket_category?.name || "N/A"));

        return categories.map((category) => {
            const doneCount = categoryWiseCount[`${category}_done`]?.length || 0;
            const pendingCount = categoryWiseCount[`${category}_pending`]?.length || 0;
            const manualCount = categoryWiseCount[`${category}_manual`]?.length || 0;
            const allCount = doneCount + pendingCount + manualCount;

            return (
                <MDTypography key={category} variant="h6" pl={3}>
                    {category} :-
                    {paymentStatus !== 'pending' && paymentStatus !== 'done' && paymentStatus !== 'manual' && ` Total: ${allCount}  `}
                    {paymentStatus !== 'pending' && paymentStatus !== 'manual' && ` Done: ${doneCount}  `}
                    {paymentStatus !== 'pending' && paymentStatus !== 'done' && ` Manual: ${manualCount}  `}


                    {paymentStatus !== 'done' && paymentStatus !== 'manual' && ` Pending: ${pendingCount}  `}

                </MDTypography>
            );
        });
    };
    const currentRows = filteredRows && filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6}>
                {isLoading ?
                    <MDBox p={3} display="flex" justifyContent="center">
                        <CircularProgress color="info" />
                    </MDBox>
                    :
                    <>
                        <MDBox pb={6}>
                            <ReportsLineChart
                                color="info"
                                title="Tickets Count"
                                description="Number of booked tickets of the last week"
                                date="Weekly"
                                chart={chartData}
                            />
                        </MDBox>
                        <MDBox pt={6} pb={3}>
                            <Grid container spacing={6}>
                                <Grid item xs={12}>
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
                                                Tickets
                                            </MDTypography>
                                        </MDBox>

                                        <MDBox pt={3} pl={3} display="flex" justifyContent="left">
                                            <MDInput
                                                placeholder="Search by reference id..."
                                                value={searchTerm}
                                                onChange={handleSearch}
                                            />
                                        </MDBox>
                                        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                                            <ToggleButtonGroup
                                                size="small"
                                                value={paymentStatus}
                                                exclusive
                                                onChange={handlePaymentStatusChange}
                                            >
                                                <ToggleButton value="pending" key="pending" color="warning">
                                                    <MDTypography>Pending</MDTypography>
                                                </ToggleButton>
                                                <ToggleButton value="done" key="done" color="success">
                                                    <MDTypography>Done</MDTypography>
                                                </ToggleButton>
                                                <ToggleButton value="manual" key="manual" color="standard">
                                                    <MDTypography>Manual</MDTypography>
                                                </ToggleButton>
                                                <ToggleButton value="all" key="all" color="info">
                                                    <MDTypography>All</MDTypography>
                                                </ToggleButton>
                                            </ToggleButtonGroup>

                                            <MDBox>
                                                <CSVLink data={data} headers={headers} filename={"Tickets"}>
                                                    <MDButton variant='contained' color='info'>Download Tickets as CSV</MDButton>
                                                </CSVLink>
                                            </MDBox>
                                        </MDBox>


                                        {isLoading ? (
                                            <MDBox p={3} display="flex" justifyContent="center">
                                                <CircularProgress color="info" />
                                            </MDBox>
                                        ) : filteredRows && filteredRows.length > 0 ? (
                                            <>
                                                {!eventFree ? (
                                                    <>
                                                        <MDBox display="flex" justifyContent="space-between" alignItems="center" pl={3}>
                                                            <MDTypography variant="h6">Number of Tickets: {filteredRows.length}</MDTypography>
                                                        </MDBox>

                                                        <MDBox pl={3} pt={2}>
                                                            {renderCategoryCounts()}
                                                        </MDBox>
                                                    </>
                                                ) : (<MDBox display="flex" justifyContent="space-between" alignItems="center" pl={3}>
                                                    <MDTypography variant="h6">Number of Tickets: {filteredRows.length}</MDTypography>
                                                </MDBox>)}
                                                <MDBox pt={3}>
                                                    <TableContainer component={Paper}>
                                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                            <TableHead sx={{ display: "table-header-group" }}>
                                                                <TableRow>
                                                                    <TableCell>Reference ID</TableCell>
                                                                    <TableCell>Event</TableCell>
                                                                    <TableCell>Booked Date</TableCell>
                                                                    <TableCell>Booked by</TableCell>
                                                                    <TableCell>Phone</TableCell>
                                                                    <TableCell>Payment Status</TableCell>
                                                                    <TableCell>Category</TableCell>
                                                                    <TableCell>Copy Template</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {currentRows.map((row) => {

                                                                    const parsedDetails = row.eventRegistrations?.details ? JSON.parse(row.eventRegistrations?.details) : {};
                                                                    const firstName = parsedDetails["First Name"] || "N/A";
                                                                    const lastName = parsedDetails["Last Name"] || "N/A";
                                                                    const fullName = parsedDetails["Full Name"] || "N/A";
                                                                    const email = parsedDetails["Email"] || parsedDetails["Email Address"] || "N/A";
                                                                    //const tShirtSize = parsedDetails["T-Shirt Size"] || "N/A";
                                                                    const phone = parsedDetails["Phone Number"] || parsedDetails["Local Mobile Number"] || "N/A";
                                                                    const name = fullName !== 'N/A' ? fullName : (firstName !== 'N/A' && lastName !== 'N/A' ? `${firstName} ${lastName}` : 'N/A')
                                                                    //const category = row.zone_ticket_category?.name || "N/A";
                                                                    const referenceId = row.referenceId || "N/A";

                                                                    const paymentStatus = row.eventRegistrations?.paymentStatus
                                                                        ? row.eventRegistrations?.paymentStatus.charAt(0).toUpperCase() + row.eventRegistrations?.paymentStatus.slice(1)
                                                                        : "N/A";

                                                                    const eventName = row.events?.name || "N/A";
                                                                    const eventImage = row.events?.eventImage || "N/A";
                                                                    const location = row.venues?.name || "N/A";
                                                                    const date = dayjs(row.events?.date).format('ddd, DD MMM YYYY') || "N/A";
                                                                    const formatTime = (time) => time.slice(0, -3);

                                                                    const time = `${formatTime(row.events?.startTime)} - ${formatTime(row.events?.endTime)}` || "N/A";
                                                                    const qrCode = row.qrCode || "N/A";
                                                                    // const isEmailSent = row.isEmailSent




                                                                    return (
                                                                        <TableRow
                                                                            key={row.referenceId}
                                                                            style={{ cursor: 'pointer' }}
                                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                        >
                                                                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/viewTickets/single-ticket/${row.id}/${row.eventId}`); }} component="th" scope="row">
                                                                                {referenceId}
                                                                            </TableCell>
                                                                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/viewTickets/single-ticket/${row.id}/${row.eventId}`); }} align="left">{row.events?.name}</TableCell>
                                                                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/viewTickets/single-ticket/${row.id}/${row.eventId}`); }} align="left">{formattedDate(row.created_at)}</TableCell>
                                                                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/viewTickets/single-ticket/${row.id}/${row.eventId}`); }} align="left">{fullName !== 'N/A' ? fullName : (firstName !== 'N/A' && lastName !== 'N/A' ? `${firstName} ${lastName}` : 'N/A')}</TableCell>
                                                                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/viewTickets/single-ticket/${row.id}/${row.eventId}`); }} align="left">{phone}</TableCell>
                                                                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/viewTickets/single-ticket/${row.id}/${row.eventId}`); }} align="left">{paymentStatus}</TableCell>
                                                                            <TableCell onClick={(e) => { e.stopPropagation(); openPage(`/viewTickets/single-ticket/${row.id}/${row.eventId}`); }} align="left">{row.zone_ticket_category?.name}</TableCell>
                                                                            <TableCell align="left"><TicketEmail
                                                                                attendee={{
                                                                                    name: name,
                                                                                    email: email,
                                                                                    phoneNumber: phone,
                                                                                    // tShirtSize: tShirtSize,
                                                                                    // ticketType: category,
                                                                                    bookingId: referenceId,
                                                                                    //isEmailConfirmationSent: isEmailSent,
                                                                                }}
                                                                                event={{
                                                                                    eventName: eventName,
                                                                                    location: location,
                                                                                    date: date,
                                                                                    time: time,
                                                                                    bannerUrl: eventImage,
                                                                                    qrValue: qrCode,
                                                                                }}
                                                                            /></TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                        <TablePagination
                                                            rowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            component="div"
                                                            count={filteredRows.length}
                                                            rowsPerPage={rowsPerPage}
                                                            page={page}
                                                            onPageChange={handleChangePage}
                                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                                        />
                                                    </TableContainer>
                                                </MDBox>

                                            </>
                                        ) : (
                                            <DataNotFound message={'No Tickets Reserved Yet !'} image={noTicketImage} />
                                        )}
                                    </Card>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </>
                }
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}