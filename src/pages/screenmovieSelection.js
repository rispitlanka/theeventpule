import { ArrowDropDown } from '@mui/icons-material'
import { Box, Card, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';

export default function ScreenMovieSelection() {
  const [screensData, setScreensData] = useState([]);
  const [moviesData, setMoviesData] = useState([]);

  const fetchScreensData = async () => {
    try {
      const { data, error } = await supabase.from('screens').select('*');
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
  }, [])
  return (

    <Box m={6}>
      <Typography pb={2} variant="h6" gutterBottom>Select Movie & Screen</Typography>
      <FormControl fullWidth mb={3}>
        <InputLabel>Select Screen</InputLabel>
        <Select sx={{ height: '45px', mb: 3 }} InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <ArrowDropDown />
              </IconButton>
            </InputAdornment>
          )
        }}
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
        <Select sx={{ height: '45px' }}>
          {moviesData.map((movie) => (
            <MenuItem key={movie.id} value={movie.id}>
              {movie.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

  )
}
