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

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

export default function data() {
  const Screen = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const [showTimeData, setShowTimeData] = useState(null);
  const [error, setError] = useState(null);
  const { screenId } = useParams();
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };


  const fetchShowTimeData = async () => {
    try {
      const { data, error } = await supabase.from('showTime').select('*');
      console.log(data);
      if (error) throw error;
      setShowTimeData(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchShowTimeData();
  }, [])

  const handleRowClick = (screenId) => {
    openPage(`/theatres/single-theatre/single-screen/edit-showTime/${screenId}`);
  };

  const rows = showTimeData ? showTimeData.map(showTime => ({
    name: <div onClick={() => handleRowClick(showTime.id)} style={{ cursor: 'pointer' }}>
      <Screen name={showTime.name} />
    </div>,
    time: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {showTime.time}
      </MDTypography>
    ),
    action: (
      <MDButton onClick={() => openPage(`/theatres/single-theatre/single-screen/edit-showTime/${screenId}`)} variant='text' size='small' color='info'>edit</MDButton>
    ),

  })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "show name", accessor: "name", width: "30%", align: "left" },
      { Header: "time", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: rows,
  };
}
