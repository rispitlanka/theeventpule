import React, { useEffect, useRef, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MDBox from 'components/MDBox'
import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { supabase } from "pages/supabaseClient";
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import EditShowsModel from './Models/editShowsModel';

export default function ShowDateSetup({ screenId, movieId, afterShowsSaved }) {
    const [showTimeData, setShowTimeData] = useState(null);
    const [movieData, setMovieData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [showsData, setShowsData] = useState([]);
    const [checked, setChecked] = useState(false);
    const [fetchedShowsData, setFetchedShowsData] = useState();
    const [disabledColumns, setDisabledColumns] = useState([]);
    const [openEditDialogBox, setOpenEditDialogBox] = useState();
    const [slectedShowsData, setSelectedShowsData] = useState();

    const fetchShowTimeData = async () => {
        try {
            const { data, error } = await supabase.from('showTime').select('*').eq('screenId', screenId);
            if (data) {
                setShowTimeData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log('Error in fetching data', error);
        }
    };

    const fetchMovieData = async () => {
        try {
            const { data, error } = await supabase.from('movies').select('*').eq('id', movieId);
            if (data) {
                setMovieData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log('Error in fetching data', error);
        }
    };

    const fetchShowsData = async () => {
        try {
            const { data, error } = await supabase.from('shows').select('*');
            if (data) {
                setFetchedShowsData(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log('Error in fetching data', error);
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate((date));
    }

    const handleEndDateChange = (date) => {
        setEndDate(date);
    }

    useEffect(() => {
        fetchShowTimeData();
        fetchMovieData();
        fetchShowsData();
    }, [screenId, movieId]);

    const existingDates = fetchedShowsData && fetchedShowsData.map(show => new Date(show.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }));

    useEffect(() => {
        if (startDate && endDate !== null && showTimeData) {
            const dates = {};
            const start = new Date(startDate);
            const end = new Date(endDate);

            while (start <= end) {
                const formattedDate = start.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                if (existingDates.includes(formattedDate)) {
                    dates[formattedDate] = [{ name: '', time: '' }];
                } else {
                    dates[formattedDate] = showTimeData.map(item => ({ name: item.name, time: item.time, screenId: item.screenId }));
                }
                start.setDate(start.getDate() + 1);
            }
            setShowsData(dates);

        } else if (startDate && checked && showTimeData) {
            const dates = {};
            const start = new Date(startDate);
            const currentDate = new Date();

            while (start >= currentDate) {
                const formattedDate = start.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                if (existingDates.includes(formattedDate)) {
                    dates[formattedDate] = [{ name: '', time: '' }];
                } else {
                    dates[formattedDate] = showTimeData.map(item => ({ name: item.name, time: item.time, screenId: item.screenId }));
                }
                start.setDate(start.getDate() + 1);
                break;
            }
            setShowsData(dates);
        }
    }, [startDate, endDate, showTimeData, checked]);

    const pnewShowTimeFormRef = useRef();
    const handleSubmitChildForm = () => {
        if (pnewShowTimeFormRef.current) {
            console.log('inside if')
            pnewShowTimeFormRef.current.submitForm();
        }
    };

    const handleSaveShows = async () => {
        try {
            const datesToSave = Object.keys(showsData).filter(date => {
                const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                return !existingDates.includes(formattedDate);
            });
            const dataToInsert = datesToSave.map(date => ({
                date: date,
                movieId: movieId,
                screenId: screenId,
            }));

            const { data: showsDataResponse, error: showsDataError } = await supabase.from('shows').insert(dataToInsert).select('*');
            if (showsDataResponse) {
                console.log('Shows data saved successfully:', showsDataResponse);

                const showIds = showsDataResponse.map(show => show.id);
                const showScheduleDataToInsert = showIds.flatMap((showId, showIndex) => {
                    return showTimeData.map((showTime, timeIndex) => {
                        const isDisabled = disabledColumns.includes(timeIndex);
                        const date = Object.keys(showsData)[showIndex];
                        if (!isDisabled && !showsData[date][timeIndex].disabled) {
                            return {
                                showId: showId,
                                showTimeId: showTime.id,
                            };
                        }
                        return null;
                    }).filter(Boolean);
                });

                const { data: showScheduleDataResponse, error: showScheduleError } = await supabase.from('showsShedule').insert(showScheduleDataToInsert).select('*');
                if (showScheduleDataResponse) {
                    console.log('Show schedule data saved successfully:', showScheduleDataResponse);
                    setDisabledColumns([]);
                    if (showsDataResponse && showScheduleDataResponse) {
                        afterShowsSaved();
                    }
                }
                if (showScheduleError) {
                    throw showScheduleError;
                }
            }
            if (showsDataError) {
                throw showsDataError;
            }
            handleSubmitChildForm();
        } catch (error) {
            console.log('Error in saving data:', error.message);
        }
    };

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked) {
            setEndDate(null);
        }
    };

    const handleDisableColumn = (index) => {
        if (disabledColumns.includes(index)) {
            setDisabledColumns(disabledColumns.filter((colIndex) => colIndex !== index));
        } else {
            setDisabledColumns([...disabledColumns, index]);
        }
    }

    const handleDisableSingleShow = (date, index) => {
        const updatedShowsData = { ...showsData };
        const currentShow = updatedShowsData[date][index];
        updatedShowsData[date][index] = { ...currentShow, disabled: !currentShow.disabled };
        setShowsData(updatedShowsData);
    };

    const handleDialogBox = (date) => {
        const selectedData = {
            date: date,
            shows: showsData[date]
        };
        console.log(selectedData);
        setSelectedShowsData(selectedData);
        setOpenEditDialogBox(true);
    }
    const handleEditDialogClose = () => {
        updateShowsData();
        setOpenEditDialogBox(false);
    };

    useEffect(() => {
        slectedShowsData
    }, [openEditDialogBox])

    const updateShowsData = () => {
        if (slectedShowsData && slectedShowsData.date && slectedShowsData.shows) {
            const { date, shows } = slectedShowsData;
            const updatedShowsData = { ...showsData };
            const formattedDate = dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY');
            updatedShowsData[formattedDate] = shows;
            setShowsData(updatedShowsData);
        }
    }

    const maxShowsCount = Math.max(...Object.values(showsData).map(shows => shows.length));

    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        return `${hours}.${minutes}`;
    }

    return (
        <>
            <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                <MDBox p={3} >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Select Start Date"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </MDBox>
                <MDBox p={3}>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Select End Date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    disabled={checked}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <FormControlLabel sx={{ ml: 1 }} control={<Checkbox checked={checked} onChange={handleCheckboxChange} />} label="Do not set end date" />
                    </Grid>
                </MDBox>
            </Grid>
            <MDBox mt={3}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                        </TableHead>
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>Date</TableCell>
                            {Array.from({ length: maxShowsCount }, (_, index) => (
                                <TableCell key={index} sx={{ textAlign: 'center', position: 'relative' }}>
                                    Show {index + 1}
                                    <IconButton onClick={() => handleDisableColumn(index)} sx={{ position: 'absolute', top: '47%', transform: 'translateY(-50%)' }}>
                                        {disabledColumns.includes(index) ? <AddCircleOutlineIcon color='success' /> : <RemoveCircleOutlineIcon color='primary' />}
                                    </IconButton>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableBody>
                            {Object.keys(showsData).map(date => (
                                <TableRow key={date}>
                                    <TableCell sx={{ textAlign: 'center', position: 'relative' }}>{date}
                                        <IconButton onClick={() => handleDialogBox(date)} sx={{ position: 'absolute', top: '47%', transform: 'translateY(-50%)', p: 2 }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    {showsData[date].map((show, index) => (
                                        <TableCell key={`${date}-${index}`} align="center" sx={{ textDecoration: disabledColumns.includes(index) || show.disabled ? 'line-through' : 'none', position: 'relative' }}>
                                            {show.name && show.time && `${show.name} at ${formatTime(show.time)}`}
                                            {(show.name && show.time) && (
                                                <IconButton onClick={() => handleDisableSingleShow(date, index)} sx={{ position: 'absolute', top: '47%', transform: 'translateY(-50%)', p: 3 }}>
                                                    {show.disabled ? <AddCircleOutlineIcon /> : <RemoveCircleOutlineIcon />}
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    ))}
                                    {!showsData[date].some(show => show.name && show.time) && (
                                        <TableCell align="center" colSpan={maxShowsCount}>
                                            No shows available
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                        <EditShowsModel
                            open={openEditDialogBox}
                            onClose={handleEditDialogClose}
                            showsDataProps={slectedShowsData}
                            onUpdateShowsData={setSelectedShowsData}
                            newShowTimeFormRef={pnewShowTimeFormRef}

                        />
                    </Table>
                    <MDBox m={2}><MDButton onClick={handleSaveShows} color='info'>Save</MDButton></MDBox>
                </TableContainer>
            </MDBox>
        </>
    )
}

ShowDateSetup.propTypes = {
    screenId: PropTypes.isRequired,
    movieId: PropTypes.isRequired,
    afterShowsSaved: PropTypes.func.isRequired
};