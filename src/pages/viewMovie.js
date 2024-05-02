import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Button, TextField } from "@mui/material";

import { supabase } from "./supabaseClient";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDSnackbar from "components/MDSnackbar";
import { Category } from "@mui/icons-material";

import burceMars from "assets/images/bruce-mars.jpg";

export default function ViewMovie() {
    const [movieData, setMovieData] = useState(null);

    const { id } = useParams();
    useEffect(() => {
        getMovies();
    }, [id]);

    const getMovies = async () => {
        try {
            const { data, error } = await supabase
                .from("movies")
                .select(`*,movie_language(*,language_id(*)), movie_genre(*,genre_id(*)),movie_cast(*,cast_id(*)),movie_crew(*,crew_id(*)),movie_sound(*,sound_id(*)),movie_projection(*,projection_id(*))`)
                .eq("id", id)
                .single();

            if (error) throw error;
            if (data != null) {
                setMovieData(data);
                console.log(data);
            }
        } catch (error) {
            console.error("Error fetching genres:", error.message);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />

            {movieData && (
                <MDBox pt={6} pb={3}>
                    <Card>
                        <MDBox>

                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    <MDAvatar src={movieData.poster} alt="profile-image" size="xl" shadow="sm" />
                                </Grid>
                                <Grid item>
                                    <MDBox
                                        height="100%"
                                        mt={0.5}
                                        lineHeight={1}
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        <MDTypography variant="h5" fontWeight="medium">
                                            {movieData.title}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            Language:{" "}
                                            {movieData.movie_language.length !== 0 &&
                                                movieData.movie_language.map((lang) => lang.language_id.language_name).join(", ")}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            Genre:  {movieData.movie_genre.length !== 0 &&
                                                movieData.movie_genre.map((genre) => genre.genre_id.genre_name).join(", ")}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            Cast:{movieData.movie_cast.length !== 0 &&
                                                movieData.movie_cast.map((cast) => cast.cast_id.name).join(", ")}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            Crew: {movieData.movie_crew.length !== 0 &&
                                                movieData.movie_crew.map((crew) => crew.crew_id.name).join(", ")}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            Sound system Type: {movieData.movie_sound.length !== 0 &&
                                                movieData.movie_sound.map((sound) => sound.sound_id.soundsystem_type).join(", ")}
                                        </MDTypography>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            Projection Type:{movieData.movie_projection.length !== 0 &&
                                                movieData.movie_projection.map((proj) => proj.projection_id.projection_type).join(", ")}
                                        </MDTypography>
                                    </MDBox>
                                </Grid>

                                <Grid item>
                                    <MDTypography variant="button" color="text" fontWeight="regular"></MDTypography>
                                </Grid>
                            </Grid>

                            {/* </Card> */}
                        </MDBox>
                    </Card>
                </MDBox>
            )}

            <Footer />
        </DashboardLayout>
    );
}
