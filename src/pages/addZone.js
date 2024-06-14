import { Box, Button, Card, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material'
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
import { useNavigate, useParams } from 'react-router-dom'
import BlockIcon from '@mui/icons-material/Block';
import { FixedSizeGrid } from 'react-window';
import MDButton from 'components/MDButton'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    let currentZoneId = '';

    useEffect(() => {
        if (columns > 0 && rows > 0 && columnHeads.length > 0 && rowHeads.length > 0) {
            const newSeatDetails = generateSeatDetails();
            setSeatDetails(newSeatDetails);
        }
    }, [columns, rows, columnHeads, rowHeads]);

    useEffect(() => {
        setDisabledColumns([]);
        setDisabledRows([]);
        setDisabledSeats([]);
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
                    zoneId: currentZoneId,
                    screenId: screenId,
                    type: 'enabled',
                };
                seatDetails.push(seatDetail);
            });
        });
        setIsLoading(false);
        return seatDetails;
    };

    const newZone = useFormik({
        initialValues: {
            name: '',
            price: '',
            halfPrice: '',
            screenId: screenId,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const zoneData = {
                    name: values.name,
                    price: values.price,
                    halfPrice: values.halfPrice,
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
                console.log('Data inserted successfully:', data[0].id);
                return (data[0].id);
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
            setIsSubmitting(true);
            try {
                const enabledSeatDetails = seatDetails.filter(seatDetail => seatDetail.type === 'enabled');
                const seatDataArray = enabledSeatDetails.map(seatDetail => ({
                    ...values,
                    seatName: seatDetail.seatName,
                    zoneId: currentZoneId,
                    screenId: seatDetail.screenId,
                    row: seatDetail.row,
                    column: seatDetail.column,
                }));
                await addSeatData(seatDataArray);
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
                setIsSubmitting(false);
            }
            if (error) {
                throw error;
            }
            toast.info('Zone has been successfully created!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            throw new Error('Error inserting data:', error.message);
        }
    };


    const handleShowClick = () => {
        const newColumnHeads = Array.from({ length: columns }, (_, index) => index + 1);
        setColumnHeads(newColumnHeads);

        const newRowHeads = Array.from({ length: rows }, (_, index) => String.fromCharCode(65 + index));
        setRowHeads(newRowHeads);

        setIsLoading(true);
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

    const handleFormsSubmit = async () => {
        try {
            const zoneid = await addZoneData(newZone.values);
            if (zoneid) {
                currentZoneId = zoneid;
                newSeat.submitForm();
            }
        } catch (error) {
            console.error('Error submitting forms:', error.message);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
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
                            </MDBox>
                            <MDBox p={2}>
                                <form onSubmit={newZone.handleSubmit}>
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
                                            label="Full Ticket Price"
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
                                            label="Half Ticket Price"
                                            name="halfPrice"
                                            value={newZone.values.halfPrice}
                                            onChange={newZone.handleChange}
                                            onBlur={newZone.handleBlur}
                                            error={newZone.touched.halfPrice && Boolean(newZone.errors.halfPrice)}
                                            helperText={newZone.touched.halfPrice && newZone.errors.halfPrice} />
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
                                </form>
                                <MDBox ml={-2}><Button onClick={() => handleShowClick()}>Generate Seat Layout</Button></MDBox>
                                <form onSubmit={newSeat.handleSubmit}>
                                    <MDTypography m={1} variant="h6">Seat Layout</MDTypography>
                                    <MDBox m={1} p={3} sx={{ overflowX: 'auto' }}>
                                        {isLoading ?
                                            <Box sx={{ position: 'absolute', top: '50%', left: '50%' }}>
                                                <CircularProgress />
                                            </Box>
                                            :
                                            <FixedSizeGrid
                                                columnCount={columns + 1}
                                                columnWidth={80}
                                                rowCount={rows + 1}
                                                rowHeight={80}
                                                width={1600}
                                                height={400}
                                            >
                                                {({ columnIndex, rowIndex, style }) => {
                                                    const isHeaderRow = rowIndex === 0;
                                                    const isHeaderColumn = columnIndex === 0;

                                                    return (
                                                        <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                                                            {isHeaderRow && isHeaderColumn ? (
                                                                <div></div>
                                                            ) : isHeaderRow ? (
                                                                <Box sx={{ m: 1, display: 'flex', flexDirection: 'column' }}>
                                                                    <TextField
                                                                        sx={{ width: '60px', '& input': { textAlign: 'center' } }}
                                                                        id={`column-head-${columnIndex}`}
                                                                        label={`Col ${columnIndex}`}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={columnHeads[columnIndex - 1]}
                                                                        onChange={(event) => handleColumnHeadChange(columnIndex - 1, event)}
                                                                    />
                                                                    <IconButton onClick={() => handleColumnDisable(columnIndex - 1)}><BlockIcon /></IconButton>
                                                                </Box>
                                                            ) : isHeaderColumn ? (
                                                                <>
                                                                    <TextField
                                                                        sx={{ width: '55px', '& input': { textAlign: 'center' } }}
                                                                        id={`row-head-${rowIndex}`}
                                                                        label={`Row ${rowIndex}`}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={rowHeads[rowIndex - 1]}
                                                                        onChange={(event) => handleRowHeadChange(rowIndex - 1, event)}
                                                                    />
                                                                    <IconButton onClick={() => handleRowDisable(rowIndex - 1)}><BlockIcon /></IconButton>
                                                                </>
                                                            ) : (
                                                                <Grid container alignItems="center" justifyContent="center" m={1}>
                                                                    {disabledColumns.includes(columnIndex - 1) || disabledRows.includes(rowIndex - 1) || disabledSeats.includes((rowIndex - 1) * columns + (columnIndex - 1)) ? (
                                                                        <>
                                                                            <IconButton onClick={() => handleSeatDisable(rowIndex - 1, columnIndex - 1)}><ChairIcon style={{ color: 'grey', mt: 3 }} /></IconButton>
                                                                            <TextField
                                                                                sx={{ mt: -1 }}
                                                                                size='small'
                                                                                id={`seat-name-${rowIndex - 1}-${columnIndex - 1}`}
                                                                                name='seatName'
                                                                                value={editedSeatNames[`${rowIndex - 1}-${columnIndex - 1}`]}
                                                                                onChange={(event) => handleSeatNameChange(event, rowIndex - 1, columnIndex - 1)}
                                                                                onBlur={() => handleSaveSeatName(rowIndex - 1, columnIndex - 1)}
                                                                                disabled
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <IconButton onClick={() => handleSeatDisable(rowIndex - 1, columnIndex - 1)}><ChairIcon style={{ color: 'green' }} /></IconButton>
                                                                            {seatDetails.find(seatDetail => seatDetail.row === rowIndex && seatDetail.column === columnIndex) && (
                                                                                <TextField
                                                                                    sx={{
                                                                                        mt: -1,
                                                                                        '& input': {
                                                                                            textAlign: 'center',
                                                                                        }
                                                                                    }}
                                                                                    size='small'
                                                                                    id={`seat-name-${rowIndex - 1}-${columnIndex - 1}`}
                                                                                    name='seatName'
                                                                                    value={editedSeatNames[`${rowIndex - 1}-${columnIndex - 1}`] || `${rowHeads[rowIndex - 1]}${columnHeads[columnIndex - 1]}`}
                                                                                    onChange={(event) => handleSeatNameChange(event, rowIndex - 1, columnIndex - 1)}
                                                                                    onBlur={() => handleSaveSeatName(rowIndex - 1, columnIndex - 1)}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </Grid>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            </FixedSizeGrid>
                                        }
                                    </MDBox>
                                </form>
                                <MDBox p={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MDButton color='info' onClick={handleFormsSubmit} disabled={seatDetails.length <= 0}>Save</MDButton>
                                    {isSubmitting && <CircularProgress color='info' sx={{ marginLeft: '15px' }} />}
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
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
    )
}