import { Card, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from 'pages/supabaseClient';
import DataNotFound from 'components/NoData/dataNotFound';
import noFormImage from "assets/images/illustrations/noForms2.png";
import DynamicForm from 'components/FormSubmission/dynamicForm';
import MDTypography from 'components/MDTypography';
import { UserDataContext } from 'context';

export default function TicketBookingAndRegistration() {
    const userDetails = useContext(UserDataContext);
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const { eventId, venueId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eventName = queryParams.get('eventName');
    const venueName = queryParams.get('venueName');
    const date = queryParams.get('date');
    const time = queryParams.get('time');
    const isFree = queryParams.get('isFree') === 'true';

    const navigate = useNavigate();
    const [venueData, setVenueData] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track selected category
    const [bookedTicketsCount, setBookedTicketsCount] = useState({});
    const [totalTicketsCount, setTotalTicketsCount] = useState({});
    const [organizationName, setOrganizationName] = useState([]);

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

    const fetchVenue = async () => {
        try {
            const { data, error } = await supabase
                .from('venues')
                .select('*, zones_events (*), zone_ticket_category(*)')
                .eq('id', venueId);
            if (data) {
                setVenueData(data);
                const ticketsCountByCategory = data[0].zone_ticket_category.reduce((acc, category) => {
                    acc[category.id] = parseInt(category.ticketsCount, 10) || 0;
                    return acc;
                }, {});
                setTotalTicketsCount(ticketsCountByCategory);
            }
            if (error) {
                console.log(error);
            }
        } catch (error) {
            console.log('Error in fetching venue', error);
        }
    };

    useEffect(() => {
        fetchOrganization();
        fetchVenue();
    }, []);

    const zoneName = selectedZoneId && (venueData[0]?.zones_events?.filter(zone => zone.id === selectedZoneId).map(zone => zone.name)[0]);
    const ticketPrice = isFree ? 'Free' : selectedCategoryId && (venueData[0]?.zone_ticket_category?.filter(category => category.id === selectedCategoryId).map(category => category.price)[0]);

    useEffect(() => {
        const fetchBookedTicketsCount = async (selectedZoneId, eventId) => {
            try {
                const { data, error } = await supabase
                    .rpc('get_booked_tickets_count', { zone_id: selectedZoneId, event_id: eventId });
                if (data) {
                    const countByCategory = data.reduce((acc, item) => {
                        acc[item.category_id] = item.count;
                        return acc;
                    }, {});
                    setBookedTicketsCount(countByCategory);
                }
                if (error) {
                    console.log(error);
                    return 0;
                }
            } catch (error) {
                console.log('Error in fetching booked tickets', error);
                return 0;
            }
        };
        if (selectedZoneId) {
            fetchBookedTicketsCount(Number(selectedZoneId), eventId);
        }
    }, [selectedZoneId, eventId]);

    const [formFieldData, setFormFieldData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRegistrationFormField = async () => {
        try {
            const { data, error } = await supabase.from('registrationForm').select('*').eq('eventId', eventId);
            if (data) {
                setIsLoading(false);
                setFormFieldData(data);
                console.log('form data', data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchRegistrationFormField();
    }, [eventId])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '80%'
                }}>

                <Card
                    sx={{
                        padding: 5,
                    }}
                >
                    <MDBox sx={{ width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Zone</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Select Zone"
                                        value={selectedZoneId}
                                        onChange={(e) => {
                                            setSelectedZoneId(e.target.value);
                                            setSelectedCategoryId(null);
                                        }}
                                        sx={{ height: '45px' }}
                                    >
                                        {venueData[0]?.zones_events?.map((zone) => (
                                            <MenuItem key={zone.id} value={zone.id}>
                                                {zone.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {selectedZoneId && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <FormLabel>Ticket Category</FormLabel>
                                        {venueData[0]?.zone_ticket_category
                                            ?.filter((category) => category.zoneId === selectedZoneId)
                                            .map((category) => {
                                                const totalTickets = totalTicketsCount[category.id] || 0;
                                                const bookedTickets = bookedTicketsCount[category.id] || 0;
                                                const availableTickets = totalTickets - bookedTickets;

                                                return (
                                                    <RadioGroup
                                                        key={category.id}
                                                        value={selectedCategoryId}
                                                        onChange={(e) => setSelectedCategoryId(category.id)}
                                                    >
                                                        <FormControlLabel
                                                            value={category.id}
                                                            control={<Radio />}
                                                            label={`${category.name} (${availableTickets} available)`}
                                                        />
                                                    </RadioGroup>
                                                );
                                            })}
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                    </MDBox>

                    <MDBox sx={{ width: '100%', marginTop: 2 }}>
                        {isLoading ? (
                            <MDBox sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress color="info" />
                            </MDBox>
                        ) : (
                            <MDBox>
                                <MDTypography variant="h5" mb={1} fontWeight="medium">
                                    Register For The Event - {eventName}
                                </MDTypography>
                                {formFieldData && formFieldData.length > 0 ? (
                                    <DynamicForm
                                        sx={{ m: 2 }}
                                        fields={formFieldData}
                                        eventId={eventId}
                                        venueId={venueId}
                                        eventName={eventName}
                                        venueName={venueName}
                                        date={date}
                                        time={time}
                                        zoneId={selectedZoneId}
                                        categoryId={selectedCategoryId}
                                        eventOrganizationId={userOrganizationId}
                                        price={ticketPrice}
                                        bookedBy={organizationName || null}
                                    />
                                ) : (
                                    <DataNotFound message={'No Forms Available !'} image={noFormImage} />
                                )}
                            </MDBox>
                        )}
                    </MDBox>
                </Card>

            </MDBox>

        </DashboardLayout>
    )
}
