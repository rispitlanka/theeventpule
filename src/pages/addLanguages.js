import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Button, Container, TextField, Typography } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from "examples/Footer";
import { supabase } from './supabaseClient';

export default function AddLanguages() {
    const [language, setLanguage] = useState("");
    const navigate = useNavigate();

    const handleAddLanguage = async () => {
        try {
            const { data, error } = await supabase
                .from('languages')
                .insert({ Languages: language });

            if (error) {
                throw error;
            }

            console.log('Language added successfully:', data);
            alert("Language added successfully");
            setLanguage('');
        } catch (error) {
            console.error('Error adding language:', error.message);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h5">Add Language</Typography>
                        <TextField
                            required
                            label="Language"
                            fullWidth
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        />
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleAddLanguage}>Add Language</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </DashboardLayout>
    );
}
