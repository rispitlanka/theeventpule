

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
    const FacilityIcon = ({ image, name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="xs" variant="rounded" />
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const [facilityData, setFacilityData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getFacilities();
    }, []);

    const getFacilities = async () => {
        try {
            const { data, error } = await supabase
                .from('facilities')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setFacilityData(data);
                console.log(data)
            }

        } catch (error) {
            console.error('Error fetching questions:', error.message);
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
                .from('facilities')
                .update({ isActive: newValue })
                .eq('id', id);
            if (error) throw error;

            setFacilityData(prevData =>
                prevData.map(facility =>
                    facility.id === id ? { ...facility, isActive: newValue } : facility
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const rows = facilityData ? facilityData.map(facility => ({
        facility_name: <FacilityIcon image={facility.icons} name={facility.facility_name} />,
        status: (
            <Switch checked={facility.isActive} onChange={e => handleChange(facility.id, e.target.checked)} />
        ),
        action: (
            <MDButton onClick={() => openPage(`/facilities/edit-facilities/${facility.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
        ),
        // action2: (
        //     <MDButton onClick={() => deleteGenre(facility)} variant='text' size='small' color='info'>delete</MDButton>
        // ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>No Facilities founded</MDTypography> }];

    return {
        columns: [
            { Header: "facility name", accessor: "facility_name", width: "50%", align: "left" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "action", accessor: "action", align: "center" },
            // { Header: "delete", accessor: "action2", align: "center" },
        ],

        rows: rows,
    };
}