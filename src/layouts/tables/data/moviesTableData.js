

/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { supabase } from "pages/supabaseClient";
import { Switch } from "@mui/material";

export default function data() {
    const [movieData, setMovieData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getMovies();
    }, []);

    const getMovies = async () => {
        try {
            const { data, error } = await supabase
                .from('movies')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setMovieData(data);
                console.log(data)
            }

        } catch (error) {
            console.error('Error fetching genres:', error.message);
        }
    };
    // async function deleteMovie(movie) {
    //     try {
    //         const response = await supabase
    //             .from("movies")
    //             .delete()
    //             .eq("id", movie.id);

    //         if (response.error) throw response.error;
    //         window.location.reload();
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // }

    const handleChange = async (movieId, newValue) => {
        try {
            const { error } = await supabase
                .from('movies')
                .update({ isActive: newValue })
                .eq('id', movieId);
            if (error) throw error;

            setMovieData(prevData =>
                prevData.map(movie =>
                    movie.id === movieId ? { ...movie, isActive: newValue } : movie
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const rows = movieData && movieData.length > 0 ? movieData.map((movie) => ({
        movie_name: (
            <MDBox display="flex" onClick={() => openPage(`/movies/view-movie/${movie.id}`)} alignItems="center" lineHeight={1}>
                <MDAvatar src={movie.poster} name={movie.title} size="sm" variant="rounded" />
                <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                    {movie.title}
                </MDTypography>
            </MDBox>
        ),
        release_date: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {movie.release_date}
            </MDTypography>
        ),
        duration: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {movie.duration}
            </MDTypography>
        ),
        trailer_link: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {movie.trailer_link}
            </MDTypography>
        ),
        status: (
            <Switch checked={movie.isActive} onChange={e => handleChange(movie.id, e.target.checked)} />
        ),
        action: (
            <>
                <MDButton onClick={() => openPage(`/movies/view-movie/${movie.id}`)} variant='text' size='medium' color='info'><VisibilityIcon /></MDButton>
                <MDButton onClick={() => openPage(`/movies/edit-movie/${movie.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
            </>
        ),
        action2: (
            <MDButton onClick={() => deleteMovie(movie)} variant='text' size='small' color='info'>delete</MDButton>
        ),
    })) : [{
        movie_name: <MDTypography color='warning' fontWeight='bold'>No movies found</MDTypography>,
        release_date: <MDTypography color='warning' fontWeight='bold'>-</MDTypography>,
        duration: <MDTypography color='warning' fontWeight='bold'>-</MDTypography>,
        trailer_link: <MDTypography color='warning' fontWeight='bold'>-</MDTypography>,
        action: null,
    }];

    return {
        columns: [
            { Header: "Title", accessor: "movie_name", width: "10%", align: "left" },
            { Header: "Release Date", accessor: "release_date", align: "center" },
            { Header: "Duration", accessor: "duration", align: "center" },
            { Header: "Trailer", accessor: "trailer_link", align: "center" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "actions", accessor: "action", align: "center" },
            // { Header: "Delete", accessor: "action2", align: "center" },
        ],
        rows: rows,
    };

}
