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
import { useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Images
import LogoAsana from "assets/images/small-logos/screen1.png";

export default function data() {

    const [ticketsData, setTicketsData] = useState(null);
    const [error, setError] = useState(null);

    const fetchTicketsData = async () => {
        try {
            const { data, error } = await supabase.from('tickets').select();
            if (error) throw error;
            setTicketsData(data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchTicketsData();
    }, [])

    const rows = ticketsData ? ticketsData.map(ticket => ({
        name: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">{ticket.id}</MDTypography>,
        email: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {ticket.totalPrice}
            </MDTypography>
        ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

    return {
        columns: [
            { Header: "name", accessor: "name", width: "30%", align: "left" },
            { Header: "price", accessor: "email", align: "center" },
        ],

        rows: rows,
    };
}