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
import MDAvatar from "components/MDAvatar";

// Images
import LogoAsana from "assets/images/small-logos/screen1.png";

export default function data() {
    const Screen = ({ image, name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" variant="rounded" />
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const [customerData, setCustomerData] = useState(null);
    const [error, setError] = useState(null);
    //   const navigate = useNavigate();
    //   const openPage = (route) => {
    //     navigate(route);
    //   };

    const fetchCustomerData = async () => {
        try {
            const { data, error } = await supabase.from('users').select();
            if (error) throw error;
            setCustomerData(data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, [])

    //   const handleRowClick = (userId) => {
    //     openPage(`/users/single-customer/${userId}`);
    //   };

    const rows = customerData ? customerData.map(customer => ({
        name: <div>
            <Screen image={LogoAsana} name={customer.name} />
        </div>,
        email: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {customer.email}
            </MDTypography>
        ),
        // action: (
        //   <MDButton onClick={() => openPage(`/users/edit-customer/${customer.id}`)} variant='text' size='small' color='info'>edit</MDButton>
        // ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

    return {
        columns: [
            { Header: "name", accessor: "name", width: "30%", align: "left" },
            { Header: "email", accessor: "email", align: "center" },
            //   { Header: "other", accessor: "action", align: "center" },
        ],

        rows: rows,
    };
}