

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

import { Icon } from '@iconify/react';
import cubeSolid from '@iconify-icons/fa-solid/cube';

export default function data() {
    const ProjectionIcon = ({ name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <Icon icon={cubeSolid} width={24} height={24} />
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );


    const [projectionTypeData, setProjectionTypeData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getProjectionTypes();
    }, []);

    const getProjectionTypes = async () => {
        try {
            const { data, error } = await supabase
                .from('projection_types')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setProjectionTypeData(data);
                console.log(data)
            }

        } catch (error) {
            console.error('Error fetching projection types:', error.message);
        }
    };
    async function deleteProjectionType(projtyp) {
        try {
            const response = await supabase
                .from("projection_types")
                .delete()
                .eq("id", projtyp.id);

            if (response.error) throw response.error;
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }

    const rows = projectionTypeData ? projectionTypeData.map(projtyp => ({
        projection_type: <ProjectionIcon name={projtyp.projection_type} />,

        action: (
            <MDButton onClick={() => openPage(`/projection-type/edit-projection-type/${projtyp.id}`)} variant='text' size='small' color='info'>edit</MDButton>
        ),
        action2: (
            <MDButton onClick={() => deleteProjectionType(projtyp)} variant='text' size='small' color='info'>delete</MDButton>
        ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>No Projection types founded</MDTypography> }];

    return {
        columns: [
            { Header: "Projection Types ", accessor: "projection_type", width: "50%", align: "left" },

            { Header: "Edit", accessor: "action", align: "center" },
            { Header: "Delete", accessor: "action2", align: "center" },
        ],

        rows: rows,
    };
}

