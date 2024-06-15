import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Box, Card, CircularProgress, Grid, IconButton, TextField, } from "@mui/material";
import Footer from "examples/Footer";
import ChairIcon from "@mui/icons-material/Chair";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate, useParams } from "react-router-dom";
import { FixedSizeGrid } from 'react-window';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SingleZone() {
    const { id } = useParams();
    const [seatsData, setSeatsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [zoneData, setZoneData] = useState([]);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        fetchSeatsData();
        fetchZoneData();
    }, []);

    const fetchZoneData = async () => {
        try {
            const { data, error } = await supabase.from('zones').select('*').eq('id', id);
            if (error) throw error;
            if (data) {
                setZoneData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSeatsData = async () => {
        try {
            let allSeatsData = [];
            let page = 1;
            const pageSize = 1000; // Supabase limit per request
            let totalPages = Math.ceil(2500 / pageSize); // Total pages needed to fetch 2500 records

            // Fetch data until all records are retrieved or until maximum pages are reached
            while (page <= totalPages) {
                const { data, error, count } = await supabase
                    .from('seats')
                    .select('*')
                    .eq('zoneId', id)
                    .range((page - 1) * pageSize, page * pageSize - 1); // Adjust range for each page

                if (error) throw error;

                if (data) {
                    allSeatsData = allSeatsData.concat(data);
                }
                page++;
            }
            setSeatsData(allSeatsData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const maxRow = Math.max(...seatsData.map(seat => parseInt(seat.row)));
    const maxColumn = Math.max(...seatsData.map(seat => parseInt(seat.column)));

    const getRowHeadAlphabetic = (index) => {
        return String.fromCharCode(65 + index);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card sx={{
                position: "relative",
                mt: 5,
                mx: 3,
                p: 3,
                mb: 2,
            }}>
                {zoneData && zoneData.length > 0 && zoneData.map((zone => (
                    <Grid key={zone.id} sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", mb: 1 }}>
                        <Grid item>
                            <Grid display={'flex'} flexDirection={'row'}>
                                <MDTypography fontWeight="bold" mr={2}>{zone.name}</MDTypography>
                                <MDTypography fontWeight="light" mr={1}>Full Ticket : Rs.{zone.price}</MDTypography>
                                <MDTypography fontWeight="light" mr={1}>Half Ticket : Rs.{zone.halfPrice}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid item >
                            <EditIcon onClick={() => { openPage(`/theatres/single-theatre/single-screen/single-zone/edit-zone/${id}`) }} sx={{ cursor: 'pointer', mr: 1 }} />
                        </Grid>
                    </Grid>
                )))}
                <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                        Seat Layout
                    </MDTypography>
                    <MDBox p={2}>
                        {isLoading ?
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress color="info" />
                            </Box>
                            :
                            <FixedSizeGrid
                                columnCount={maxColumn + 1}
                                columnWidth={80}
                                rowCount={maxRow + 1}
                                rowHeight={80}
                                width={1600}
                                height={600}
                            >
                                {({ columnIndex, rowIndex, style }) => {
                                    const isHeaderRow = rowIndex === 0;
                                    const isHeaderColumn = columnIndex === 0;

                                    if (isHeaderRow && isHeaderColumn) {
                                        return <div style={style}></div>;
                                    }

                                    const columnHead = columnIndex.toString();
                                    const rowHead = rowIndex.toString();
                                    const rowHeadAlphabetic = getRowHeadAlphabetic(rowIndex - 1);

                                    const seat = seatsData.find(seat => seat.row === rowHead && seat.column === columnHead);
                                    const seatName = seat ? seat.seatName : '';

                                    return (
                                        <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                                            {isHeaderRow ? (
                                                <MDTypography>{columnHead}</MDTypography>
                                            ) : isHeaderColumn ? (
                                                <MDTypography>{rowHeadAlphabetic}</MDTypography>
                                            ) : (
                                                <Grid container direction="column" alignItems="center" spacing={1} m={1}>
                                                    {seat &&
                                                        <>
                                                            <IconButton><ChairIcon style={{ color: 'green' }} /></IconButton>
                                                            <MDTypography>{seatName}</MDTypography>
                                                        </>
                                                    }
                                                </Grid>
                                            )}
                                        </div>
                                    );
                                }}
                            </FixedSizeGrid>
                        }
                    </MDBox>
                </MDBox>
            </Card>
            <Footer />
        </DashboardLayout>
    );
}