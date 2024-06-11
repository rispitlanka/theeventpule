import MDTypography from 'components/MDTypography'
import { supabase } from 'pages/supabaseClient'
import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Chip, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DataNotFound from 'components/NoData/dataNotFound';
import MDBox from 'components/MDBox';
import noDataImage from "assets/images/illustrations/noData3.svg";
import { UserDataContext } from 'context';

export default function ShowsOnDate(date) {
    const eqDate = date.date;
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState();
    const [screens, setScreens] = useState();
    const [showTime, setShowTime] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [bookedSeatsCount, setBookedSeatsCount] = useState({});
    const [totalSeatsCount, setTotalSeatsCount] = useState({});
    const userDetails = useContext(UserDataContext);
    const userTheatreId = userDetails[0].theatreId;

    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchShowsOnDate = async () => {
        try {
            const { data, error } = await supabase.from('shows').select('*').eq('date', eqDate).eq('theatreId', userTheatreId);
            if (data) {
                setShows(data);
                console.log('shows', data);
                setIsLoading(false);
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

    const handleChipClick = (show, screen, movie) => {
        openPage(`/bookings/book-seats/${show.id}/${screen.id}?date=${show.date}&movieId=${movie.id}`);
    }

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('en-US', options);
    };

    const fetchBookedSeatsCount = async (showId) => {
        try {
            const { data, error } = await supabase
                .rpc('get_booked_seats_count', { show_id: showId });
            if (data) {
                const bookedSeatsCount = data[0].booked_seats_count;
                setBookedSeatsCount(prevCounts => ({ ...prevCounts, [showId]: bookedSeatsCount }));
            }
            if (error) {
                console.log(error);
                return 0;
            }
        } catch (error) {
            console.log('Error in fetching booked tickets', error);
            return 0;
        }
    };

    const fetchTotalSeatsCount = async (screenId) => {
        try {
            const { data, error } = await supabase
                .rpc('get_all_seats_count', { screen_id: screenId });
            if (data) {
                const totalSeatsCount = data[0].seats_count;
                setTotalSeatsCount(prevCounts => ({ ...prevCounts, [screenId]: totalSeatsCount }));
            }
            if (error) {
                console.log(error);
                return 0;
            }
        } catch (error) {
            console.log('Error in fetching seats count', error);
            return 0;
        }
    };

    useEffect(() => {
        shows.forEach(show => {
            fetchBookedSeatsCount(show.id);
            fetchTotalSeatsCount(show.screenId);
        });
    }, [shows]);

    return (
        <>
            {isLoading ? (
                <MDBox p={3} display="flex" justifyContent="center">
                    <CircularProgress color="info" />
                </MDBox>
            ) : shows && shows.length > 0 ? (
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
                                        {Object.values(
                                            movieShows.reduce((group, show) => {
                                                if (!group[show.screenId]) {
                                                    group[show.screenId] = [];
                                                }
                                                group[show.screenId].push(show);
                                                return group;
                                            }, {})
                                        ).map((screenShows) => {
                                            const screenId = screenShows[0].screenId;
                                            const screen = screens && screens.length > 0 && screens.find((screen) => screen.id === screenId);
                                            const times = showTime && showTime.length > 0 && showTime.filter((time) => screenShows.some(sched => sched.showTimeId === time.id && time.screenId === screenId));

                                            return (
                                                <Box key={screenId} mt={2}>
                                                    <MDTypography variant="h6" gutterBottom>
                                                        {screen ? screen.name : 'Unknown Screen'}
                                                    </MDTypography>
                                                    {times && times.length > 0 ? (
                                                        <Box>
                                                            {times.map((time, index) => {
                                                                const show = screenShows.find(sched => sched.showTimeId === time.id);
                                                                const showId = show?.id;
                                                                const bookedCount = bookedSeatsCount[showId] || 0;
                                                                const totalCount = totalSeatsCount[screenId] || 0;
                                                                const isFull = bookedCount >= totalCount;
                                                                return (
                                                                    <Chip
                                                                        key={index}
                                                                        variant="outlined"
                                                                        label={`${formattedTime(time.time)} (${bookedCount}/${totalCount})`}
                                                                        onClick={() => handleChipClick(show, screen, movie)}
                                                                        sx={{ mr: 1, bgcolor: isFull ? '#e0e0e0' : 'default' }}
                                                                        disabled={isFull}
                                                                    />
                                                                );
                                                            })}
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
                <>
                    <DataNotFound message={'No Shows Scheduled !'} image={noDataImage} />
                </>
            )}
        </>
    )
}

ShowsOnDate.propTypes = {
    date: PropTypes.isRequired,
};
