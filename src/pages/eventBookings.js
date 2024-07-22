import React, { useState } from 'react'
import { Card, Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import backgroundImage from "assets/images/seats1.jpg";
import EventsOnDate from 'components/EventBooking/eventsOnDate'

export default function EventBookings() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const currentDate = today.getDate();

    const getCurrentWeekDates = () => {
        const currentWeekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(currentDate - currentDayOfWeek + i);
            currentWeekDates.push(date);
        }
        return currentWeekDates;
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
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
                            )}, url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
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
                            {getCurrentWeekDates().map((date, index) => (
                                <Grid item key={index}>
                                    <MDBox
                                        style={{
                                            textAlign: 'center',
                                            backgroundColor: selectedDate && selectedDate.getDate() === date.getDate() ? '#0288d1' : 'transparent',
                                            borderRadius: '10px',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            minWidth: 80,
                                        }}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        <MDTypography variant="h4" color={selectedDate && selectedDate.getDate() === date.getDate() ? 'white' : 'inherit'}>{date.getDate()}</MDTypography>
                                        <MDTypography variant="caption" color={selectedDate && selectedDate.getDate() === date.getDate() ? 'white' : 'inherit'}>{daysOfWeek[date.getDay()]}</MDTypography>
                                    </MDBox>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                    <MDBox mt={5} mb={3}>
                        <EventsOnDate date={formattedDate} />
                    </MDBox>
                </>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}