

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

// Images
import LogoAsana from "assets/images/small-logos/genre.png";
import { Switch } from "@mui/material";


export default function data() {
    const GenreIcon = ({ image, name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" variant="rounded" />
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const [censorData, setCensorData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getCensorTypes();
    }, []);

    const getCensorTypes = async () => {
        try {
            const { data, error } = await supabase
                .from('censor_types')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setCensorData(data);
                console.log(data)
            }

        } catch (error) {
            console.error('Error fetching Censor types:', error.message);
        }
    };
    // async function deleteCensorTypes(censor) {
    //     try {
    //         const response = await supabase
    //             .from("censor_types")
    //             .delete()
    //             .eq("id", censor.id);

    //         if (response.error) throw response.error;
    //         window.location.reload();
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // }

    const handleChange = async (censorId, newValue) => {
        try {
            const { error } = await supabase
                .from('censor_types')
                .update({ isActive: newValue })
                .eq('id', censorId);
            if (error) throw error;

            setCensorData(prevData =>
                prevData.map(censorType =>
                    censorType.id === censorId ? { ...censorType, isActive: newValue } : censorType
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const rows = censorData ? censorData.map(censor => ({
        censor_type: <GenreIcon image={LogoAsana} name={censor.censor_type} />,
        status: (
            <Switch checked={censor.isActive} onChange={e => handleChange(censor.id, e.target.checked)} />
        ),
        action: (
            <MDButton onClick={() => openPage(`/censor-types/edit-censor-types/${censor.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
        ),
        // action2: (
        //     <MDButton onClick={() => deleteCensorTypes(censor)} variant='text' size='small' color='info'>delete</MDButton>
        // ),

    })) : [{ censor_type: <MDTypography color='warning' fontWeight='bold'>No Censor Types founded</MDTypography> }];

    return {
        columns: [
            { Header: "Censor Types ", accessor: "censor_type", width: "50%", align: "left" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "action", accessor: "action", align: "center" },
            // { Header: "Delete", accessor: "action2", align: "center" },
        ],

        rows: rows,
    };
}

