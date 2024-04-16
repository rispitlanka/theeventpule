import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Typography, Button, TextField } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import { supabase } from './supabaseClient';

export default function Languages() {
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState("");
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getLanguages();
    }, []);

    const getLanguages = async () => {
        try {
            const { data, error } = await supabase
                .from('languages')
                .select('*')
                .order('id', true);

            if (error) throw error;
            if (data != null) {
                setLanguages(data);
                console.log(data);
            }
        } catch (error) {
            console.error('Error fetching languages:', error.message);
        }
    };

    const handleUpdate = (language) => {
        setEditing(true);
        setLanguage(language);
    };

    async function updateLanguage() {
        try {
            const response = await supabase
                .from('languages')
                .update({ Languages: language })
                .eq("id", languageData.id);

            if (response.error) throw response.error;
            console.log('Language updated successfully:', response);
            setLanguage('');
            setEditing(false);
        } catch (error) {
            console.error('Error updating language:', error.message);
        }
    }

    async function deleteLanguage(language) {
        try {
            const response = await supabase
                .from("languages")
                .delete()
                .eq("id", language.id);

            if (response.error) throw response.error;
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
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
                                    Languages
                                </MDTypography>
                                <MDBox variant="gradient" borderRadius="xl" display="flex" justifyContent="center" alignItems="center" width="4rem" height="4rem" mt={-3}>
                                    <MDButton onClick={() => openPage("/languages/add-languages")}><AddBoxIcon color='info' /></MDButton>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={3}>
                                {editing ? (
                                    <>
                                        <Typography variant="h6">Editing Language</Typography>
                                        <Button onClick={() => setEditing(false)}>Go Back</Button>
                                        <Typography variant="h5">Add Language Here</Typography>
                                        <TextField required multiline maxRows={4} label="Language" fullWidth sx={{ paddingBottom: 6 }} value={language} onChange={(e) => setLanguage(e.target.value)} />
                                        <Button variant="contained" onClick={() => updateLanguage()}>Update Language</Button>
                                    </>
                                ) : (
                                    <>
                                        {languages && languages.length !== 0 &&
                                            languages.map((language, index) => (
                                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="h5" style={{ marginRight: '8px' }}>{language.Languages}</Typography>
                                                    <Button onClick={() => handleUpdate(language)} style={{ marginRight: '8px' }}>Edit</Button>
                                                    <Button onClick={() => deleteLanguage(language)}>Delete</Button>
                                                </div>
                                            ))
                                        }
                                    </>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}
