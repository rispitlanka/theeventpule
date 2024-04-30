import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Button, TextField, FormControl, Autocomplete } from '@mui/material';
import {

    FormControlLabel,
    FormGroup,
    Checkbox,
    FormLabel,
    FormHelperText,
    InputLabel,
    Select,
} from "@mui/material";
import { supabase } from './supabaseClient';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDSnackbar from 'components/MDSnackbar';
import { CircularProgress } from '@mui/material';

export default function EditMovies() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();


    const [languagesData, setLanguagesData] = useState([]);
    const [castData, setCastData] = useState([]);
    const [crewData, setCrewData] = useState([]);
    const [projectionTypeData, setProjectionTypeData] = useState([]);
    const [soundSystemData, setSoundSystemData] = useState([]);
    const [censorData, setCensorData] = useState([]);
    const [selectedCast, setSelectedCast] = useState([]);
    const [selectedCrew, setSelectedCrew] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedProjectionTypes, setSelectedProjectionTypes] = useState([]);
    const [selectedSoundSystems, setSelectedSoundSystems] = useState([]);
    const [selectedCensorTypes, setSelectedCensorTypes] = useState([]);

    const [genreOptions, setGenreOptions] = useState([]);
    const [movieData, setMovieData] = useState(null);

    // Add loading state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getMovies();
        getGenres();
        getCasts();
        getCrews();
        getLanguages();
        getProjectionTypes();
        getSoundSystem();
        getCensorTypes();

    }, [id]);

    const getMovies = async () => {
        try {
            const { data, error } = await supabase
                .from("movies")
                .select(`*,movie_language(*,language_id(*)), movie_genre(*,genre_id(*)),movie_cast(*,cast_id(*)),movie_crew(*,crew_id(*)),movie_sound(*,sound_id(*)),movie_projection(*,projection_id(*)),movie_censor(*,censor_id(*))`)
                .eq("id", id)
                .single();

            if (error) throw error;
            if (data != null) {
                setIsLoading(false);
                editMovie.setValues({
                    title: data.title,
                    release_date: data.release_date,
                    duration: data.duration,
                    trailer_link: data.trailer_link,
                });
                setMovieData(data);
                // Extracting genres from data.movie_genre
                const genres = data.movie_genre.map(genre => ({
                    value: genre.genre_id.genre_name, label: genre.genre_id.genre_name, id: genre.genre_id.id
                }));
                const casts = data.movie_cast.map(cast => ({
                    value: cast.cast_id.name, label: cast.cast_id.name, id: cast.cast_id.id
                }));
                const crews = data.movie_crew.map(crew => ({
                    value: crew.crew_id.name, label: crew.crew_id.name, id: crew.crew_id.id
                }));

                const lang = data.movie_language.map(lang => (
                    lang.language_id.id

                ));

                const projection = data.movie_projection.map(proj => (
                    proj.projection_id.id

                ));
                const sound = data.movie_sound.map(sound => (
                    sound.sound_id.id

                ));
                const censor = data.movie_censor.map(censor => (
                    censor.censor_id.id

                ));


                setSelectedGenres(genres);
                setSelectedCast(casts)
                setSelectedCrew(crews)
                setSelectedLanguages(lang);
                setSelectedProjectionTypes(projection);
                setSelectedSoundSystems(sound)
                setSelectedCensorTypes(censor);


                console.log(data, genres);

            }
        } catch (error) {
            console.error("Error fetching Movies:", error.message);
        }
    };




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

                )

            }
        } catch (error) {
            console.error("Error fetching censor types:", error.message);
        }
    };

    const editMovie = useFormik({
        initialValues: {
            title: '',
            release_date: '',
            duration: '',
            trailer_link: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Required'),
            release_date: Yup.string()
                .required('Release date is required')
                .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Invalid date format. Use DD/MM/YYYY format'),
            duration: Yup.string()
                .required('Movie duration is required')
                .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Duration must be in the format HH:MM'),
            trailer_link: Yup.string(),

        }),
        onSubmit: async (values, { resetForm }) => {
            await saveDataToSupabase(id, values);
            setSnackbarOpen(true);
            setSnackbarType('success');
            resetForm();
            navigateWithDelay();
        },
    });

    const saveDataToSupabase = async (id, newData) => {
        try {
            const { data, error } = await supabase
                .from('movies')
                .update(newData)
                .eq('id', id)
                .select('*')

            if (error) {
                throw error;
            }
            // Update genres for the movie
            const existingGenresResponse = await supabase
                .from('movie_genre')
                .delete()
                .eq('movie_id', id);

            if (existingGenresResponse.error) {
                throw existingGenresResponse.error;
            }

            // Insert new genre entries
            for (const genre of selectedGenres) {
                try {
                    const response = await supabase
                        .from("movie_genre")
                        .insert({ movie_id: id, genre_id: genre.id });

                    if (response.error) {
                        throw response.error;
                    } else {
                        console.log("Movie and genre connected successfully:", response.data);
                    }
                } catch (error) {
                    console.error("Error connecting movie and genre:", error.message);
                }
            }


            // Update casts for the movie
            const existingCastsResponse = await supabase
                .from('movie_cast')
                .delete()
                .eq('movie_id', id);

            if (existingCastsResponse.error) {
                throw existingCastsResponse.error;
            }

            // Insert new cast entries
            for (const cast of selectedCast) {
                try {
                    const response = await supabase
                        .from("movie_cast")

                        .insert({ movie_id: id, cast_id: cast.id });

                    if (response.error) {
                        throw response.error;
                    } else {
                        console.log("Movie and cast table updated successfully:", response.data);
                    }
                } catch (error) {
                    console.error("Error updating movie and cast table:", error.message);
                }
            }

            // Update crews for the movie
            const existingCrewsResponse = await supabase
                .from('movie_crew')
                .delete()
                .eq('movie_id', id);

            if (existingCrewsResponse.error) {
                throw existingCrewsResponse.error;
            }

            // Insert new crew entries
            for (const crew of selectedCrew) {
                try {
                    const response = await supabase
                        .from("movie_crew")

                        .insert({ movie_id: id, crew_id: crew.id });

                    if (response.error) {
                        throw response.error;
                    } else {
                        console.log("Movie and crew table updated successfully:", response.data);
                    }
                } catch (error) {
                    console.error("Error updating movie and crew table:", error.message);
                }
            }


            // Update languages for the movie
            const existingLanguagesResponse = await supabase
                .from('movie_language')
                .delete()
                .eq('movie_id', id);

            if (existingLanguagesResponse.error) {
                throw existingLanguagesResponse.error;
            }

            // Insert new language entries
            for (const lang of selectedLanguages) {
                try {
                    const response = await supabase
                        .from("movie_language")
                        .insert({ movie_id: id, language_id: lang });

                    if (response.error) {
                        throw response.error;
                    } else {
                        console.log("Movie and language connected successfully:", response.data);
                    }
                } catch (error) {
                    console.error("Error connecting movie and language:", error.message);
                }
            }

            // Update projection types for the movie
            const existingProjectionResponse = await supabase
                .from('movie_projection')
                .delete()
                .eq('movie_id', id);

            if (existingProjectionResponse.error) {
                throw existingProjectionResponse.error;
            }

            // Insert new projection type entries
            for (const proj of selectedProjectionTypes) {
                try {
                    const response = await supabase
                        .from("movie_projection")
                        .insert({ movie_id: id, projection_id: proj });

                    if (response.error) {
                        throw response.error;
                    } else {
                        console.log("Movie and projection types updated successfully:", response.data);
                    }
                } catch (error) {
                    console.error("Error updatingting movie and projection types:", error.message);
                }
            }



            // Update sound system types for the movie
            const existingSoundResponse = await supabase
                .from('movie_sound')
                .delete()
                .eq('movie_id', id);

            if (existingSoundResponse.error) {
                throw existingSoundResponse.error;
            }

            // Insert new sound system type entries
            for (const sound of selectedSoundSystems) {
                try {
                    const response = await supabase
                        .from("movie_sound")
                        .insert({ movie_id: id, sound_id: sound });

                    if (response.error) {
                        throw response.error;
                    } else {
                        console.log("Movie and sound systems types updated successfully:", response.data);
                    }
                } catch (error) {
                    console.error("Error updatingting movie and sound systems types:", error.message);
                }
            }

            // Update censor type for the movie
            const existingCensorTypesResponse = await supabase
                .from('movie_censor')
                .delete()
                .eq('movie_id', id);

            if (existingCensorTypesResponse.error) {
                throw existingCensorTypesResponse.error;
            }

            // Insert new censor type entries
            for (const censor of selectedCensorTypes) {
                try {
                    const response = await supabase
                        .from("movie_censor")
                        .insert({ movie_id: id, censor_id: censor });

                    if (response.error) {
                        throw response.error;
                    } else {
                        console.log("Movie and censor type updated successfully:", response.data);
                    }
                } catch (error) {
                    console.error("Error updating movie and censor type:", error.message);
                }
            }


            console.log('Data updated successfully:', data);
        } catch (error) {
            console.error('Error updating data:', error.message);
        }
    };

    const navigateWithDelay = () => {
        setTimeout(() => {
            navigate(-1);
        }, 1500);
    };

    const isOptionEqualToValue = (option, value) => {
        // Compare based on the id property
        return option.value === value.value;
    };

    const handleLanguageChange = (event) => {

        const { checked, value } = event.target;
        if (checked) {

            setSelectedLanguages((prevParams) => [...prevParams, value]);
        } else {

            const val = selectedLanguages.filter((item) => item != value);
            setSelectedLanguages(val);
        }
    };

    const handleProjectionChange = (event) => {

        const { checked, value } = event.target;
        if (checked) {

            setSelectedProjectionTypes((prevParams) => [...prevParams, value]);
        } else {

            const val = selectedProjectionTypes.filter((item) => item != value);
            setSelectedProjectionTypes(val);
        }
    };
    const handleSoundTypeChange = (event) => {

        const { checked, value } = event.target;
        if (checked) {

            setSelectedSoundSystems((prevParams) => [...prevParams, value]);
        } else {

            const val = selectedSoundSystems.filter((item) => item != value);
            setSelectedSoundSystems(val);
        }
    };

    const handleCensorTypeChange = (event) => {
        const { checked, value } = event.target;
        const censorId = parseInt(value); // Convert value to a number
        if (checked) {
            setSelectedCensorTypes((prevParams) => [...prevParams, censorId]);
        } else {
            const val = selectedCensorTypes.filter((item) => item !== censorId);
            setSelectedCensorTypes(val);
        }
    };


    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            {isLoading ? (
                <CircularProgress /> // Render loading animation while data is being fetched
            ) :
                (<MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <form onSubmit={editMovie.handleSubmit}>
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
                                            Manage Movies
                                        </MDTypography>

                                    </MDBox>
                                    <MDBox p={2}>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="title"
                                                label="Title"
                                                name="title"
                                                value={editMovie.values.title}
                                                onChange={editMovie.handleChange}
                                                onBlur={editMovie.handleBlur}
                                                error={editMovie.touched.title && Boolean(editMovie.errors.title)}
                                                helperText={editMovie.touched.title && editMovie.errors.title} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="release_date"
                                                label="Release Date"
                                                name="release_date"
                                                value={editMovie.values.release_date}
                                                onChange={editMovie.handleChange}
                                                onBlur={editMovie.handleBlur}
                                                error={editMovie.touched.release_date && Boolean(editMovie.errors.release_date)}
                                                helperText={editMovie.touched.release_date && editMovie.errors.release_date} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="duration"
                                                label="Movie Duratiom"
                                                name="duration"
                                                value={editMovie.values.duration}
                                                onChange={editMovie.handleChange}
                                                onBlur={editMovie.handleBlur}
                                                error={editMovie.touched.duration && Boolean(editMovie.errors.duration)}
                                                helperText={editMovie.touched.duration && editMovie.errors.duration} />
                                        </MDBox>
                                        <MDBox p={1}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="trailer_link"
                                                label="Trailer Link"
                                                name="trailer_link"
                                                value={editMovie.values.trailer_link}
                                                onChange={editMovie.handleChange}
                                                onBlur={editMovie.handleBlur}
                                                error={editMovie.touched.trailer_link && Boolean(editMovie.errors.trailer_link)}
                                                helperText={editMovie.touched.trailer_link && editMovie.errors.trailer_link} />
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
                                                        console.log("Selected genres:", newValue);
                                                    }}
                                                    // getOptionSelected={(option, value) => option.id === value.id} 
                                                    getOptionLabel={(option) => option.label}
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
                                                    getOptionLabel={(option) => option.label}
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
                                                    getOptionLabel={(option) => option.label}
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
                                            <Button
                                                fullWidth
                                                type='submit'
                                                variant="contained"
                                                color="primary"
                                            >
                                                <span style={{ color: 'white' }}>Update</span>
                                            </Button>
                                        </MDBox>


                                    </MDBox>
                                </Card>
                            </form>
                        </Grid>
                    </Grid>
                </MDBox>)}
            <Footer />
            <MDSnackbar
                color={snackbarType}
                icon={snackbarType === 'success' ? 'check' : 'warning'}
                title={snackbarType === 'success' ? 'Success' : 'Error'}
                content={snackbarType === 'success' ? 'Movie has been edited successfully!' : 'Failed to edit movie!'}
                open={snackbarOpen}
                close={handleCloseSnackbar}
                time={2500}
                bgWhite
            />
        </DashboardLayout>
    );
}
