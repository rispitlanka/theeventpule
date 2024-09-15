import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Card, CardContent, CircularProgress, Grid, TextField } from '@mui/material'
import DataTable from "examples/Tables/DataTable";
import ticketsTableData from "layouts/tables/data/eventTicketsTableData";
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

export default function ViewTickets() {
    const { columns: pColumns, rows: pRows } = ticketsTableData();
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventId, setEventId] = useState([]);

    const [referenceId, setReferenceId] = useState('');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('all');

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        const fetchEventsByDate = async () => {
            try {
                const currentDate = getCurrentDate();
                const { data, error } = await supabase
                    .from('events')
                    .select('id')
                    .eq('eventOrganizationId', userOrganizationId)
                    .gte('date', currentDate);

                if (error) throw error;
                const eventIds = data.map(event => event.id);
                setEventId(eventIds);
            } catch (error) {
                console.log(error)
            }
        }
        const fetchTickets = async () => {
            if (referenceId.trim() === '' || eventId.length === 0) {
                setTickets([]);
                setError('');
                setSearched(false);
                return;
            }
            setLoading(true);
            setError('');
            setSearched(true);
            try {
                const { data, error } = await supabase
                    .from('tickets_events')
                    .select('*')
                    .in('eventId', eventId)
                    .ilike('referenceId', `%${referenceId}%`);

                if (error) throw error;
                setTickets(data);
            } catch (error) {
                setError('Error fetching tickets');
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchTickets();
        }, 500);

        fetchEventsByDate();
        return () => clearTimeout(delayDebounceFn);
    }, [referenceId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .rpc('get_event_ticket_count', { eventorganization_id: 1 });
                if (error) throw error;
                const labels = data.map(item => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', });
                }); const count = data.map(item => item.ticket_count);
                setChartData({ labels, datasets: { label: "Count", data: count } });

            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userOrganizationId]);

    const groupTicketsByReferenceId = (tickets) => {
        return tickets.reduce((groups, ticket) => {
            const { referenceId } = ticket;
            if (!groups[referenceId]) {
                groups[referenceId] = [];
            }
            groups[referenceId].push(ticket);
            return groups;
        }, {});
    };

    const groupedTickets = groupTicketsByReferenceId(tickets);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredRows = useMemo(() => {
        return pRows?.filter((row) => {
            const reference = row.referenceId?.props?.children;
            const status = row.paymentStatus?.props?.children;
            const matchesSearch = reference?.includes(searchTerm);
            const matchesStatus =
                paymentStatus === 'all' || (paymentStatus === 'done' && status?.includes('done')) || (paymentStatus === 'pending' && !status?.includes('done'));
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, paymentStatus, pRows]);

    const headers = [
        { label: "Id", key: "id" },
        { label: "Seat Id", key: "seatId" },
        { label: "Category", key: "category" },
        { label: "Price", key: "price" },
        { label: "Event", key: "eventName" },
        { label: "Checked In", key: "checkedIn" },
        { label: "Active", key: "isActive" },
        { label: "Zone", key: "zone" },
        { label: "Venue", key: "venue" },
        { label: "Organizers", key: "organizationName" },
        { label: "Reference Id", key: "referenceId" },
        { label: "Booked By", key: "bookedBy" },
        { label: "Phone", key: "phone" },
        { label: "Booked Date", key: "created_at" },
    ];

    const data = filteredRows ? filteredRows.map(ticket => ({
        id: ticket.id?.props?.children?.props?.id,
        created_at: ticket.bookedDate?.props?.children,
        seatId: ticket.seatId?.props?.children,
        bookedBy: ticket.bookedBy?.props?.children,
        phone: ticket.phone?.props?.children,
        referenceId: ticket.referenceId?.props?.children,
        eventName: ticket.eventName?.props?.children,
        category: ticket.category?.props?.children,
        checkedIn: ticket.checkedIn?.props?.children,
        isActive: ticket.isActive?.props?.children,
        organizationName: ticket.organizationName?.props.children,
        price: ticket.price?.props.children,
        venue: ticket.venue?.props.children,
        zone: ticket.zone?.props.children,
    })) : [];
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox sx={{ mt: 2, mb: 2 }}>
                <TextField fullWidth id="standard-basic" label="Search for tickets" variant="standard" value={referenceId} onChange={(e) => setReferenceId(e.target.value)} sx={{ mb: 1 }} />
                {loading && <MDTypography>Searching...<CircularProgress color="info" /></MDTypography>}
                {error && <MDTypography>{error}</MDTypography>}
                {!loading && searched && tickets.length === 0 && (
                    <MDTypography variant="body2">No tickets found</MDTypography>
                )}
                <Grid container spacing={2}>
                    {Object.entries(groupedTickets).map(([refId, tickets]) => (
                        <Grid item xs={12} key={refId}>
                            <Card>
                                <CardContent>
                                    <MDTypography variant="h6">Reference ID: {refId}</MDTypography>
                                    <MDTypography>Booked By: {tickets.bookedBy}</MDTypography>
                                    {tickets.map((ticket) => (
                                        <Grid key={ticket.id}>
                                            <MDTypography variant="body2" mr={2}>Ticket ID: {ticket.id}</MDTypography>
                                        </Grid>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </MDBox>
            <MDBox pt={6} pb={3}>
                {isLoading ?
                    <MDBox p={3} display="flex" justifyContent="center">
                        <CircularProgress color="info" />
                    </MDBox>
                    :
                    <ReportsLineChart
                        color="info"
                        title="Tickets Count"
                        description="Number of booked tickets of the last week"
                        date="Weekly"
                        chart={chartData}
                    />
                }
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
                            <MDBox pt={3} pr={3} display="flex" justifyContent="right">
                                <CSVLink data={data} headers={headers} filename={"Tickets"}>
                                    <MDButton variant='contained' color='info'>Download Tickets as CSV</MDButton>
                                </CSVLink>
                            </MDBox>
                            <MDBox pt={3} pr={3} display="flex" justifyContent="right" gap={1}>
                                <MDButton
                                    variant={paymentStatus === 'pending' ? 'contained' : 'outlined'}
                                    color='warning'
                                    onClick={() => setPaymentStatus('pending')}
                                >
                                    Pending
                                </MDButton>
                                <MDButton
                                    variant={paymentStatus === 'done' ? 'contained' : 'outlined'}
                                    color='success'
                                    onClick={() => setPaymentStatus('done')}
                                >
                                    Done
                                </MDButton>
                                <MDButton
                                    variant={paymentStatus === 'all' ? 'contained' : 'outlined'}
                                    color='info'
                                    onClick={() => setPaymentStatus('all')}
                                >
                                    All
                                </MDButton>
                            </MDBox>
                            {isLoading ? (
                                <MDBox p={3} display="flex" justifyContent="center">
                                    <CircularProgress color="info" />
                                </MDBox>
                            ) : filteredRows && filteredRows.length > 0 ? (
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns: pColumns, rows: filteredRows }}
                                        isSorted={false}
                                        entriesPerPage={true}
                                        showTotalEntries={true}
                                        noEndBorder
                                    />
                                </MDBox>
                            ) : (
                                <DataNotFound message={'No Tickets Reserved Yet !'} image={noTicketImage} />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}