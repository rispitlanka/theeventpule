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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
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
  const userTheatreId = userDetails && userDetails[0].theatreId;
  const [eventsData, setEventsData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };


  const fetchEventsData = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('theatreId', userTheatreId);
      console.log(data);
      if (error) throw error;
      setEventsData(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, [])

  const handleRowClick = (eventId) => {
    openPage(`/events/single-event/${eventId}`);
  };

  const rows = eventsData ? eventsData.map(event => ({
    name: <div onClick={() => handleRowClick(event.id)} style={{ cursor: 'pointer' }}>
      <Screen name={event.name} />
    </div>,
    description: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {event.description}
      </MDTypography>
    ),
    status: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {event.status}
      </MDTypography>
    ),
    category: (
      <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
        {event.category}
      </MDTypography>
    ),
    location: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {event.location}
      </MDTypography>
    ),
    date: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {event.date}
      </MDTypography>
    ),
    startTime: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {event.startTime}
        </MDTypography>
      ),
      price: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {event.price}
        </MDTypography>
      ),
      contactEmail: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {event.contactEmail}
        </MDTypography>
      ),
      contactPhone: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {event.contactPhone}
        </MDTypography>
      ),
      screenId: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {event.screenId}
        </MDTypography>
      ),  

  })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "name", accessor: "name", width: "30%", align: "left" },
      { Header: "description", accessor: "description", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "category", accessor: "category", align: "center" },
      { Header: "location", accessor: "location", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "start Time", accessor: "startTime", align: "center" },
      { Header: "price", accessor: "price", align: "center" },
      { Header: "contact Email", accessor: "contactEmail", align: "center" },
      { Header: "contact Phone", accessor: "contactPhone", align: "center" },
      { Header: "screenId", accessor: "screenId", align: "center" },
    ],

    rows: rows,
  };
}
