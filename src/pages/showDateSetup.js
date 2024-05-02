import React, { useEffect, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MDBox from 'components/MDBox'
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { supabase } from "pages/supabaseClient";
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';

export default function ShowDateSetup({ screenId, movieId }) {
    const [showTimeData, setShowTimeData] = useState(null);
    const [movieData, setMovieData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [showsData, setShowsData] = useState([]);
    const [checked, setChecked] = useState(false);
    const [fetchedShowsData, setFetchedShowsData] = useState();

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
                    dates[formattedDate] = showTimeData.map(item => ({ name: item.name, time: item.time }));
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
                    dates[formattedDate] = showTimeData.map(item => ({ name: item.name, time: item.time }));
                }
                start.setDate(start.getDate() + 1);
                break;
            }
            setShowsData(dates);
        }
    }, [startDate, endDate, showTimeData, checked]);

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
                setShowsData('');

                const showIds = showsDataResponse.map(show => show.id);
                const showScheduleDataToInsert = showIds.flatMap(showId =>
                    showTimeData.map(showTime => ({
                        showId: showId,
                        showTimeId: showTime.id,
                    }))
                );

                const { data: showScheduleDataResponse, error: showScheduleError } = await supabase.from('showsShedule').insert(showScheduleDataToInsert).select('*');
                if (showScheduleDataResponse) {
                    console.log('Show schedule data saved successfully:', showScheduleDataResponse);
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

    const maxShowsCount = Math.max(...Object.values(showsData).map(shows => shows.length));

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
                            <TableCell>Date</TableCell>
                            {Array.from({ length: maxShowsCount }, (_, index) => (
                                <TableCell key={index}>Show {index + 1}</TableCell>
                            ))}
                        </TableRow>
                        <TableBody>
                            {Object.keys(showsData).map(date => (
                                <TableRow key={date}>
                                    <TableCell>{date}</TableCell>
                                    {showsData[date].map((show, index) => (
                                        <TableCell key={`${date}-${index}`} align="center">
                                            {show.name && show.time && `${show.name} at ${show.time}`}
                                        </TableCell>
                                    ))}
                                    {!showsData[date].some(show => show.name && show.time) && (
                                        <TableCell align="center" colSpan={maxShowsCount}>
                                            No shows
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <MDBox m={2}><MDButton onClick={handleSaveShows} color='info'>Save</MDButton></MDBox>
                </TableContainer>
            </MDBox>
        </>
    )
}

ShowDateSetup.propTypes = {
    screenId: PropTypes.isRequired,
    movieId: PropTypes.isRequired
};