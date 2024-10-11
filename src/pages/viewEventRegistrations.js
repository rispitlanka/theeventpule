import Footer from 'examples/Footer';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Card, Button, CircularProgress, Collapse, Pagination } from '@mui/material';
import MDTypography from 'components/MDTypography';
import DataNotFound from 'components/NoData/dataNotFound';
import MDBox from 'components/MDBox';
import noDataImage from "assets/images/illustrations/noData3.svg";

export default function ViewEventRegistrations() {
    const { id } = useParams();
    const [eventRegistrationData, setEventRegistrationData] = useState([]);
    const [registrationFormData, setRegistrationFormData] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 10;


    const fetchEventRegistrations = async (page) => {
        try {
            const start = (page - 1) * rowsPerPage;
            const { data, count, error } = await supabase
                .from('eventRegistrations')
                .select('*', { count: 'exact' })
                .eq('eventId', id)
                .range(start, start + rowsPerPage - 1);

            if (data) {
                setEventRegistrationData(data);
                setTotalPages(Math.ceil(count / rowsPerPage));
            }
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };


    const fetchRegistrationForm = async () => {
        try {
            const { data, error } = await supabase.from('registrationForm').select('*').eq('eventId', id);
            if (data) {
                setRegistrationFormData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEventRegistrations(currentPage);
        fetchRegistrationForm();
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [id, currentPage]);

    const allKeysOfRegisteredEvents = [...new Set(eventRegistrationData.flatMap(item => Object.keys(JSON.parse(item.details))))];
    const allKeysOfForm = [...new Set(registrationFormData.map(item => (item.name)))];
    const matchingKeys = allKeysOfRegisteredEvents.filter(key => allKeysOfForm.includes(key) && key !== 'id');


    const toggleExpand = (cardId) => {
        setExpandedId(expandedId === cardId ? null : cardId);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        setIsLoading(true);
        fetchEventRegistrations(value);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card sx={{ p: 2, mb: 3, mt: 2 }}>
                <MDTypography variant='h5' mb={1} fontWeight='medium'>Registered Informations</MDTypography>
                {isLoading ? (
                    <MDBox p={3} display="flex" justifyContent="center">
                        <CircularProgress color="info" />
                    </MDBox>
                ) : (eventRegistrationData && eventRegistrationData.length > 0) && (registrationFormData && registrationFormData.length > 0) ? (
                    <>
                        {eventRegistrationData.map((item, index) => {

                            const details = JSON.parse(item.details);

                            const fullName = details["Full Name"] || "N/A";;
                            const firstName = details["First Name"] || "N/A";
                            const lastName = details["Last Name"] || "N/A";
                            return (
                                <Card key={index} sx={{ mb: 2, p: 2, }}>
                                    <MDTypography variant="h6">
                                        ID: {item.id}
                                    </MDTypography>
                                    <MDTypography variant="body1">
                                        Name: {fullName !== 'N/A' ? fullName : (firstName !== 'N/A' && lastName !== 'N/A' ? `${firstName} ${lastName}` : 'N/A')}

                                    </MDTypography>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => toggleExpand(item.id)}
                                        sx={{
                                            mt: 2,
                                            width: '12px',

                                            fontSize: '0.75rem',
                                            color: 'white !important'
                                        }}
                                    >
                                        {expandedId === item.id ? "Less" : "More"}
                                    </Button>

                                    <Collapse in={expandedId === item.id}>
                                        <MDBox mt={2} mb={4}>
                                            {matchingKeys.map(key => (
                                                <MDTypography key={key} variant="body2">
                                                    <strong>{key}:</strong> {details[key] || '--'}
                                                </MDTypography>
                                            ))}
                                        </MDBox>
                                    </Collapse>
                                </Card>
                            );
                        })}


                        <MDBox display="flex" justifyContent="right" mt={2}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="standard"
                                siblingCount={1}
                                boundaryCount={1}
                            />
                        </MDBox>
                    </>
                ) : (
                    <DataNotFound message={'No Entries Yet!'} image={noDataImage} />
                )}
            </Card>
            <Footer />
        </DashboardLayout>
    );
}
