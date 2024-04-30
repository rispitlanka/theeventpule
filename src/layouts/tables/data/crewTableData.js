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

export default function data() {
    const [crewData, setCrewData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getCrews();
    }, []);

    const getCrews = async () => {
        try {
            const { data, error } = await supabase
                .from('crew')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setCrewData(data);
                console.log(data)
            }

        } catch (error) {
            console.error('Error fetching crew:', error.message);
        }
    };
    async function deleteCrew(crew) {
        try {
            const response = await supabase
                .from("crew")
                .delete()
                .eq("id", crew.id);

            if (response.error) throw response.error;
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }

    const rows = crewData ? crewData.map(crew => ({
        name: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
                <MDAvatar src={crew.image} name={crew.name} size="sm" variant="rounded" />
                <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                    {crew.name}
                </MDTypography>
            </MDBox>
        ),
        category: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {crew.category}
            </MDTypography>
        ),

        action: (
            <MDButton onClick={() => openPage(`/crew/edit-crew/${crew.id}`)} variant='text' size='small' color='info'>edit</MDButton>
        ),
        action2: (
            <MDButton onClick={() => deleteCrew(crew)} variant='text' size='small' color='info'>delete</MDButton>
        ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>No Crew founded</MDTypography> }];

    return {
        columns: [
            { Header: "Crew", accessor: "name", width: "30%", align: "left" },
            { Header: "Category ", accessor: "category", width: "30%", align: "left" },
            { Header: "Edit", accessor: "action", align: "center" },
            { Header: "Delete", accessor: "action2", align: "center" },
        ],

        rows: rows,
    };
}

