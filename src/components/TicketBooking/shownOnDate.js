import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { supabase } from 'pages/supabaseClient'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

export default function ShowsOnDate(date) {
    const eqDate = date.date;
    console.log('eqdate', eqDate)
    const [shows, setShows] = useState();
    const [movies, setMovies] = useState();
    const [screens, setScreens] = useState();
    const [showTime, setShowTime] = useState();

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

    return (
        <>
            <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    Show Details
                </MDTypography>
                {shows && shows.length > 0 ? (
                    shows.map((show) => {
                        const movie = movies && movies.length > 0 && movies.find((movie) => movie.id === show.movieId);
                        const screen = screens && screens.length > 0 && screens.find((screen) => screen.id === show.screenId);
                        const times = showTime && showTime.length > 0 && showTime.filter((time) => time.screenId === show.screenId);
                        return (
                            <MDBox key={show.id}>
                                <MDTypography>{movie ? movie.title : 'Unknown Movie'}</MDTypography>
                                <MDTypography>{screen ? screen.name : 'Unknown Screen'}</MDTypography>
                                {times && times.length > 0 ? (
                                    times.map((time) => (
                                        <MDTypography key={time.id}>{time.time}</MDTypography>
                                    ))
                                ) : (
                                    <MDTypography>No show times available</MDTypography>
                                )}
                            </MDBox>
                        );
                    })
                ) : (
                    <MDTypography>No Shows Available</MDTypography>
                )}
            </MDBox>
        </>
    )
}
ShowsOnDate.prototype = {
    date: PropTypes.isRequired,
};
