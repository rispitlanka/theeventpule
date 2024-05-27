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

import { useContext, useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

// Images
import LogoAsana from "assets/images/small-logos/screen1.png";
import { UserDataContext } from "context";

export default function data() {
  const Screen = ({id }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {id}
      </MDTypography>
    </MDBox>
  );

  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails[0].theatreId;
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    const getAlltickets = async () => {
      try {
        const { data: ticketsResponse, error: ticketsResponseError } = await supabase.from('tickets').select('*').eq('theatreId', userTheatreId);
        if (ticketsResponseError) {
          console.log('ticketsResponseError', ticketsResponseError)
        }
        if (ticketsResponse) {
          console.log('ticketsResponse', ticketsResponse)
          setAllTickets(ticketsResponse);
        }
      }
      catch {

      }
    };
    getAlltickets();
  }, [])


  const formattedDate =(date) => {
    return ((new Date(date)).toLocaleString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric',hour: '2-digit',minute: '2-digit', hour12: true, }))
  }

  const formattedTime = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date(0, 0, 0, hours, minutes, seconds);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  };

  const rows = allTickets ? allTickets.map(ticket => ({
    id: <div>
      <Screen id={ticket.id} />
    </div>,
    seatId: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {ticket.seatId}
      </MDTypography>
    ),
    showId: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {ticket.showId}
      </MDTypography>
    ),
    theatreId: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {ticket.theatreId}
      </MDTypography>
    ),
    bookedDate: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {formattedDate(ticket.created_at)}
      </MDTypography>
    ),
    bookedBy: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {ticket.bookedBy}
        </MDTypography>
      ),

  })) : [{ id: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "Id", accessor: "id", width: "30%", align: "left" },
      { Header: "seat Id", accessor: "seatId", align: "center" },
      { Header: "show Id", accessor: "showId", align: "center" },
      { Header: "theatre Id", accessor: "theatreId", align: "center" },
      { Header: "booked Date", accessor: "bookedDate", align: "center" },
      { Header: "booked by", accessor: "bookedBy", align: "center" },
    ],

    rows: rows,
  };
}
