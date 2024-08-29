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
import { useContext, useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Switch } from "@mui/material";
import { UserDataContext } from "context";

export default function data() {
    const Screen = ({ name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const userDetails = useContext(UserDataContext);
    const userRole = userDetails && userDetails[0].userRole;
    const [venueData, setVenueData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchVenueData = async () => {
        try {
            const { data: venueResponses, error: venueError } = await supabase
                .from('venues')
                .select()
                .order('id', { ascending: false });

            if (venueError) throw venueError;

            setVenueData(venueResponses);

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchVenueData();
    }, [])

    const handleChange = async (venueId, newValue) => {
        try {
            const { error } = await supabase
                .from('venues')
                .update({ isActive: newValue })
                .eq('id', venueId);
            if (error) throw error;

            setVenueData(prevData =>
                prevData.map(venue =>
                    venue.id === venueId ? { ...venue, isActive: newValue } : venue
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const rows = venueData ? venueData.map(venue => ({
        name: (
            <Screen name={venue.name} />
        ),
        location: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {venue.location}
            </MDTypography>
        ),
        telephone: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {venue.telephone}
            </MDTypography>
        ),
        ownerName: (
            <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
                {venue.ownerName}
            </MDTypography>
        ),
        ownerMobile: (
            <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
                {venue.ownerMobile}
            </MDTypography>
        ),
        ownerEmail: (
            <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
                {venue.ownerEmail}
            </MDTypography>
        ),
        status: (
            <Switch checked={venue.isActive} onChange={e => handleChange(venue.id, e.target.checked)} disabled={userRole !== 'superAdmin'} />
        ),
        action: (
            <>
                <MDButton onClick={() => openPage(`/venues/single-venue/${venue.id}`)} variant='text' size='medium' color='info'><VisibilityIcon /></MDButton>
                <MDButton onClick={() => openPage(`/venues/edit-venue/${venue.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
            </>
        ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

    return {
        columns: [
            { Header: "name", accessor: "name", width: "30%", align: "left" },
            { Header: "location", accessor: "location", align: "center" },
            { Header: "telephone", accessor: "telephone", align: "center" },
            { Header: "owner Name", accessor: "ownerName", align: "center" },
            { Header: "owner Mobile", accessor: "ownerMobile", align: "center" },
            { Header: "owner Email", accessor: "ownerEmail", align: "center" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "actions", accessor: "action", align: "center" },
        ],

        rows: rows,
    };
}