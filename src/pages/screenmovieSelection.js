import { ArrowDropDown } from '@mui/icons-material'
import { Box, Button, Card, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import { UserDataContext } from 'context';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';

export default function ScreenMovieSelection({ onNext, initialScreenId, initialMovieId }) {
  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails && userDetails[0].theatreId;
  const [screensData, setScreensData] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState(initialScreenId);
  const [selectedMovieId, setSelectedMovieId] = useState(initialMovieId);

  const fetchScreensData = async () => {
    try {
      const { data, error } = await supabase.from('screens').select('*').eq('theatreId', userTheatreId);
      if (error) throw error;
      if (data) {
        setScreensData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoviesData = async () => {
    try {
      const { data, error } = await supabase.from('movies').select('*');
      if (error) throw error;
      if (data) {
        setMoviesData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchScreensData();
    fetchMoviesData();
    selectedMovieId
    selectedScreenId
  }, [])

  const handleNext = () => {
    onNext(selectedScreenId, selectedMovieId);
  };

  return (

    <Box m={6}>
      <Typography pb={2} variant="h6" gutterBottom>Select Movie & Screen</Typography>
      <FormControl fullWidth mb={3}>
        <InputLabel>Select Screen</InputLabel>
        <Select
          label="Select Screen"
          value={selectedScreenId}
          onChange={(e) => setSelectedScreenId(e.target.value)}
          sx={{ height: '45px', mb: 3 }}
        >
          {screensData.map((screen) => (
            <MenuItem key={screen.id} value={screen.id}>
              {screen.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Select Movie</InputLabel>
        <Select
          label="Select Movie"
          value={selectedMovieId}
          onChange={(e) => setSelectedMovieId(e.target.value)}
          sx={{ height: '45px' }}>
          {moviesData.map((movie) => (
            <MenuItem key={movie.id} value={movie.id}>
              {movie.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MDBox mt={3} mb={-3}><MDButton color='info' onClick={handleNext}>Next</MDButton></MDBox>
    </Box>

  )
}

ScreenMovieSelection.propTypes = {
  onNext: PropTypes.isRequired,
  initialMovieId: PropTypes.isRequired,
  initialScreenId: PropTypes.isRequired
}