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
import { supabase } from "pages/supabaseClient";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Switch } from "@mui/material";

export default function data() {
    const Screen = ({ name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const [organizationData, setOrganizationData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchOrganizationData = async () => {
        try {
            const { data: organizationsResponse, error: organizationsError } = await supabase
                .from('eventOrganizations')
                .select();

            if (organizationsError) throw organizationsError;

            //   const organizationIds = organizationsResponse.map(organization => organization.id);

            //   const { data: screensResponse, error: screensError } = await supabase
            //     .from('screens')
            //     .select('organizationId, screenId:id')
            //     .in('organizationId', organizationIds);

            //   if (screensError) throw screensError;

            //   const screenCounts = screensResponse.reduce((counts, screen) => {
            //     const { organizationId } = screen;
            //     counts[organizationId] = counts[organizationId] ? counts[organizationId] + 1 : 1;
            //     return counts;
            //   }, {});

            //   const enhancedTheatres = theatresResponse.map(organization => ({
            //     ...organization,
            //     screensCount: screenCounts[organization.id] || 0,
            //   }));

            setOrganizationData(organizationsResponse);

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchOrganizationData();
    }, [])

    const handleChange = async (organizationId, newValue) => {
        try {
            const { error } = await supabase
                .from('theatres')
                .update({ isActive: newValue })
                .eq('id', organizationId);
            if (error) throw error;

            setOrganizationData(prevData =>
                prevData.map(organization =>
                    organization.id === organizationId ? { ...organization, isActive: newValue } : organization
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const rows = organizationData ? organizationData.map(organization => ({
        name: (
            <Screen name={organization.name} />
        ),
        // city: (
        //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        //     {organization.city}
        //   </MDTypography>
        // ),
        // telephone: (
        //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        //     {organization.telephone}
        //   </MDTypography>
        // ),
        // screens: (
        //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        //     {organization.screensCount}
        //   </MDTypography>
        // ),
        // ownerName: (
        //   <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
        //     {organization.ownerName}
        //   </MDTypography>
        // ),
        // ownerPhoneNumber: (
        //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        //     {organization.ownerPhoneNumber}
        //   </MDTypography>
        // ),
        // status: (
        //   <Switch checked={organization.isActive} onChange={e => handleChange(organization.id, e.target.checked)} />
        // ),
        // action: (
        //   <>
        //     <MDButton onClick={() => openPage(`/theatres/single-organization/${organization.id}`)} variant='text' size='medium' color='info'><VisibilityIcon /></MDButton>
        //     <MDButton onClick={() => openPage(`/theatres/edit-organization/${organization.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
        //   </>
        // ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

    return {
        columns: [
            { Header: "name", accessor: "name", width: "30%", align: "left" },
            //   { Header: "city", accessor: "city", align: "center" },
            //   { Header: "telephone", accessor: "telephone", align: "center" },
            //   { Header: "screens", accessor: "screens", align: "center" },
            //   { Header: "owner Name", accessor: "ownerName", align: "center" },
            //   { Header: "owner Phone Number", accessor: "ownerPhoneNumber", align: "center" },
            //   { Header: "status", accessor: "status", align: "center" },
            //   { Header: "actions", accessor: "action", align: "center" },
        ],

        rows: rows,
    };
}