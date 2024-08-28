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
                            <Grid item>
                                <MDBox height="100%" mt={0.5} lineHeight={1}>
                                    <MDTypography variant="h5" fontWeight="medium">
                                        Your Gateway to Exciting Events...
                                    </MDTypography>
                                    <MDTypography variant="button" color="text" fontWeight="regular">
                                        Explore our curated selection of upcoming events and secure your spot today.
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </Card>
                    <MDBox mt={5} mb={3}>
                        <EventsOnDate />
                    </MDBox>
                </>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}