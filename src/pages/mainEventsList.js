import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MDTypography from 'components/MDTypography';
import DataNotFound from 'components/NoData/dataNotFound';
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { useNavigate } from 'react-router-dom';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';


export default function MainEventsLists() {
    const [mainEventsData, setMainEventsData] = useState([]);
    const [subEventsData, setSubEventsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchSubEventLists = async () => {
        try {
            const { data: subEventData, error: subEventError } = await supabase.from('events').select('*').not('mainEventId', 'is', null);
            if (subEventData) {
                setIsLoading(false);
                setSubEventsData(subEventData);
                console.log('Sub events data', subEventData);
                const mainEventIds = subEventData.map(event => event.mainEventId);
                const { data: mainEventData, error: mainEventError } = await supabase.from('mainEvent').select('*').in('id', mainEventIds);
                if (mainEventData) {
                    setMainEventsData(mainEventData);
                    console.log('Main events data', mainEventData);
                }
                if (mainEventError) throw mainEventError;
            }
            if (subEventError) throw subEventError;
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchSubEventLists();
    }, []);

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
                    <MDBox sx={{ p: 2, mb: 2, width: '80%' }}>

                        <MDTypography variant='h5' mb={1} fontWeight='medium'>Main Events</MDTypography>
                        {mainEventsData && mainEventsData.length > 0 ?
                            <TableContainer component={Paper} sx={{ mt: 9, p: 2 }}>
                                <Table>
                                    <TableHead sx={{ display: "table-header-group" }}>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align='center'>Description</TableCell>
                                            <TableCell align='center'>Organizer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mainEventsData.map((row) => (
                                            <TableRow key={row.id} onClick={(e) => { e.stopPropagation(); openPage(`/main-events/sub-events/${row.id}`); }} style={{ cursor: 'pointer' }}>
                                                <TableCell >{row.title}</TableCell>
                                                <TableCell align='center'>{row.description}</TableCell>
                                                <TableCell align='center'>{row.organizer}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer> :
                            <DataNotFound message={'No Events Available !'} image={noDataImage} />
                        }
                    </MDBox>
                }
            </Box>
            <Footer />
        </>
    )
}