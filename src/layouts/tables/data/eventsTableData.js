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
import { supabase } from "pages/supabaseClient";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Switch } from "@mui/material";
import { useState, useEffect } from "react";

export default function data() {
  const Screen = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const [eventsData, setEventsData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };

  const fetchEventsData = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');
      if (eventsError) throw error;
      setEventsData(eventsData);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, [])

  const handleRowClick = (eventId) => {
    openPage(`/events/single-event/${eventId}/view-registrations`);
  };

  const formattedDate = (date) => {
    return ((new Date(date)).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', }))
  }

  const formattedTime = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date(0, 0, 0, hours, minutes, seconds);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  };

  const rows = eventsData ? eventsData.map(event => ({
    name: <div onClick={() => handleRowClick(event.id)} style={{ cursor: 'pointer' }}>
      <Screen name={event.name} />
    </div>,
    status: (
      <Switch checked={event.isActive} onChange={e => handleChange(event.id, e.target.checked)} />
    ),
    category: (
      <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
        {event.category}
      </MDTypography>
    ),
    // organizerName: (
    //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //     {event.organizer}
    //   </MDTypography>
    // ),
    date: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {formattedDate(event.date)}
      </MDTypography>
    ),
    startTime: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {formattedTime(event.startTime)}
      </MDTypography>
    ),

  })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "name", accessor: "name", width: "30%", align: "left" },
      { Header: "category", accessor: "category", align: "center" },
      // { Header: "organizer Name", accessor: "organizerName", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "start Time", accessor: "startTime", align: "center" },
    ],

    rows: rows,
  };
}