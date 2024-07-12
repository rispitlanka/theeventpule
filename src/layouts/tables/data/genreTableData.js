

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
import { supabase } from "pages/supabaseClient";
import { Switch } from "@mui/material";

export default function data() {
    const GenreIcon = ({ image, name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="xs" variant="rounded" />
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const [genreData, setGenreData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getGenre();
    }, []);

    const getGenre = async () => {
        try {
            const { data, error } = await supabase
                .from('genres')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setGenreData(data);
                console.log(data)
            }

        } catch (error) {
            console.error('Error fetching genres:', error.message);
        }
    };
    // async function deleteGenre(genre) {
    //     try {
    //         const response = await supabase
    //             .from("genres")
    //             .delete()
    //             .eq("id", genre.id);

    //         if (response.error) throw response.error;
    //         window.location.reload();
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // }

    const handleChange = async (id, newValue) => {
        try {
            const { error } = await supabase
                .from('genres')
                .update({ isActive: newValue })
                .eq('id', id);
            if (error) throw error;

            setGenreData(prevData =>
                prevData.map(genre =>
                    genre.id === id ? { ...genre, isActive: newValue } : genre
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const rows = genreData ? genreData.map(genre => ({
        genre_name: <GenreIcon image={genre.icons} name={genre.genre_name} />,
        status: (
            <Switch checked={genre.isActive} onChange={e => handleChange(genre.id, e.target.checked)} />
        ),
        action: (
            <MDButton onClick={() => openPage(`/genre/edit-genre/${genre.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
        ),
        // action2: (
        //     <MDButton onClick={() => deleteGenre(genre)} variant='text' size='small' color='info'>delete</MDButton>
        // ),

    })) : [{ genre_name: <MDTypography color='warning' fontWeight='bold'>No genres founded</MDTypography> }];

    return {
        columns: [
            { Header: "Genres ", accessor: "genre_name", width: "50%", align: "left" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "action", accessor: "action", align: "center" },
            // { Header: "Delete", accessor: "action2", align: "center" },
        ],

        rows: rows,
    };
}

