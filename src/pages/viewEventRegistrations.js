import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Card, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MDTypography from 'components/MDTypography';
import DataNotFound from 'components/NoData/dataNotFound';
import MDBox from 'components/MDBox';
import noDataImage from "assets/images/illustrations/noData3.svg";

export default function ViewEventRegistrations() {
    const { id } = useParams();
    const [eventRegistrationData, setEventRegistrationData] = useState([]);
    const [registrationFormData, setRegistrationFormData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEventRegistrations = async () => {
        try {
            const { data, error } = await supabase.from('eventRegistrations').select('*').in('eventId', [id]);
            if (data) {
                setEventRegistrationData(data);
                console.log('event data', data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    const fetchRegistrationForm = async () => {
        try {
            const { data, error } = await supabase.from('registrationForm').select('*').in('eventId', [id]);
            if (data) {
                setRegistrationFormData(data);
                console.log('form reg data', data);
            }

            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchEventRegistrations();
        fetchRegistrationForm();
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [id])

    const allKeysOfRegisteredEvents = [...new Set(eventRegistrationData.flatMap(item => Object.keys(JSON.parse(item.details))))];
    const allKeysOfForm = [...new Set(registrationFormData.map(item => (item.name)))];
    const matchingKeys = allKeysOfRegisteredEvents.filter(key => allKeysOfForm.includes(key) && key !== 'id');

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card sx={{ p: 2, mb: 3, mt: 2 }}>
                <MDTypography variant='h5' mb={1} fontWeight='medium'>Registered Informations</MDTypography>
                {isLoading ?
                    <MDBox p={3} display="flex" justifyContent="center">
                        <CircularProgress color="info" />
                    </MDBox>
                    :
                    (eventRegistrationData && eventRegistrationData.length > 0) && (registrationFormData && registrationFormData.length > 0) ?
                        <Table>
                            <TableHead sx={{ display: "table-header-group" }}>
                                <TableRow>
                                    {matchingKeys.map(key => (
                                        <TableCell key={key}>{key}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {eventRegistrationData.map((item, index) => {
                                    const details = JSON.parse(item.details);
                                    return (
                                        <TableRow key={index}>
                                            {matchingKeys.map(key => (
                                                <TableCell key={key}>
                                                    {details[key] || '--'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        :
                        <DataNotFound message={'No Entries Yet !'} image={noDataImage} />
                }
            </Card>
            <Footer />
        </DashboardLayout>
    )
}