import React, { useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Box, Button, Card, CircularProgress, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, } from "@mui/material";
import Footer from "examples/Footer";
import ChairIcon from "@mui/icons-material/Chair";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useParams } from "react-router-dom";
import { FixedSizeGrid } from 'react-window';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserDataContext } from "context";
import EditTicketCategoryModel from "./Models/editTicketCategoryModel";
import DeleteDialog from "components/DeleteDialogBox/deleteDialog";
import { ToastContainer, toast } from 'react-toastify';


export default function SingleEventZone() {
    const userDetails = useContext(UserDataContext);
    const userRole = userDetails && userDetails[0].userRole;
    const queryParams = new URLSearchParams(location.search);
    const isSeatLayout = queryParams.get('isSeatLayout') === 'true';
    const { id } = useParams();
    const [seatsData, setSeatsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [zoneData, setZoneData] = useState([]);
    const [openDialogBox, setOpenDialogBox] = useState();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState();

    //  model for edit option
    const handleDialogBoxOpen = (id) => {
        setSelectedCategoryId(id);
        setOpenDialogBox(true);
    }
    const handleDialogBoxClose = () => {
        setOpenDialogBox(false);
        fetchZoneData();
        setSelectedCategoryId();
    };

    // model for delete confirmation
    const handleDelete = async () => {
        setOpenDeleteDialogBox(true);
    };

    const closeDeleteDialogBox = () => {
        setOpenDeleteDialogBox(false);
    };

    const handleDeleteConfirm = async (categoryId) => {
        try {
            const { error } = await supabase.from('zone_ticket_category').delete().eq('id', categoryId);
            if (error) {
                throw error;
            }
            console.log('Data deleted successfully');
            setOpenDeleteDialogBox(false);
            toast.error('Category has been successfully deleted!');
        } catch (error) {
            console.error('Error deleting data:', error.message);
        }
    };

    useEffect(() => {
        fetchSeatsData();
        fetchZoneData();
    }, []);

    const fetchZoneData = async () => {
        try {
            const { data, error } = await supabase.from('zones_events').select('*,zone_ticket_category(*)').eq('id', id);
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
                    .from('seats_events')
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
                    <Grid key={zone.id} sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                        <MDTypography fontWeight="bold" mb={1}>{zone.name}</MDTypography>
                        {isSeatLayout ? (
                            <Grid>
                                <MDTypography fontWeight="light" mr={1}>Full Ticket: Rs.{zone.price}</MDTypography>
                                <MDTypography fontWeight="light" mr={1}>Half Ticket: Rs.{zone.halfPrice}</MDTypography>
                            </Grid>
                        ) : (
                            <TableContainer sx={{ boxShadow: 'none' }}>
                                <Table>
                                    <TableHead sx={{ display: "table-header-group" }}>
                                        <TableRow>
                                            <TableCell>Category</TableCell>
                                            <TableCell align='center'>Price</TableCell>
                                            <TableCell align='center'>Count</TableCell>
                                            <TableCell align='center'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {zone?.zone_ticket_category?.map((category, index) => (
                                            <TableRow key={index}>
                                                <TableCell> {category.name}</TableCell>
                                                <TableCell align='center'>{category.price}</TableCell>
                                                <TableCell align='center'>{category.ticketsCount}</TableCell>
                                                <TableCell align='center'>
                                                    <Button onClick={() => handleDialogBoxOpen(category.id)}><EditIcon /></Button>
                                                    <Button onClick={() => handleDelete(category.id)}><DeleteIcon /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Grid>
                )))}
                <MDBox>
                    {isSeatLayout &&
                        <>
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
                        </>
                    }
                </MDBox>
            </Card>
            <EditTicketCategoryModel
                open={openDialogBox}
                onClose={handleDialogBoxClose}
                categoryId={selectedCategoryId}
            />
            <DeleteDialog
                open={openDeleteDialogBox}
                onClose={closeDeleteDialogBox}
                onDelete={handleDeleteConfirm}
                name={'ticket category'}
            />
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </DashboardLayout>
    );
}