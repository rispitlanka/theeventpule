import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Button, TextField, Autocomplete } from "@mui/material";

import { supabase } from "./supabaseClient";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";

import {
    FormControl,
    FormControlLabel,
    FormGroup,
    Checkbox,
    FormLabel,
    FormHelperText,
    InputLabel,
    Select,
} from "@mui/material";
import { check } from "prettier";
import { useNavigate } from "react-router-dom";

export default function AddMovies() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState("");
    const [image, setImage] = useState(null);

    // const [genreData, setGenreData] = useState(null);
    const [genreOptions, setGenreOptions] = useState([]);
    const [languagesData, setLanguagesData] = useState([]);
    const [castData, setCastData] = useState([]);
    const [crewData, setCrewData] = useState([]);
    const [projectionTypeData, setProjectionTypeData] = useState([]);
    const [soundSystemData, setSoundSystemData] = useState([]);
    const [censorData, setCensorData] = useState([]);

    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedProjectionTypes, setSelectedProjectionTypes] = useState([]);
    const [selectedSoundSystems, setSelectedSoundSystems] = useState([]);
    const [selectedCensorTypes, setSelectedCensorTypes] = useState([]);



    const [selectedCast, setSelectedCast] = useState([]);
    const [selectedCrew, setSelectedCrew] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getGenres();
        getLanguages();
        getCasts();
        getCrews();
        getProjectionTypes();
        getSoundSystem();
        getCensorTypes();
    }, []);

    const getGenres = async () => {
        try {
            const { data, error } = await supabase.from("genres").select("*");

            if (error) throw error;
            if (data != null) {
                setGenreOptions(
                    data.map((genre) => ({ value: genre.genre_name, label: genre.genre_name, id: genre.id }))
                );
            }
        } catch (error) {
            console.error("Error fetching genres:", error.message);
        }
    };

    const getLanguages = async () => {
        try {
            const { data, error } = await supabase.from("languages").select("*");

            if (error) throw error;
            if (data != null) {
                setLanguagesData(
                    data.map((language) => ({
                        value: language.language_name,
                        label: language.language_name,
                        id: language.id,
                    }))
                );
                console.log(data);
            }
        } catch (error) {
            console.error("Error fetching languages:", error.message);
        }
    };

    const getCasts = async () => {
        try {
            const { data, error } = await supabase.from("cast").select("*");

            if (error) throw error;
            if (data != null) {
                setCastData(data.map((cast) => ({ value: cast.name, label: cast.name, id: cast.id })));
            }
        } catch (error) {
            console.error("Error fetching cast:", error.message);
        }
    };

    const getCrews = async () => {
        try {
            const { data, error } = await supabase.from("crew").select("*");

            if (error) throw error;
            if (data != null) {
                setCrewData(data.map((crew) => ({ value: crew.name, label: crew.name, id: crew.id })));
                console.log(data);
            }
        } catch (error) {
            console.error("Error fetching crew:", error.message);
        }
    };

    const getProjectionTypes = async () => {
        try {
            const { data, error } = await supabase.from("projection_types").select("*");

            if (error) throw error;
            if (data != null) {
                setProjectionTypeData(
                    data.map((projection) => ({
                        value: projection.projection_type,
                        label: projection.projection_type,
                        id: projection.id,
                    }))
                );
                console.log(data);
            }
        } catch (error) {
            console.error("Error fetching projection types:", error.message);
        }
    };

    const getSoundSystem = async () => {
        try {
            const { data, error } = await supabase.from("soundsystem_types").select("*");

            if (error) throw error;
            if (data != null) {
                setSoundSystemData(
                    data.map((sound) => ({
                        value: sound.soundsystem_type,
                        label: sound.soundsystem_type,
                        id: sound.id,
                    }))
                );
                console.log(data);
            }
        } catch (error) {
            console.error("Error fetching sound system types:", error.message);
        }
    };

    const getCensorTypes = async () => {
        try {
            const { data, error } = await supabase.from("censor_types").select("*");

            if (error) throw error;
            if (data != null) {
                setCensorData(
                    data.map((censor) => ({ value: censor.censor_type, label: censor.censor_type, id: censor.id }))
                );
            }
        } catch (error) {
            console.error("Error fetching censor types:", error.message);
        }
    };
    const isOptionEqualToValue = (option, value) => {
        // Compare based on the id property
        return option.value === value.value;
    };


    const navigateWithDelay = () => {
        setTimeout(() => {
            navigate(-1);
        }, 3500);
    };

    const generateUniquePath = (prefix) => {
        const uniqueIdentifier = new Date().getTime(); // You can use a different method to generate a unique identifier
        return `${prefix}/${uniqueIdentifier}`;
    };

    const uploadImage = async (folder, name, image) => {
        const uniquePath = generateUniquePath(name);

        const result = await supabase.storage.from(folder).upload(uniquePath, image, {
            // cacheControl: '1',
            upsert: false,
        });
        if (result.error) {
            console.log("network issue", result.error);
            return null;
        }
        console.log(result);
        return result;
    };

    const newMovie = useFormik({
        initialValues: {
            movie_name: "",
            release_date: "",
            duration: "",
            trailer_link: "",
            synopsis: "",
        },
        validationSchema: Yup.object({
            movie_name: Yup.string().required("Required"),
            release_date: Yup.string().required("Release date is required")
                .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Invalid date format. Use DD/MM/YYYY format'),
            duration: Yup.string().required("Movie duration is required")
                .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Duration must be in the format HH:MM'),
            trailer_link: Yup.string(),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log("check");
            saveMovie(values);
            setSnackbarOpen(true);
            setSnackbarType("success");
            resetForm();
            navigateWithDelay();

        },
    });

    const saveMovie = async (movie) => {
        try {
            const movieImg = await uploadImage("ticket_booking", `movies/tktBooking`, image);
            if (movieImg !== null) {
                const movieImgUrl = await supabase.storage
                    .from("ticket_booking")
                    .getPublicUrl(movieImg.data.path);
                const { data, error } = await supabase
                    .from("movies")
                    .insert({
                        title: movie.movie_name,
                        duration: movie.duration,
                        release_date: movie.release_date,
                        trailer_link: movie.trailer_link,
                        poster: movieImgUrl.data.publicUrl,
                        synopsis:movie.synopsis,
                    })
                    .select("*");

                if (error) {
                    throw error;
                } else {
                    console.log("Movie added successfully:", data);
                    // Insert genres for the movie
                    selectedGenres.map(async (genre) => {
                        try {
                            const response = await supabase
                                .from("movie_genre")
                                .insert({ movie_id: data[0].id, genre_id: genre.id });

                            if (response.error) {
                                throw response.error;
                            } else {
                                console.log("movie and genre connected successfully:", response.data);
                            }
                        } catch (error) {
                            console.error("Error connecting movie and genre:", error.message);
                        }
                    });

                    selectedCast.map(async (cast) => {
                        try {
                            const response = await supabase
                                .from("movie_cast")
                                .insert({ movie_id: data[0].id, cast_id: cast.id })
                                .select("*");

                            if (response.error) {
                                throw response.error;
                            } else {
                                console.log("movie and cast connected successfully:", response.data);
                            }
                        } catch (error) {
                            console.error("Error connecting movie and cast:", error.message);
                        }
                    });

                    selectedCrew.map(async (crew) => {
                        try {
                            const response = await supabase
                                .from("movie_crew")
                                .insert({ movie_id: data[0].id, crew_id: crew.id })
                                .select("*");

                            if (response.error) {
                                throw response.error;
                            } else {
                                console.log("movie and crew connected successfully:", response.data);
                            }
                        } catch (error) {
                            console.error("Error connecting movie and crew:", error.message);
                        }
                    });

                    selectedLanguages.map(async (lang) => {
                        try {
                            const response = await supabase
                                .from("movie_language")
                                .insert({ movie_id: data[0].id, language_id: lang });

                            if (response.error) {
                                throw response.error;
                            } else {
                                console.log("movie and language connected successfully:", response.data);
                            }
                        } catch (error) {
                            console.error("Error connecting movie and language:", error.message);
                        }
                    });

                    selectedProjectionTypes.map(async (proj) => {
                        try {
                            const response = await supabase
                                .from("movie_projection")
                                .insert({ movie_id: data[0].id, projection_id: proj });

                            if (response.error) {
                                throw response.error;
                            } else {
                                console.log("movie and projection type connected successfully:", response.data);
                            }
                        } catch (error) {
                            console.error("Error connecting movie and projection type:", error.message);
                        }
                    });

                    selectedSoundSystems.map(async (sound) => {
                        try {
                            const response = await supabase
                                .from("movie_sound")
                                .insert({ movie_id: data[0].id, sound_id: sound });

                            if (response.error) {
                                throw response.error;
                            } else {
                                console.log("movie and sound system type connected successfully:", response.data);
                            }
                        } catch (error) {
                            console.error("Error connecting movie and sound system type:", error.message);
                        }
                    });

                    selectedCensorTypes.map(async (censor) => {
                        try {
                            const response = await supabase
                                .from("movie_censor")
                                .insert({ movie_id: data[0].id, censor_id: censor.id });

                            if (response.error) {
                                throw response.error;
                            } else {
                                console.log("movie and censor type connected successfully:", response.data);
                            }
                        } catch (error) {
                            console.error("Error connecting movie and censor type:", error.message);
                        }
                    });


                    setSnackbarOpen(true);
                    setSnackbarType("success");
                    setImage(null);
                    setSelectedGenres([]);
                    setSelectedCast([]);
                    setSelectedLanguages([]);
                    setSelectedCrew([]);
                    setSelectedProjectionTypes([]);
                    setSelectedSoundSystems([]);
                    setSelectedCensorTypes([]);
                }
            }
        } catch (error) {
            console.error("Error adding movie:", error.message);
            setSnackbarOpen(true);
            setSnackbarType("error");
        }
    };

    const handleLanguageChange = (event) => {

        const { checked, value } = event.target;
        if (checked) {

            setSelectedLanguages((prevParams) => [...prevParams, value]);
        } else {

            const val = selectedLanguages.filter((item) => item !== value);
            setSelectedLanguages(val);
        }
    };
    const handleProjectionChange = (event) => {

        const { checked, value } = event.target;
        if (checked) {

            setSelectedProjectionTypes((prevParams) => [...prevParams, value]);
        } else {

            const val = selectedProjectionTypes.filter((item) => item !== value);
            setSelectedProjectionTypes(val);
        }
    };
    const handleSoundTypeChange = (event) => {

        const { checked, value } = event.target;
        if (checked) {

            setSelectedSoundSystems((prevParams) => [...prevParams, value]);
        } else {

            const val = selectedSoundSystems.filter((item) => item !== value);
            setSelectedSoundSystems(val);
        }
    };
    const handleCensorTypeChange = (event) => {

        const { checked, value } = event.target;
        if (checked) {

            setSelectedCensorTypes((prevParams) => [...prevParams, value]);
        } else {

            const val = selectedCensorTypes.filter((item) => item !== value);
            setSelectedCensorTypes(val);
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />{" "}
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <form onSubmit={newMovie.handleSubmit}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    pt={1}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Add New Movie
                                    </MDTypography>
                                </MDBox>
                                <MDBox p={2}>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Title"
                                            name="movie_name"
                                            value={newMovie.values.movie_name}
                                            onChange={newMovie.handleChange}
                                            onBlur={newMovie.handleBlur}
                                            error={newMovie.touched.movie_name && Boolean(newMovie.errors.movie_name)}
                                            helperText={newMovie.touched.movie_name && newMovie.errors.movie_name}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Release Date"
                                            name="release_date"
                                            value={newMovie.values.release_date}
                                            onChange={newMovie.handleChange}
                                            onBlur={newMovie.handleBlur}
                                            error={newMovie.touched.release_date && Boolean(newMovie.errors.release_date)}
                                            helperText={newMovie.touched.release_date && newMovie.errors.release_date}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Movie Duratiom"
                                            name="duration"
                                            value={newMovie.values.duration}
                                            onChange={newMovie.handleChange}
                                            onBlur={newMovie.handleBlur}
                                            error={newMovie.touched.duration && Boolean(newMovie.errors.duration)}
                                            helperText={newMovie.touched.duration && newMovie.errors.duration}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Trailer Link"
                                            name="trailer_link"
                                            value={newMovie.values.trailer_link}
                                            onChange={newMovie.handleChange}
                                            onBlur={newMovie.handleBlur}
                                            error={newMovie.touched.trailer_link && Boolean(newMovie.errors.trailer_link)}
                                            helperText={newMovie.touched.trailer_link && newMovie.errors.trailer_link}
                                        />
                                    </MDBox>
                                    <MDBox p={1}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Synopsis"
                                            name="synopsis"
                                            value={newMovie.values.synopsis}
                                            onChange={newMovie.handleChange}
                                            onBlur={newMovie.handleBlur}
                                            error={newMovie.touched.synopsis && Boolean(newMovie.errors.synopsis)}
                                            helperText={newMovie.touched.synopsis && newMovie.errors.synopsis}
                                        />
                                    </MDBox>

                                    <MDBox p={1}>
                                        <input
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            id="image-upload"
                                            type="file"
                                            onChange={(e) => handleFileChange(e)}
                                        />
                                        {image !== null && (
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Selected"
                                                style={{ width: "100px", height: "100px" }}
                                            />
                                        )}
                                        <label htmlFor="image-upload">
                                            <Button variant="contained" component="span">
                                                <span style={{ color: "white" }}>Upload Image</span>
                                            </Button>
                                        </label>
                                    </MDBox>

                                    <MDBox p={2}>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                isOptionEqualToValue={isOptionEqualToValue}
                                                multiple
                                                id="genres"
                                                options={genreOptions}
                                                value={selectedGenres}
                                                onChange={(event, newValue) => {
                                                    setSelectedGenres(newValue);
                                                    console.log("chq");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" label="Genres" />
                                                )}
                                            />
                                        </FormControl>
                                    </MDBox>
                                    <MDBox p={2}>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                isOptionEqualToValue={isOptionEqualToValue}
                                                multiple
                                                id="cast"
                                                options={castData}
                                                value={selectedCast}
                                                onChange={(event, newValue) => {
                                                    setSelectedCast(newValue);
                                                    console.log("chq");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" label="Cast" />
                                                )}
                                            />
                                        </FormControl>
                                    </MDBox>
                                    <MDBox p={2}>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                isOptionEqualToValue={isOptionEqualToValue}
                                                multiple
                                                id="crew"
                                                options={crewData}
                                                value={selectedCrew}
                                                onChange={(event, newValue) => {
                                                    setSelectedCrew(newValue);
                                                    console.log("cheq");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" label="Crew" />
                                                )}
                                            />
                                        </FormControl>
                                    </MDBox>                               
                                    <MDBox p={2}>
                                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                            <FormLabel component="legend"> Languages </FormLabel>
                                            <FormGroup>
                                                {languagesData &&
                                                    languagesData.length !== 0 &&
                                                    languagesData.map((lang, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedLanguages.some((data) => data == lang.id)}
                                                                    onChange={handleLanguageChange}
                                                                    value={lang.id}
                                                                />
                                                            }
                                                            label={<MDTypography variant="body2">{lang.label}</MDTypography>}
                                                        />
                                                    ))}
                                            </FormGroup>
                                            <FormHelperText>Select Languages</FormHelperText>
                                        </FormControl>
                                    </MDBox>


                                    <MDBox p={2}>
                                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                            <FormLabel component="legend">Projection Types</FormLabel>
                                            <FormGroup>
                                                {projectionTypeData &&
                                                    projectionTypeData.length !== 0 &&
                                                    projectionTypeData.map((proj, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedProjectionTypes.some((data) => data == proj.id)}
                                                                    onChange={handleProjectionChange}
                                                                    value={proj.id}
                                                                />
                                                            }
                                                            label={<MDTypography variant="body2">{proj.label}</MDTypography>}
                                                        />
                                                    ))}
                                            </FormGroup>
                                            <FormHelperText>Select Projection Types</FormHelperText>
                                        </FormControl>
                                    </MDBox>

                                    <MDBox p={2}>
                                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                            <FormLabel component="legend">Sound System Types</FormLabel>
                                            <FormGroup>
                                                {soundSystemData &&
                                                    soundSystemData.length !== 0 &&
                                                    soundSystemData.map((sound, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedSoundSystems.some((data) => data == sound.id)}
                                                                    onChange={handleSoundTypeChange}
                                                                    value={sound.id}
                                                                />
                                                            }
                                                            label={<MDTypography variant="body2">{sound.label}</MDTypography>}
                                                        />
                                                    ))}
                                            </FormGroup>
                                            <FormHelperText>Select Sound System  Types</FormHelperText>
                                        </FormControl>
                                    </MDBox>

                                    <MDBox p={2}>
                                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                            <FormLabel component="legend"> Censor Types </FormLabel>
                                            <FormGroup>
                                                {censorData &&
                                                    censorData.length !== 0 &&
                                                    censorData.map((censor, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedCensorTypes.some((data) => data == censor.id)}
                                                                    onChange={handleCensorTypeChange}
                                                                    value={censor.id}
                                                                />
                                                            }
                                                            label={<MDTypography variant="body2">{censor.label}</MDTypography>}
                                                        />
                                                    ))}
                                            </FormGroup>
                                            <FormHelperText>Select Censor Type</FormHelperText>
                                        </FormControl>
                                    </MDBox>

                                    <MDBox mt={-3} p={4}>
                                        <Button fullWidth type="submit" variant="contained" color="primary">
                                            <span style={{ color: "white" }}>Save</span>
                                        </Button>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </form>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
            <MDSnackbar
                color={snackbarType}
                icon={snackbarType === "success" ? "check" : "warning"}
                title={snackbarType === "success" ? "Success" : "Error"}
                content={
                    snackbarType === "success"
                        ? "New movie has been added successfully!"
                        : "Failed to add new movie!"
                }
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    );
}
