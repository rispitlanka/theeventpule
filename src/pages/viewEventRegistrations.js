import Footer from 'examples/Footer';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Card, Button, CircularProgress, Collapse, Pagination, Tabs, Tab, Box } from '@mui/material';
import MDTypography from 'components/MDTypography';
import DataNotFound from 'components/NoData/dataNotFound';
import MDBox from 'components/MDBox';
import noDataImage from "assets/images/illustrations/noData3.svg";


import { Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export default function ViewEventRegistrations() {
    const { id } = useParams();
    const [eventRegistrationData, setEventRegistrationData] = useState([]);
    const [fullEventRegistrationData, setFullEventRegistrationData] = useState([]);
    const [registrationFormData, setRegistrationFormData] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const [selectedTab, setSelectedTab] = useState(0);
    const [textData, setTextData] = useState([]);
    const [pieData, setPieData] = useState([]);

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
            const { data, error } = await supabase.from('registrationForm').select('*').eq('eventId', id).order("id", { ascending: true });
            if (data) {
                setRegistrationFormData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAllEventRegistrations = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('eventRegistrations')
                .select('*')
                .eq('eventId', id);

            if (data) {
                setFullEventRegistrationData(data);

                generateStatistics(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEventRegistrations(currentPage);
        fetchRegistrationForm();
        fetchAllEventRegistrations();

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [id, currentPage, selectedTab],);



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

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };


    const generateStatistics = (registrations) => {
        const textCounts = {};
        const pieCounts = {};
        const colorPalette = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#008080", "#FF7F50", "#DAA520"];

        registrations.forEach(item => {
            const details = JSON.parse(item.details);
            registrationFormData.forEach(formField => {
                const fieldValue = details[formField.name];

                const normalizedValue = fieldValue ? fieldValue.trim() : '';

                if (['Text', 'Number', 'Phone', 'Email'].includes(formField.type)) {
                    if (normalizedValue) {
                        textCounts[formField.name] = textCounts[formField.name] || {};
                        textCounts[formField.name][normalizedValue] = (textCounts[formField.name][normalizedValue] || 0) + 1;
                    }
                }

                if (['Radio', 'Select'].includes(formField.type)) {
                    const options = formField.options.split(',').map(opt => opt.trim());
                    if (options.includes(normalizedValue)) {
                        pieCounts[formField.name] = pieCounts[formField.name] || {};
                        pieCounts[formField.name][normalizedValue] = (pieCounts[formField.name][normalizedValue] || 0) + 1;
                    }
                }
            });
        });


        const textDataList = Object.entries(textCounts).map(([fieldName, values]) => ({
            fieldName,
            values: Object.entries(values).map(([value, count]) => ({ value, count })),
        }));
        setTextData(textDataList);


        const pieDataList = Object.entries(pieCounts).map(([fieldName, values]) => {
            const options = registrationFormData.find(formField => formField.name === fieldName)?.options.split(',').map(opt => opt.trim()) || [];
            const data = options.map((option, index) => ({
                name: option,
                count: values[option] || 0,
                color: colorPalette[index % colorPalette.length],
            }));

            options.forEach((option, index) => {
                if (!values[option]) {
                    data.push({ name: option, count: 0, color: colorPalette[index % colorPalette.length] });
                }
            });

            return { fieldName, data };
        });
        setPieData(pieDataList);
        setIsLoading(false);
    };
    return (
        <DashboardLayout>
            <DashboardNavbar />


            <Card sx={{ p: 2, mb: 3, mt: 2 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Registered Informations" />
                    <Tab label="Statistical Representation" />
                </Tabs>
            </Card>


            {selectedTab === 0 && (
                <Card sx={{ p: 2, mb: 3 }}>
                    <MDTypography variant='h5' mb={1} fontWeight='medium'>Registered Informations</MDTypography>

                    {isLoading ? (
                        <MDBox p={3} display="flex" justifyContent="center">
                            <CircularProgress color="info" />
                        </MDBox>
                    ) : (eventRegistrationData && eventRegistrationData.length > 0) && (registrationFormData && registrationFormData.length > 0) ? (
                        <>
                            {eventRegistrationData.map((item, index) => {
                                const details = JSON.parse(item.details);
                                const fullName = details["Full Name"] || "N/A";
                                const firstName = details["First Name"] || "N/A";
                                const lastName = details["Last Name"] || "N/A";

                                return (
                                    <Card key={index} sx={{ mb: 2, p: 2, }}>
                                        <MDTypography variant="h6">
                                            ID: {item.id}
                                        </MDTypography>
                                        <MDTypography variant="body1">
                                            Name: {fullName !== 'N/A' ? fullName : `${firstName} ${lastName}` || 'N/A'}
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
            )}

            {isLoading ? (
                <MDBox p={3} display="flex" justifyContent="center">
                    <CircularProgress color="info" />
                </MDBox>
            ) : (
                selectedTab === 1 && (
                    <Card sx={{ p: 2, mb: 3 }}>
                        {/* Text Data Section */}
                        <MDTypography variant="h4" mt={1} >Responses</MDTypography>

                        {textData.map((field, index) => (
                            <Card key={index} sx={{ p: 2, mb: 3, mt: 2, width: '50%' }}>
                                <MDTypography variant="h5" mb={1}>{field.fieldName}</MDTypography>
                                <MDBox
                                    sx={{
                                        maxHeight: 300,
                                        overflowY: 'auto',
                                        border: '1px solid #ccc',
                                        borderRadius: 1,
                                        p: 1,
                                    }}
                                >
                                    {field.values.map((value, idx) => (
                                        <MDTypography key={idx} variant="body2" sx={{ mb: 1 }}>
                                            {value.value} ({value.count})
                                        </MDTypography>
                                    ))}
                                </MDBox>
                            </Card>
                        ))}

                        {/* Pie Chart Section */}
                        {pieData.map((field, index) => (
                            <Card key={index} sx={{ p: 2, mb: 3, mt: 2, width: '50%' }}>
                                <MDTypography variant="h5" mt={1} mb={3}>{field.fieldName}</MDTypography>
                                <PieChart width={450} height={450} >
                                    <Pie
                                        data={field.data}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        fill="#b85994"
                                        label

                                    >
                                        {field.data.map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </Card>
                        ))}
                    </Card>
                )
            )}
            <Footer />
        </DashboardLayout>
    );
}
