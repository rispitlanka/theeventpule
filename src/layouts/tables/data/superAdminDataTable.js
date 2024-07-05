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

    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const fetchUserData = async () => {
        try {
            const { data, error } = await supabase.from('theatreOwners').select().eq('userRole', 'superAdmin');
            if (error) throw error;
            setUserData(data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [])

    //   const handleChange = async (userId, newValue) => {
    //     try {
    //       const { error } = await supabase
    //         .from('theatreOwners')
    //         .update({ isActive: newValue })
    //         .eq('id', userId);
    //       if (error) throw error;

    //       setUserData(prevData =>
    //         prevData.map(user =>
    //           user.id === userId ? { ...user, isActive: newValue } : user
    //         )
    //       );
    //     } catch (error) {
    //       setError(error.message);
    //     }
    //   };

    const rows = userData ? userData.map(user => ({
        name: (
            <Screen image={LogoAsana} name={user.name} />
        ),
        // userRole: (
        //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        //         {user.userRole}
        //     </MDTypography>
        // ),
        mobile: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {user.mobile}
            </MDTypography>
        ),
        email: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {user.email}
            </MDTypography>
        ),
        // status: (
        //   <Switch checked={user.isActive} onChange={e => handleChange(user.id, e.target.checked)} />
        // ),
        // action: (
        //   <>
        //     <MDButton onClick={() => openPage(`/theatreOwners/theatreOwner/${user.id}`)} variant='text' size='medium' color='info'><VisibilityIcon /></MDButton>
        //     <MDButton onClick={() => openPage(`/theatreOwners/edit-theatreOwner/${user.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
        //   </>
        // ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

    return {
        columns: [
            { Header: "name", accessor: "name", width: "30%", align: "left" },
            // { Header: "user role", accessor: "userRole", align: "center" },
            //   { Header: "theatre name", accessor: "theatreName", align: "center" },
            { Header: "mobile", accessor: "mobile", align: "center" },
            { Header: "email", accessor: "email", align: "center" },
            //   { Header: "status", accessor: "status", align: "center" },
            //   { Header: "other", accessor: "action", align: "center" },
        ],

        rows: rows,
    };
}
