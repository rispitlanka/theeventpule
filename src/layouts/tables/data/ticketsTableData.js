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

// Images
import { UserDataContext } from "context";

export default function data() {
  const Screen = ({ id }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {id}
      </MDTypography>
    </MDBox>
  );

  const userDetails = useContext(UserDataContext);
  const userTheatreId = userDetails && userDetails[0].theatreId;
  const [allTickets, setAllTickets] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getAlltickets = async () => {
      try {
        const { data: ticketsResponse, error: ticketsResponseError } = await supabase.from('tickets').select('*').eq('theatreId', userTheatreId);
        if (ticketsResponseError) {
          console.log('ticketsResponseError', ticketsResponseError)
        }
        if (ticketsResponse) {
          setAllTickets(ticketsResponse);

          const movieIds = ticketsResponse && ticketsResponse.length > 0 && ticketsResponse.map(ticket => ticket.movieId);
          const { data: movieResponse, error: movieResponseError } = await supabase.from('movies').select('*').in('id', movieIds);
          if (movieResponseError) {
            console.log('movieResponseError', movieResponseError)
          }
          if (movieResponse) {
            setMovies(movieResponse);
          }
        }
      }
      catch {

      }
    };
    getAlltickets();
  }, [userTheatreId])

  const getMovieNameById = (id) => {
    const movieId = Number(id);
    const movie = movies && movies.length > 0 && movies.find(movie => movie.id === movieId);
    return movie ? movie.title : 'Unknown Movie';
  };

  const formattedDate = (date) => {
    return ((new Date(date)).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }))
  }

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
    movieId: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {getMovieNameById(ticket.movieId)}
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
      { Header: "Ticket Id", accessor: "id", width: "30%", align: "left" },
      { Header: "seat Id", accessor: "seatId", align: "center" },
      { Header: "show Id", accessor: "showId", align: "center" },
      { Header: "movie name", accessor: "movieId", align: "center" },
      { Header: "booked Date", accessor: "bookedDate", align: "center" },
      { Header: "booked by", accessor: "bookedBy", align: "center" },
    ],

    rows: rows,
  };
}
