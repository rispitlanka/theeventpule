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

// @mui material components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { supabase } from "pages/supabaseClient";
import { useEffect, useState } from "react";

export default function data() {
  const [tickets, setTickets] = useState();
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_last_ten_tickets');
      if (data) {
        setTickets(data);
      }
      if (error) throw error;
    } catch (error) {
      setError(error.message);
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTickets();
  }, [])

  const Screen = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const rows = tickets ? tickets.map(tickets => ({
    bookedby: (
      <Screen name={tickets.bookedby} />
    ),
    theatrename: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {tickets.theatrename}
      </MDTypography>
    ),
    movietitle: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {tickets.movietitle}
      </MDTypography>
    ),
    created_at: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {tickets.created_at}
      </MDTypography>
    ),

  })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "Booked By", accessor: "bookedby", width: "30%", align: "left" },
      { Header: "Theatre Name", accessor: "theatrename", align: "center" },
      { Header: "Movie Name", accessor: "movietitle", align: "center" },
      { Header: "Booked Date & Time", accessor: "created_at", align: "center" },
    ],
    
    rows: rows,
  };
}