import DynamicForm from 'components/FormSubmission/dynamicForm'
import Footer from 'examples/Footer'
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Card, CircularProgress } from '@mui/material';
import MDTypography from 'components/MDTypography';
import DataNotFound from 'components/NoData/dataNotFound';
import noFormImage from "assets/images/illustrations/noForms2.png";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

export default function RegisterEvent() {
    const location = useLocation();
    const { eventId, venueId, zoneId, eventName, eventDate, eventTime, venueName, zoneName, isFree, categoryId } = location.state;
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
            <DashboardNavbar/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                {isLoading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color="info" />
                    </Box>
                    :
                    <Card sx={{ p: 2, mb: 2, width: '80%' }}>

                        <MDTypography variant='h5' mb={1} fontWeight='medium'>Register For The Event - {eventName}</MDTypography>
                        {formFieldData && formFieldData.length > 0 ?
                            <DynamicForm sx={{ m: 2 }} fields={formFieldData} eventId={eventId} />
                            :
                            <DataNotFound message={'No Forms Available !'} image={noFormImage} />
                        }
                    </Card>
                }
            </Box>
            <Footer />
        </DashboardLayout>
    )
}