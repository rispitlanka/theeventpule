import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, Grid, Typography, } from "@mui/material";
import Footer from "examples/Footer";
import ChairIcon from "@mui/icons-material/Chair";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function SingleZone() {
    const [seatsData, setSeatsData] = useState([]);

    useEffect(() => {
        fetchSeatsData();
    }, []);

    const fetchSeatsData = async () => {
        try {
            const { data, error } = await supabase.from('seats').select('*');
            if (error) throw error;
            if (data) {
                console.log(data);
                setSeatsData(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderSeatGrid = () => {
        // Determine max rows and columns
        let maxRow = 0;
        let maxColumn = 0;
        seatsData.forEach(seat => {
            maxRow = Math.max(maxRow, parseInt(seat.row));
            maxColumn = Math.max(maxColumn, parseInt(seat.column));
        });

        // Generate rows and columns
        const rows = [];
        // Render column headers (row 0)
        const columnHeaders = [];
        for (let column = 0; column <= maxColumn; column++) {
            // Add empty grid items before each column header
            columnHeaders.push(
                <Grid key={`col-header-${column}`} item />
            );
            // Render column header
            columnHeaders.push(
                <Grid key={`col-header-text-${column}`} item>
                    {column > 0 && (
                        <Typography variant="caption">Col {column}</Typography>
                    )}
                </Grid>
            );
        }
        rows.push(
            <Grid key="columns" container spacing={1} justifyContent="center">
                {columnHeaders}
            </Grid>
        );

        for (let row = 1; row <= maxRow; row++) {
            const columns = [];
            // Render row header
            columns.push(
                <Grid key={`row-${row}`} item style={{ minWidth: '48px' }}>
                    <Typography variant="caption">Row {row}</Typography>
                </Grid>
            );
            for (let column = 1; column <= maxColumn; column++) {
                // Render seat
                const seat = seatsData.find(seat => parseInt(seat.row) === row && parseInt(seat.column) === column);
                columns.push(
                    <Grid key={`seat-${row}-${column}`} item style={{ minWidth: '60px' }}>
                        {seat ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <ChairIcon style={{ color: 'green' }} />
                                <Typography variant="caption" style={{ width: '100%', textAlign: 'center' }}>{seat.seatName}</Typography>
                            </div>
                        ) : (
                            <div style={{ width: 48, height: 48 }}></div>
                        )}
                    </Grid>
                );
            }
            rows.push(
                <Grid key={`row-${row}`} container spacing={1} alignItems="center">
                    {columns}
                </Grid>
            );
        }
        return rows;
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
                    <Grid container spacing={1} justifyContent="center">
                        {/* Render seat grid */}
                        {renderSeatGrid()}
                    </Grid>
                </MDBox>
            </Card>
            <Footer />
        </DashboardLayout>
    );
}