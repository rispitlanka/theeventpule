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
import { supabase } from "pages/supabaseClient";
import EditIcon from '@mui/icons-material/Edit';
import { Switch } from "@mui/material";

export default function data() {
    const [castData, setCastData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getCasts();
    }, []);

    const getCasts = async () => {
        try {
            const { data, error } = await supabase
                .from('cast')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setCastData(data);
            }

        } catch (error) {
            console.error('Error fetching cast:', error.message);
        }
    };

    // async function deleteCast(cast) {
    //     try {
    //         const response = await supabase
    //             .from("cast")
    //             .delete()
    //             .eq("id", cast.id);

    //         if (response.error) throw response.error;
    //         window.location.reload();
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // }

    const handleChange = async (castId, newValue) => {
        try {
            const { error } = await supabase
                .from('cast')
                .update({ isActive: newValue })
                .eq('id', castId);
            if (error) throw error;

            setCastData(prevData =>
                prevData.map(cast =>
                    cast.id === castId ? { ...cast, isActive: newValue } : cast
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const rows = castData ? castData.map(cast => ({
        name: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
                <MDAvatar src={cast.image} name={cast.name} size="sm" variant="rounded" />
                <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                    {cast.name}
                </MDTypography>
            </MDBox>
        ),
        category: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {cast.category}
            </MDTypography>
        ),
        status: (
            <Switch checked={cast.isActive} onChange={e => handleChange(cast.id, e.target.checked)} />
        ),
        action: (
            <MDButton onClick={() => openPage(`/cast/edit-cast/${cast.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
        ),
        // action2: (
        //     <MDButton onClick={() => deleteCast(cast)} variant='text' size='small' color='info'>delete</MDButton>
        // ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>No Cast found</MDTypography> }];

    return {
        columns: [
            { Header: "Cast", accessor: "name", width: "30%", align: "left" },
            { Header: "Category ", accessor: "category", width: "30%", align: "left" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "action", accessor: "action", align: "center" },
            // { Header: "Delete", accessor: "action2", align: "center" },
        ],

        rows: rows,
    };
}
