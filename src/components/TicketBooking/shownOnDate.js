import MDTypography from 'components/MDTypography'
import { supabase } from 'pages/supabaseClient'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Chip, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ShowsOnDate(date) {
    const eqDate = date.date;
    const [shows, setShows] = useState();
    const [movies, setMovies] = useState();
    const [screens, setScreens] = useState();
    const [showTime, setShowTime] = useState();
    const navigate = useNavigate();

    const fetchShowsOnDate = async () => {
        try {
            const { data, error } = await supabase.from('shows').select('*').eq('date', eqDate);
            if (data) {
                setShows(data);
                console.log('shows', data);
            }
            if (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log('Error in fetching shows', error)
        }
    }

    const fetchMovies = async () => {
        try {
            const { data, error } = await supabase.from('movies').select('*');
            if (data) {
                setMovies(data);
                console.log('movies', data);
            }
            if (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log('Error in fetching shows', error)
        }
    }

    const fetchScreens = async () => {
        try {
            const { data, error } = await supabase.from('screens').select('*');
            if (data) {
                setScreens(data);
                console.log('screens', data);
            }
            if (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log('Error in fetching shows', error)
        }
    }

    const fetchShowTime = async () => {
        try {
            const { data, error } = await supabase.from('showTime').select('*');
            if (data) {
                setShowTime(data);
                console.log('showTime', data);
            }
            if (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log('Error in fetching shows', error)
        }
    }

    useEffect(() => {
        fetchShowsOnDate();
        fetchMovies();
        fetchScreens();
        fetchShowTime();
    }, [eqDate])

    const handleChipClick = () => {
        navigate("/bookings/book-seats");
    }

    return (
        <>
            {shows && shows.length > 0 ? (
                Object.values(
                    shows.reduce((group, show) => {
                        if (!group[show.movieId]) {
                            group[show.movieId] = [];
                        }
                        group[show.movieId].push(show);
                        return group;
                    }, {})
                ).map((movieShows) => {
                    const movieId = movieShows[0].movieId;
                    const movie = movies && movies.length > 0 && movies.find((movie) => movie.id === movieId);

                    return (
                        <Card key={movieId} sx={{ mb: 1 }}>
                            <CardContent>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={2}>
                                        <Box mt={2}>
                                            <MDTypography variant="h4" component="h2" gutterBottom>
                                                {movie ? movie.title : 'Unknown Movie'}
                                            </MDTypography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={10}>
                                        {movieShows.map((show) => {
                                            const screen = screens && screens.length > 0 && screens.find((screen) => screen.id === show.screenId);
                                            const times = showTime && showTime.length > 0 && showTime.filter((time) => time.screenId === show.screenId);
                                            return (
                                                <Box key={show.id} mt={2}>
                                                    <MDTypography variant="h6" gutterBottom>
                                                        {screen ? screen.name : 'Unknown Screen'}
                                                    </MDTypography>
                                                    {times && times.length > 0 ? (
                                                        <Box>
                                                            {times.map((time, index) => (
                                                                <Chip label={time.time} variant="outlined" onClick={handleChipClick} key={index} sx={{ mr: 1 }} />
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <MDTypography>No show times available</MDTypography>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                    );
                })
            ) : (
                <MDTypography>No Shows Available</MDTypography>
            )}
        </>
    )
}
ShowsOnDate.prototype = {
    date: PropTypes.isRequired,
};
