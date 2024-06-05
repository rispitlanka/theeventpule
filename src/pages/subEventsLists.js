import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MDTypography from 'components/MDTypography';
import DataNotFound from 'components/NoData/dataNotFound';
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { useNavigate, useParams } from 'react-router-dom';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';


export default function SubEventsLists() {
    const { mainEventId } = useParams();
    const [subEventsData, setSubEventsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchSubEventsLists = async () => {
        try {
            const { data, error } = await supabase.from('events').select('*').eq('mainEventId', mainEventId);
            if (data) {
                setIsLoading(false);
                setSubEventsData(data);
                console.log('form data', data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchSubEventsLists();
    }, [])

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
                        <MDTypography variant='h5' mb={1} fontWeight='medium'>Sub Events</MDTypography>
                        {subEventsData && subEventsData.length > 0 ?
                            <TableContainer component={Paper} sx={{ mt: 9, p: 2 }}>
                                <Table>
                                    <TableHead sx={{ display: "table-header-group" }}>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align='center'>Description</TableCell>
                                            <TableCell align='center'>Status</TableCell>
                                            <TableCell align='center'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subEventsData.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell >{row.name}</TableCell>
                                                <TableCell align='center'>{row.description}</TableCell>
                                                <TableCell align='center'>{row.status}</TableCell>
                                                <TableCell align='center'><MDButton color='info' onClick={(e) => { e.stopPropagation(); openPage(`/main-events/sub-events/registerForEvents/${row.id}`); }}>Register</MDButton></TableCell>
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