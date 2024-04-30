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

    const handleStartDateChange = (date) => {
        setStartDate((date));
    }

    const handleEndDateChange = (date) => {
        setEndDate(date);
    }

    useEffect(() => {
        fetchShowTimeData();
        fetchMovieData();
    }, [screenId]);

    useEffect(() => {
        if (startDate && endDate !== null && showTimeData) {
            const dates = {};
            const start = new Date(startDate);
            const end = new Date(endDate);

            while (start < end) {
                const formattedDate = start.toLocaleDateString('en-US');
                dates[formattedDate] = showTimeData.map(item => ({ name: item.name, time: item.time }));
                start.setDate(start.getDate() + 1);
            }
            setShowsData(dates);

        } else if (startDate && checked && showTimeData) {
            const dates = {};
            const start = new Date(startDate);

            while (start >= new Date()) {
                const formattedDate = start.toLocaleDateString('en-US');
                dates[formattedDate] = showTimeData.map(item => ({ name: item.name, time: item.time }));
                start.setDate(start.getDate() + 1);
                break;
            }
            setShowsData(dates);
        }
    }, [startDate, endDate, showTimeData, checked]);

    const handleSaveShows = async () => {
        try {
            const dates = Object.keys(showsData);
            const lastDate = dates.length > 1 ? dates[dates.length - 1] : null;

            const dataToInsert = [];
            Object.entries(showsData).forEach(([date, shows]) => {
                shows.forEach(show => {
                    const startDate = new Date(`${date} UTC`);
                    const endDate = new Date(`${lastDate} UTC`);
                    dataToInsert.push({
                        startDate,
                        endDate,
                        movieId: movieId,
                        screenId: screenId,
                    });
                });
            });

            const { data, error } = await supabase.from('shows').insert(dataToInsert).select('*');
            if (data) {
                console.log('Data saved successfully:', data);   
                setShowsData('');         
            }
            if (error) {
                throw error;
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
                                        <TableCell key={`${date}-${index}`}>
                                            {show.name} at {show.time}
                                        </TableCell>
                                    ))}
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