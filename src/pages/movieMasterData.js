import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import ModifiedStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard/duplicatedStatisticsCard'
import { Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import { useNavigate } from 'react-router-dom'

export default function MovieMasterData() {
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    }
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={6} mb={6}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={1.5} onClick={() => openPage("/languages")} sx={{ cursor: 'pointer' }}>
                            <ModifiedStatisticsCard
                                icon="translate"
                                title="Language"
                            />
                        </MDBox>

                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={1.5} onClick={() => openPage("/genre")} sx={{ cursor: 'pointer' }}>
                            <ModifiedStatisticsCard
                                icon="dehaze"
                                title="Genres"
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={1.5} onClick={() => openPage("/censor-types")} sx={{ cursor: 'pointer' }}>
                            <ModifiedStatisticsCard
                                icon="dehaze"
                                title="Censor Types"
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={1.5} onClick={() => openPage("/cast")} sx={{ cursor: 'pointer' }}>
                            <ModifiedStatisticsCard
                                icon="group"
                                title="Cast"
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={1.5} onClick={() => openPage("/crew")} sx={{ cursor: 'pointer' }}>
                            <ModifiedStatisticsCard
                                icon="handyman"
                                title="Crew"
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={1.5} onClick={() => openPage("/soundsystem")} sx={{ cursor: 'pointer' }}>
                            <ModifiedStatisticsCard
                                icon="speaker"
                                title="Sound System"
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={1.5} onClick={() => openPage("/projection-type")} sx={{ cursor: 'pointer' }}>
                            <ModifiedStatisticsCard
                                icon="view_in_ar"
                                title="Projection Type"
                            />
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}
