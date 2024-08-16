import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Card, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, TextField } from '@mui/material'
import DataTable from "examples/Tables/DataTable";
import ticketsTableData from "layouts/tables/data/eventTicketsTableData";
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DataNotFound from 'components/NoData/dataNotFound'
import { useContext, useEffect, useState } from 'react';
import noTicketImage from "assets/images/illustrations/noTicket.png";
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import { supabase } from './supabaseClient';
import { UserDataContext } from 'context';

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
                            {isLoading ? (
                                <MDBox p={3} display="flex" justifyContent="center">
                                    <CircularProgress color="info" />
                                </MDBox>
                            ) : pRows && pRows.length > 0 ? (
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns: pColumns, rows: pRows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
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