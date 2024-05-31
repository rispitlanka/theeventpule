import DynamicForm from 'components/FormSubmission/dynamicForm'
import Footer from 'examples/Footer'
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import { useParams } from 'react-router-dom';
import { Box, Card, CircularProgress } from '@mui/material';
import MDTypography from 'components/MDTypography';

export default function RegisterEvent() {
    const { eventId } = useParams();
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
        <>
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

                        <MDTypography variant='h5' mb={1} fontWeight='medium'>Register For The Event</MDTypography>
                        {formFieldData && formFieldData.length > 0 ?
                            <DynamicForm sx={{ m: 2 }} fields={formFieldData} />
                            :
                            <MDTypography variant='h6' mb={1} sx={{ textAlign: 'center' }}>-Unavailable-</MDTypography>
                        }
                    </Card>
                }
            </Box>
            <Footer />
        </>
    )
}