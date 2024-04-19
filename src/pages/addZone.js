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
import BlockIcon from '@mui/icons-material/Block';


export default function AddZone() {
    const { screenId } = useParams();
    const [columns, setColumns] = useState(0);
    const [rows, setRows] = useState(0);
    const [columnHeads, setColumnHeads] = useState([]);
    const [rowHeads, setRowHeads] = useState([]);
    const [seatDetails, setSeatDetails] = useState([]);
    const [editedSeatNames, setEditedSeatNames] = useState({});
    const [disabledColumns, setDisabledColumns] = useState([]);
    const [disabledRows, setDisabledRows] = useState([]);
    const [disabledSeats, setDisabledSeats] = useState([]);
    const [zoneID, setZoneID] = useState();

    useEffect(() => {
        if (columns > 0 && rows > 0 && columnHeads.length > 0 && rowHeads.length > 0) {
            const newSeatDetails = generateSeatDetails();
            setSeatDetails(newSeatDetails);
        }
        // eslint-disable-next-line
    }, [columns, rows, columnHeads, rowHeads]);

    useEffect(() => {
        setDisabledColumns([]);
        setDisabledRows([]);
        setDisabledSeats([]);
        // eslint-disable-next-line
    }, [rows, columns])

    const generateSeatDetails = () => {
        const seatDetails = [];
        rowHeads.forEach((rowHead, rowIndex) => {
            columnHeads.forEach((columnHead, columnIndex) => {
                const displayName = `${rowHead}${columnHead}`;
                const seatDetail = {
                    seatName: displayName,
                    row: rowIndex + 1,
                    column: columnIndex + 1,
                    zoneId: zoneID,
                    screenId: screenId,
                    type: 'enabled',
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
            const { data, error } = await supabase.from('zones').insert(values).select('*');
            if (data) {
                setZoneID(data[0].id);
                console.log('Data inserted successfully:', data[0].id);
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
                const enabledSeatDetails = seatDetails.filter(seatDetail => seatDetail.type === 'enabled');
                enabledSeatDetails.forEach((seatDetail) => {
                    const seatData = {
                        ...values,
                        seatName: seatDetail.seatName,
                        zoneId: seatDetail.zoneId,
                        screenId: seatDetail.screenId,
                        row: seatDetail.row,
                        column: seatDetail.column,
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

    const handleColumnDisable = (columnIndex) => {
        if (disabledColumns.includes(columnIndex)) {
            // If column is disabled, remove it from disabledColumns array
            const updatedDisabledColumns = disabledColumns.filter(colIndex => colIndex !== columnIndex);
            setDisabledColumns(updatedDisabledColumns);
            // Update seatDetails to enable seats in the column
            const updatedSeatDetails = seatDetails.map(seatDetail => {
                if (seatDetail.column === columnIndex + 1) {
                    return { ...seatDetail, type: 'enabled' };
                }
                return seatDetail;
            });
            setSeatDetails(updatedSeatDetails);
        } else {
            // If column is not disabled, add it to disabledColumns array
            setDisabledColumns([...disabledColumns, columnIndex]);
            // Update seatDetails to disable seats in the column
            const updatedSeatDetails = seatDetails.map(seatDetail => {
                if (seatDetail.column === columnIndex + 1) {
                    return { ...seatDetail, type: 'disabled' };
                }
                return seatDetail;
            });
            setSeatDetails(updatedSeatDetails);
        }
    };

    const handleRowDisable = (rowIndex) => {
        if (disabledRows.includes(rowIndex)) {
            // If row is disabled, remove it from disabledRows array
            const updatedDisabledRows = disabledRows.filter(rowIdx => rowIdx !== rowIndex);
            setDisabledRows(updatedDisabledRows);
            // Update seatDetails to enable seats in the row
            const updatedSeatDetails = seatDetails.map(seatDetail => {
                if (seatDetail.row === rowIndex + 1) {
                    return { ...seatDetail, type: 'enabled' };
                }
                return seatDetail;
            });
            setSeatDetails(updatedSeatDetails);
        } else {
            // If row is not disabled, add it to disabledRows array
            setDisabledRows([...disabledRows, rowIndex]);
            // Update seatDetails to disable seats in the row
            const updatedSeatDetails = seatDetails.map(seatDetail => {
                if (seatDetail.row === rowIndex + 1) {
                    return { ...seatDetail, type: 'disabled' };
                }
                return seatDetail;
            });
            setSeatDetails(updatedSeatDetails);
        }
    };

    const handleSeatDisable = (rowIndex, columnIndex) => {
        const seatIndex = rowIndex * columns + columnIndex;
        if (disabledSeats.includes(seatIndex)) {
            // Seat is already disabled, so enable it back
            const updatedDisabledSeats = disabledSeats.filter(seat => seat !== seatIndex);
            setDisabledSeats(updatedDisabledSeats);
            const updatedSeatDetails = seatDetails.map(seatDetail => {
                if (seatDetail.row === rowIndex + 1 && seatDetail.column === columnIndex + 1) {
                    return { ...seatDetail, type: 'enabled' }; // Replace 'Seat Name' with the actual name if available
                }
                return seatDetail;
            });
            setSeatDetails(updatedSeatDetails);
        } else {
            // Seat is not disabled, so disable it
            setDisabledSeats([...disabledSeats, seatIndex]);
            const updatedSeatDetails = seatDetails.map(seatDetail => {
                if (seatDetail.row === rowIndex + 1 && seatDetail.column === columnIndex + 1) {
                    return { ...seatDetail, type: 'disabled' };
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
                                    <MDTypography variant="h6" color="grey">
                                        Add New Zones
                                    </MDTypography>
                                    <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" rows="4rem" columns="4rem" mt={-3}>
                                        {zoneID && <Button onClick={handleShowClick}>Show</Button>}
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
                                    <IconButton onClick={() => handleColumnDisable(index)}><BlockIcon /></IconButton>
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
                                        <IconButton onClick={() => handleRowDisable(rowIndex)}><BlockIcon /></IconButton>
                                    </Grid>
                                    {columnHeads.map((_, columnIndex) => (
                                        <Grid key={columnIndex} item sx={{ m: 1 }}>
                                            <Grid>
                                                {disabledColumns.includes(columnIndex) || disabledRows.includes(rowIndex) || disabledSeats.includes(rowIndex * columns + columnIndex) ? (
                                                    <>
                                                        <Grid><IconButton onClick={() => handleSeatDisable(rowIndex, columnIndex)}><ChairIcon style={{ color: 'grey' }} /></IconButton></Grid>
                                                        <TextField
                                                            size='small'
                                                            id={`seat-name-${rowIndex}-${columnIndex}`}
                                                            name='seatName'
                                                            value={editedSeatNames[`${rowIndex}-${columnIndex}`]}
                                                            onChange={(event) => handleSeatNameChange(event, rowIndex, columnIndex)}
                                                            onBlur={() => handleSaveSeatName(rowIndex, columnIndex)}
                                                            disabled
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Grid><IconButton onClick={() => handleSeatDisable(rowIndex, columnIndex)}><ChairIcon style={{ color: 'green' }} /></IconButton></Grid>
                                                        <Grid>
                                                            {seatDetails.find(seatDetail => seatDetail.row === rowIndex + 1 && seatDetail.column === columnIndex + 1) && (
                                                                <TextField
                                                                    size='small'
                                                                    id={`seat-name-${rowIndex}-${columnIndex}`}
                                                                    name='seatName'
                                                                    value={editedSeatNames[`${rowIndex}-${columnIndex}`] || `${rowHeads[rowIndex]}${columnHeads[columnIndex]}`}
                                                                    onChange={(event) => handleSeatNameChange(event, rowIndex, columnIndex)}
                                                                    onBlur={() => handleSaveSeatName(rowIndex, columnIndex)}
                                                                />
                                                            )}
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>

                    </Box>
                    {zoneID && <Button type="submit">Save</Button>}
                </form>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}