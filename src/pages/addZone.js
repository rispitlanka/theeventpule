import { Box, Button, Card, Grid, IconButton, TextField, Typography } from '@mui/material'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import ChairIcon from '@mui/icons-material/Chair';
import { useParams } from 'react-router-dom'


export default function AddZone() {
    const { screenId } = useParams();
    const [columns, setColumns] = useState(0);
    const [rows, setRows] = useState(0);
    const [columnHeads, setColumnHeads] = useState([]);
    const [rowHeads, setRowHeads] = useState([]);
    const [seatDetails, setSeatDetails] = useState([]);
    const [editedSeatNames, setEditedSeatNames] = useState({});

    useEffect(() => {
        if (columns > 0 && rows > 0 && columnHeads.length > 0 && rowHeads.length > 0) {
            const newSeatDetails = generateSeatDetails();
            setSeatDetails(newSeatDetails);
        }
        // eslint-disable-next-line
    }, [columns, rows, columnHeads, rowHeads]);

    const generateSeatDetails = () => {
        const seatDetails = [];
        rowHeads.forEach((rowHead, rowIndex) => {
            columnHeads.forEach((columnHead, columnIndex) => {
                // const id = `seat_${rowIndex}_${columnIndex}`;
                const zoneID = 101;
                const displayName = `${rowHead}${columnHead}`;
                const seatName = `${rowIndex + 1}-${columnIndex + 1}`;
                const seatDetail = {
                    seatName: displayName,
                    row: rowIndex + 1,
                    column: columnIndex + 1,
                    zoneId: zoneID,
                };
                seatDetails.push(seatDetail);
            });
        });
        return seatDetails;
    };
    console.log(seatDetails);

    const newZone = useFormik({
        initialValues: {
            name: '',
            price: '',
            rows: '',
            columns: '',
            screenId: screenId,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const zoneData = {
                    name: values.name,
                    price: values.price,
                    rows: rows,
                    columns: columns,
                    screenId: screenId,
                }
                await addZoneData(zoneData);
            } catch (error) {
                console.error('Error submitting form:', error.message);
                setError(error.message);
            }
        },
    });
    const addZoneData = async (values) => {
        try {
            const { data, error } = await supabase.from('zones').insert(values);
            if (data) {
                console.log('Data inserted successfully:', data);
            }
            if (error) {
                throw error;
            }

        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };

    const newSeat = useFormik({
        initialValues: {
            seatName: '',
            zoneId: '',
        },
        onSubmit: async (values) => {
            console.log(values);
            try {
                // Iterate over each seat and insert its data into the database
                seatDetails.forEach((seatDetail) => {
                    const seatData = {
                        ...values, // Add other form values if needed                            
                        seatName: seatDetail.seatName,
                        zoneId: seatDetail.zoneId,
                    };
                    addSeatData(seatData);
                });
                console.log(values);
            } catch (error) {
                console.error('Error submitting form:', error.message);
                setError(error.message);
            }
        },

    });

    const addSeatData = async (values) => {
        console.log(values)
        try {
            const { data, error } = await supabase.from('seats').insert(values);
            if (data) {
                console.log(data);
            }
            if (error) {
                throw error;
            }
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };


    const handleShowClick = () => {
        const newColumnHeads = Array.from({ length: columns }, (_, index) => index + 1);
        setColumnHeads(newColumnHeads);

        const newRowHeads = Array.from({ length: rows }, (_, index) => 1 + index);
        setRowHeads(newRowHeads);
    };

    const handleColumnsChange = (event) => {
        const value = parseInt(event.target.value);
        setColumns(isNaN(value) ? 0 : value);
    };

    const handleRowsChange = (event) => {
        const value = parseInt(event.target.value);
        setRows(isNaN(value) ? 0 : value);
    };

    const handleColumnHeadChange = (index, event) => {
        const newColumnHeads = [...columnHeads];
        newColumnHeads[index] = event.target.value;
        setColumnHeads(newColumnHeads);
    };

    const handleRowHeadChange = (index, event) => {
        const newRowHeads = [...rowHeads];
        newRowHeads[index] = event.target.value;
        setRowHeads(newRowHeads);
    };

    const handleSeatNameChange = (event, rowIndex, columnIndex) => {
        const newEditedSeatNames = { ...editedSeatNames };
        newEditedSeatNames[`${rowIndex}-${columnIndex}`] = event.target.value;
        setEditedSeatNames(newEditedSeatNames);
    };

    const handleSaveSeatName = (rowIndex, columnIndex) => {
        const editedSeatName = editedSeatNames[`${rowIndex}-${columnIndex}`];
        if (editedSeatName) {
            const updatedSeatDetails = seatDetails.map(seatDetail => {
                if (seatDetail.row === rowIndex + 1 && seatDetail.column === columnIndex + 1) {
                    return { ...seatDetail, seatName: editedSeatName };
                }
                return seatDetail;
            });
            setSeatDetails(updatedSeatDetails);
        }
    };



    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <form onSubmit={newZone.handleSubmit}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    pt={1}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Add New Zones
                                    </MDTypography>
                                    <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" rows="4rem" columns="4rem" mt={-3}>
                                        <Button onClick={handleShowClick}>Show</Button>
                                    </MDBox>
                                    <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" rows="4rem" columns="4rem" mt={-3}>
                                        <Button type='submit'>Save</Button>
                                    </MDBox>
                                </MDBox>
                                <MDBox p={2}>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Name"
                                            name="name"
                                            value={newZone.values.name}
                                            onChange={newZone.handleChange}
                                            onBlur={newZone.handleBlur}
                                            error={newZone.touched.name && Boolean(newZone.errors.name)}
                                            helperText={newZone.touched.name && newZone.errors.name} />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Price"
                                            name="price"
                                            value={newZone.values.price}
                                            onChange={newZone.handleChange}
                                            onBlur={newZone.handleBlur}
                                            error={newZone.touched.price && Boolean(newZone.errors.price)}
                                            helperText={newZone.touched.price && newZone.errors.price} />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Rows"
                                            name="rows"
                                            value={rows}
                                            onChange={handleRowsChange}
                                            onBlur={newZone.handleBlur}
                                            error={newZone.touched.rows && Boolean(newZone.errors.rows)}
                                            helperText={newZone.touched.rows && newZone.errors.rows}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Columns"
                                            name="columns"
                                            value={columns}
                                            onChange={handleColumnsChange}
                                            onBlur={newZone.handleBlur}
                                            error={newZone.touched.columns && Boolean(newZone.errors.columns)}
                                            helperText={newZone.touched.columns && newZone.errors.columns}
                                        />
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </form>
                    </Grid>
                </Grid>
                <form onSubmit={newSeat.handleSubmit}>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Seat Setup</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={1}></Grid>
                            {columnHeads.map((head, index) => (
                                <Grid key={index} item sx={{ mb: 1 }}>
                                    <TextField
                                        sx={{ width: '55px', alignItems: 'center' }}
                                        id={`column-head-${index}`}
                                        label={`Column ${index + 1}`}
                                        variant="outlined"
                                        size="small"
                                        value={head}
                                        onChange={(event) => handleColumnHeadChange(index, event)}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Grid container spacing={1}>
                            {rowHeads.map((head, rowIndex) => (
                                <Grid key={rowIndex} container item xs={12} alignItems="center">
                                    <Grid item xs={1}>
                                        <TextField
                                            sx={{ width: '55px' }}
                                            id={`row-head-${rowIndex}`}
                                            label={`Row ${rowIndex + 1}`}
                                            variant="outlined"
                                            size="small"
                                            value={head}
                                            onChange={(event) => handleRowHeadChange(rowIndex, event)}
                                        />
                                    </Grid>
                                    {columnHeads.map((_, columnIndex) => (
                                        <Grid key={columnIndex} item sx={{ m: 1 }}>
                                            <Grid><IconButton><ChairIcon /></IconButton></Grid>
                                            <Grid>
                                                {/* Find the corresponding seatDetail */}
                                                {seatDetails.find(seatDetail => seatDetail.row === rowIndex + 1 && seatDetail.column === columnIndex + 1) && (
                                                    <TextField
                                                        size='small'
                                                        id={`seat-name-${rowIndex}-${columnIndex}`}
                                                        name='seatName'
                                                        value={editedSeatNames[`${rowIndex}-${columnIndex}`] || `${rowHeads[rowIndex]}${columnHeads[columnIndex]}`}
                                                        onChange={(event) => handleSeatNameChange(event, rowIndex, columnIndex)}
                                                        onBlur={() => handleSaveSeatName(rowIndex, columnIndex)}
                                                    // InputProps={{
                                                    //     readOnly: !!(editedSeatNames[`${rowIndex}-${columnIndex}`]), // Making the input readOnly if seat name is being edited
                                                    // }}
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>

                    </Box>
                    <Button type="submit">Save</Button>
                </form>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}
