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
import MDButton from "components/MDButton";

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
  const [theatreData, setTheatreData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase.from('theatreOwners').select();
      if (error) throw error;
      setUserData(data);
    } catch (error) {
      setError(error);
    }
  };

  const fetchTheatreData = async () => {
    try {
      const { data, error } = await supabase.from('theatres').select();
      if (error) throw error;
      setTheatreData(data);
    } catch (error) {
      setError(error);
    }
  };

  const getTheatreName = (theatreId) => {
    const theatre = theatreData && theatreData.find(theatre => theatre.id === theatreId);
    return theatre ? theatre.name : "Unknown";
  };

  useEffect(() => {
    fetchUserData();
    fetchTheatreData();
  }, [])

  const handleRowClick = (userId) => {
    openPage(`/users/single-user/${userId}`);
  };

  const rows = userData ? userData.map(user => ({
    name: <div onClick={() => handleRowClick(user.id)} style={{ cursor: 'pointer' }}>
      <Screen image={LogoAsana} name={user.name} />
    </div>,
    userRole: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.userRole}
      </MDTypography>
    ),
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
    theatreName: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {getTheatreName(user.theatreId)}
      </MDTypography>
    ),
    action: (
      <MDButton onClick={() => openPage(`/users/edit-user/${user.id}`)} variant='text' size='small' color='info'>edit</MDButton>
    ),

  })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "name", accessor: "name", width: "30%", align: "left" },
      { Header: "user role", accessor: "userRole", align: "center" },
      { Header: "theatre name", accessor: "theatreName", align: "center" },
      { Header: "mobile", accessor: "mobile", align: "center" },
      { Header: "email", accessor: "email", align: "center" },
      { Header: "other", accessor: "action", align: "center" },
    ],

    rows: rows,
  };
}
