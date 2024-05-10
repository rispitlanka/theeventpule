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
import { UserDataContext } from "context";
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

  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const [theatreData, setTheatreData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };


  const fetchTheatreData = async () => {
    try {
      const { data, error } = await supabase.from('theatres').select('*').eq('id', userTheatreId);
      console.log(data);
      if (error) throw error;
      setTheatreData(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchTheatreData();
    // eslint-disable-next-line
  }, [])

  const handleRowClick = (theatreId) => {
    openPage(`/theatres/single-theatre/${theatreId}`);
  };

  const rows = theatreData ? theatreData.map(theatre => ({
    name: <div onClick={() => handleRowClick(theatre.id)} style={{ cursor: 'pointer' }}>
      <Screen image={LogoAsana} name={theatre.name} />
    </div>,
    address: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.address}
      </MDTypography>
    ),
    telephone: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.telephone}
      </MDTypography>
    ),
    coordinatorName: (
      <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
        {theatre.coordinatorName}
      </MDTypography>
    ),
    coordinatorMobile: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.coordinatorMobile}
      </MDTypography>
    ),
    coordinatorMail: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.coordinatorMail}
      </MDTypography>
    ),
    action: (
      <MDButton onClick={() => openPage(`/theatres/edit-theatre/${theatre.id}`)} variant='text' size='small' color='info'>edit</MDButton>
    ),

  })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "name", accessor: "name", width: "30%", align: "left" },
      { Header: "address", accessor: "address", align: "center" },
      { Header: "telephone", accessor: "telephone", align: "center" },
      { Header: "Coordinator Name", accessor: "coordinatorName", align: "center" },
      { Header: "Coordinator Mobile", accessor: "coordinatorMobile", align: "center" },
      { Header: "Coordinator Mail", accessor: "coordinatorMail", align: "center" },
      { Header: "other", accessor: "action", align: "center" },
    ],

    rows: rows,
  };
}
