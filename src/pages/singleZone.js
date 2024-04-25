import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, Grid, IconButton, TextField, } from "@mui/material";
import Footer from "examples/Footer";
import ChairIcon from "@mui/icons-material/Chair";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useParams } from "react-router-dom";
import { FixedSizeGrid } from 'react-window';

export default function SingleZone() {
    const { id } = useParams();
    const [seatsData, setSeatsData] = useState([]);

    useEffect(() => {
        fetchSeatsData();
    }, []);

    const fetchSeatsData = async () => {
        try {
            const { data, error } = await supabase.from('seats').select('*').eq('zoneId', id);
            if (error) throw error;
            if (data) {
                console.log(data);
                setSeatsData(data);
            }
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
                <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                        Seat Layout
                    </MDTypography>
                    <MDBox p={2}>
                        <FixedSizeGrid
                            columnCount={maxColumn+1}
                            columnWidth={80}
                            rowCount={maxRow+1}
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
                    </MDBox>
                </MDBox>
            </Card>
            <Footer />
        </DashboardLayout>
    );
}