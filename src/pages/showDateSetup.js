import React, { useEffect, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MDBox from 'components/MDBox'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MDTypography from 'components/MDTypography';
import { supabase } from "pages/supabaseClient";
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';

export default function ShowDateSetup({ screenId, movieId }) {
    const [showTimeData, setShowTimeData] = useState(null);
    const [movieData, setMovieData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [showsData, setShowsData] = useState([]);

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
        console.log(date)
        setStartDate(date);
    }

    const handleEndDateChange = (date) => {
        setEndDate(date);
    }

    useEffect(() => {
        fetchShowTimeData();
        fetchMovieData();
    }, [screenId]);

    useEffect(() => {
        if (startDate && endDate && showTimeData) {
            const dates = {};
            const start = new Date(startDate);
            const end = new Date(endDate);

            while (start <= end) {
                const formattedDate = start.toLocaleDateString('en-US');
                dates[formattedDate] = showTimeData.map(item => ({ name: item.name, time: item.time }));
                start.setDate(start.getDate() + 1);
            }
            setShowsData(dates);
        }
    }, [startDate, endDate, showTimeData]);

    const handleSaveShows = async ()=>{
        try {
            const { data, error } = await supabase.from('shows').insert().select('*');
            if (data) {
                console.log(data);
            }
            if (error) throw error;
        } catch (error) {
            console.log('Error in saving data', error);
        }
    };


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
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <FormControlLabel sx={{ ml: 1 }} control={<Checkbox />} label="Do not set end date" />
                    </Grid>
                </MDBox>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Show Times</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(showsData).map(date => (
                            <TableRow key={date}>
                                <TableCell>{date}</TableCell>
                                <TableCell>
                                    {showsData[date].map((show, index) => (
                                        <span key={index}>
                                            {show.name} at {show.time}<br />
                                        </span>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <MDBox m={2}><MDButton onClick={handleSaveShows} disabled color='info'>Save</MDButton></MDBox>
            </TableContainer>
        </>
    )
}

ShowDateSetup.propTypes = {
    screenId: PropTypes.isRequired,
    movieId: PropTypes.isRequired
};