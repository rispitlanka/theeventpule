import React, { useContext, useEffect, useState } from 'react'
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
import { UserDataContext } from 'context';
import MDTypography from 'components/MDTypography';

export default function ShowDateSetup({ screenId, movieId, afterShowsSaved }) {
    const userDetails = useContext(UserDataContext);
    const userTheatreId = userDetails[0].theatreId;
    const [showTimeData, setShowTimeData] = useState(null);
    const [movieData, setMovieData] = useState();
    const [screenData, setScreenData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [showsData, setShowsData] = useState([]);
    const [checked, setChecked] = useState(false);
    const [fetchedShowsData, setFetchedShowsData] = useState();
    const [disabledColumns, setDisabledColumns] = useState([]);
    const [openEditDialogBox, setOpenEditDialogBox] = useState();
    const [selectedShowsData, setSelectedShowsData] = useState();
    const [fetchedShowTimes, setfetchedShowTimes] = useState([]);

    const fetchScreenData = async () => {
        try {
            const { data, error } = await supabase.from('screens').select('*').eq('id', screenId);
            if (data) {
                setScreenData(data);
                console.log('screenData', data)
            }
            if (error) throw error;
        } catch (error) {
            console.log('Error in fetching data', error);
        }
    };

    const fetchShowTimeData = async () => {
        try {
            const { data, error } = await supabase.from('showTime').select('*').eq('screenId', screenId);
            if (data) {
                setShowTimeData(data);
                console.log(data)
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
                console.log('movieData', data)
            }
            if (error) throw error;
        } catch (error) {
            console.log('Error in fetching data', error);
        }
    };

    const fetchShowsData = async () => {
        try {
            const { data: fetchedShows, error } = await supabase.from('shows').select('*').eq('screenId', screenId);
            if (error) {
                console.log(error)
            };
            setFetchedShowsData(fetchedShows);
            console.log('fetched Shows', fetchedShows)
            const showIds = fetchedShows.map(show => show.id)

            const { data: showsScheduleData, error: showsScheduleError } = await supabase
                .from('showsSchedule')
                .select('*')
                .in('showId', showIds);
            if (showsScheduleError) {
                console.log(showsScheduleError);
                return;
            }

            const showTimeIds = showsScheduleData.map(schedule => schedule.showTimeId);

            const { data: showTimesData, error: showTimesError } = await supabase
                .from('showTime')
                .select('*')
                .in('id', showTimeIds);

            if (showTimesData) {
                setfetchedShowTimes(showTimesData);
                console.log('fetched show times', showTimesData)
            }

            if (showTimesError) {
                console.log(showTimesError);
                return;
            }

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
        fetchScreenData();
        fetchShowTimeData();
        fetchMovieData();
        fetchShowsData();
    }, [screenId, movieId]);

    const existingDates = fetchedShowsData && fetchedShowsData.map(show => show.date);
    const existingShowTimes = fetchedShowTimes && fetchedShowTimes.map(show => show.time);
    console.log('existingDates', existingDates)

    useEffect(() => {
        if (startDate && endDate !== null && showTimeData) {
            const dates = {};
            const start = new Date(startDate);
            const end = new Date(endDate);

            while (start <= end) {
                const formattedDate = start.toLocaleDateString('en-CA');
                dates[formattedDate] = showTimeData.map(item => {
                    if (existingDates.includes(formattedDate) && existingShowTimes.includes(item.time)) {
                        return { name: '', time: '' };
                    } else {
                        return { name: item.name, time: item.time, screenId: item.screenId };
                    }
                });
                start.setDate(start.getDate() + 1);
            }
            setShowsData(dates);

        } else if (startDate && checked && showTimeData) {
            const dates = {};
            const start = new Date(startDate);
            const currentDate = new Date();

            while (start >= currentDate) {
                const formattedDate = start.toLocaleDateString('en-CA');
                dates[formattedDate] = showTimeData.map(item => {
                    if (existingDates.includes(formattedDate) && existingShowTimes.includes(item.time)) {
                        return { name: '', time: '' };
                    } else {
                        return { name: item.name, time: item.time, screenId: item.screenId };
                    }
                });
                start.setDate(start.getDate() + 1);
                break;
            }
            setShowsData(dates);
        }
    }, [startDate, endDate, showTimeData, checked]);

    console.log('showsData', showsData);

    const handleSaveShows = async () => {
        try {
            const datesToSave = Object.keys(showsData).filter(date => {
                // return !existingDates.includes(date);
                if (existingDates.includes(date)) {
                    return !(fetchedShowsData && fetchedShowsData.length > 0 && fetchedShowsData.some(show => show.movieId === movieId));
                } else {
                    return true;
                }
            });
            const dataToInsert = datesToSave.map(date => ({
                date: date,
                movieId: movieId,
                screenId: screenId,
                theatreId: userTheatreId,
            }));

            const { data: showsDataResponse, error: showsDataError } = await supabase.from('shows').insert(dataToInsert).select('*');
            if (showsDataResponse) {
                console.log('Shows data saved successfully:', showsDataResponse);
                let showScheduleDataToInsert = [];
                if (selectedShowsData) {
                    for (const date in showsData) {
                        const specialShows = showsData[date].filter(show => show.type === 'special');
                        const dataToInsert = specialShows && specialShows.map(show => ({
                            name: show.name,
                            time: show.time,
                            type: show.type,
                            screenId: show.screenId
                        }));
                        const { data: showTimeResponse, error: showTimeError } = await supabase.from('showTime').insert(dataToInsert).select('*');
                        if (showTimeResponse) {
                            console.log('Show Time added', showTimeResponse);
                            const showTimeIds = showTimeResponse.map(show => show.id);
                            for (const showTimeId of showTimeIds) {
                                const showIndex = Object.keys(showsData).indexOf(date);
                                const timeIndex = showsData[date].findIndex(show => show.time === showTimeResponse.find(res => res.id === showTimeId).time);
                                showScheduleDataToInsert.push({
                                    showId: showsDataResponse[showIndex].id,
                                    showTimeId: showTimeId,
                                });
                            }
                        }

                        if (showTimeError) {
                            throw showTimeError;
                        }
                    }
                }

                const showIds = showsDataResponse && showsDataResponse.length > 0 ? showsDataResponse.map(show => show.id) : fetchedShowsData && fetchedShowsData.length > 0 && fetchedShowsData.filter(show => Object.keys(showsData).includes(show.date)).map(show => show.id);
                const additionalShowScheduleData = showIds.flatMap((showId, showIndex) => {
                    const showTimes = new Set();
                    Object.values(showsData).forEach(dateShows => {
                        dateShows.forEach(show => {
                            if (show.time) {
                                showTimes.add(show.time);
                            }
                        });
                    });
                    const filteredShowTimeData = showTimeData.filter(showTime => showTimes.has(showTime.time));
                    return filteredShowTimeData.map((showTime, timeIndex) => {
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
                showScheduleDataToInsert = showScheduleDataToInsert.concat(additionalShowScheduleData);
                console.log(showScheduleDataToInsert)
                const { data: showScheduleDataResponse, error: showScheduleError } = await supabase.from('showsSchedule').insert(showScheduleDataToInsert).select('*');
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
        selectedShowsData
    }, [openEditDialogBox])

    const updateShowsData = () => {
        if (selectedShowsData && selectedShowsData.date && selectedShowsData.shows) {
            const { date, shows } = selectedShowsData;
            const updatedShowsData = { ...showsData };
            const formattedDate = dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY');
            updatedShowsData[formattedDate] = shows;
            setShowsData(updatedShowsData);
        }
    }

    const maxShowsCount = Math.max(...Object.values(showsData).map(shows => shows.length));

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('en-US', options);
    };

    const formatDate = (time) => {
        return dayjs(time).format('DD/MM/YYYY');
    }

    return (
        <>
            <Grid sx={{ pt: 3, pl: 3 }}>
                <MDTypography variant='body2'>Screen: {screenData && screenData.length > 0 && screenData[0].name}</MDTypography>
                <MDTypography variant='body2'>Movie: {movieData && movieData.length > 0 && movieData[0].title}</MDTypography>
            </Grid>
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
                        {/* <TableBody>
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
                        </TableBody> */}
                        <TableBody>
                            {Object.keys(showsData).map(date => (
                                <TableRow key={date}>
                                    <TableCell sx={{ textAlign: 'center', position: 'relative' }}>{formatDate(date)}
                                        <IconButton onClick={() => handleDialogBox(date)} sx={{ position: 'absolute', top: '47%', transform: 'translateY(-50%)', p: 2 }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    {showsData[date].map((show, index) => (
                                        <TableCell key={`${date}-${index}`} align="center" sx={{ textDecoration: disabledColumns.includes(index) || show.disabled ? 'line-through' : 'none', position: 'relative' }}>
                                            {show.name && show.time ? `${show.name} at ${formattedTime(show.time)}` : 'No shows available'}
                                            {(show.name && show.time) && (
                                                <IconButton onClick={() => handleDisableSingleShow(date, index)} sx={{ position: 'absolute', top: '47%', transform: 'translateY(-50%)', p: 3 }}>
                                                    {show.disabled ? <AddCircleOutlineIcon /> : <RemoveCircleOutlineIcon />}
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    ))}
                                    {/* {!showsData[date].some(show => show.name && show.time) && (
                                        <TableCell align="center">
                                            No shows available
                                        </TableCell>
                                    )} */}
                                </TableRow>
                            ))}
                        </TableBody>
                        <EditShowsModel
                            open={openEditDialogBox}
                            onClose={handleEditDialogClose}
                            showsDataProps={selectedShowsData}
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