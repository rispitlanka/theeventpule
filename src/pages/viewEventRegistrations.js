import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function ViewEventRegistrations() {
    const { id } = useParams();
    const [eventRegistrationData, setEventRegistrationData] = useState([]);
    const [registrationFormData, setRegistrationFormData] = useState([]);

    const fetchEventRegistrations = async () => {
        try {
            const { data, error } = await supabase.from('eventRegistrations').select('*').in('eventId', id);
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
            const { data, error } = await supabase.from('registrationForm').select('*').in('eventId', id);
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
    }, [id])

    const allKeysOfRegisteredEvents = [...new Set(eventRegistrationData.flatMap(item => Object.keys(JSON.parse(item.details))))];
    const allKeysOfForm = [...new Set(registrationFormData.map(item => (item.name)))];
    const matchingKeys = allKeysOfRegisteredEvents.filter(key => allKeysOfForm.includes(key) && key !== 'id');

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card sx={{ mt: 3, mb: 3 }}>
                {eventRegistrationData && eventRegistrationData.length > 0 && (
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
                )}
            </Card>
            <Footer />
        </DashboardLayout>
    )
}