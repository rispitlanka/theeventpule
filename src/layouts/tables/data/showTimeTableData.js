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
import { useContext, useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { UserDataContext } from "context";

export default function data() {
  const Screen = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const formattedTime = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date(0, 0, 0, hours, minutes, seconds);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  };

  const [showTimeData, setShowTimeData] = useState(null);
  const [error, setError] = useState(null);
  const { screenId } = useParams();
  const navigate = useNavigate();
  const userDetails = useContext(UserDataContext);
  const userRole = userDetails[0].userRole;
  const openPage = (route) => {
    navigate(route);
  };


  const fetchShowTimeData = async () => {
    try {
      const { data, error } = await supabase.from('showTime').select('*').eq('screenId', screenId);
      console.log(data);
      if (error) throw error;
      setShowTimeData(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchShowTimeData();
  }, [screenId])

  // const handleRowClick = (screenId) => {
  //   openPage(`/theatres/single-theatre/single-screen/edit-showTime/${screenId}`);
  // };

  const rows = showTimeData ? showTimeData.map(showTime => ({
    name: <div>
      <Screen name={showTime.name} />
    </div>,
    time: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {formattedTime(showTime.time)}
      </MDTypography>
    ),
    action: (
      <MDButton onClick={() => openPage(`/theatres/single-theatre/single-screen/edit-showTime/${showTime.id}`)} variant='text' size='small' color='info' disabled={userRole === 'superAdmin'}>Edit</MDButton>
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
