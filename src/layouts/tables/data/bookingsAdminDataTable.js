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
import { useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";
import MDTypography from "components/MDTypography";
import dayjs from "dayjs";

export default function Data() {
    const [ticketsData, setTicketsData] = useState([]);
    const [error, setError] = useState(null);

    const fetchTicketsData = async () => {
        try {
            const { data: tickets, error: ticketsError } = await supabase
                .from('tickets')
                .select()
                .order('created_at', { ascending: false });
            if (ticketsError) throw ticketsError;
            const showIds = tickets.map(ticket => ticket.showId);
            const movieIds = tickets.map(ticket => ticket.movieId);
            const theatreIds = tickets.map(ticket => ticket.theatreId);

            const [shows, movies, theatres] = await Promise.all([
                supabase.from('shows').select().in('id', showIds),
                supabase.from('movies').select().in('id', movieIds),
                supabase.from('theatres').select().in('id', theatreIds),
            ]);
            const showTimeIds = shows.data.map(show => show.showTimeId);
            const { data: showTimes, error: showTimesError } = await supabase
                .from('showTime')
                .select()
                .in('id', showTimeIds);

            if (showTimesError) throw showTimesError;

            const enhancedTickets = tickets.map(ticket => {
                const show = shows.data.find(show => show.id === ticket.showId);
                const movie = movies.data.find(movie => movie.id === ticket.movieId);
                const theatre = theatres.data.find(theatre => theatre.id === ticket.theatreId);
                const showTime = showTimes.find(showTime => showTime.id === show.showTimeId);

                return {
                    ...ticket,
                    movieName: movie ? movie.title : 'Unknown Movie',
                    theatreName: theatre ? theatre.name : 'Unknown Theatre',
                    showTime: showTime ? showTime.time : 'Unknown Time',
                };
            });

            setTicketsData(enhancedTickets);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchTicketsData();
    }, []);

    const formattedDate = (date) => {
        return dayjs(date).format('DD-MM-YYYY HH:MM');
    };

    const formattedTime = (time) => {
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date(0, 0, 0, hours, minutes, seconds);
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('en-US', options);
    };

    const rows = ticketsData.length
        ? ticketsData.map(ticket => ({
            bookedBy: (
                <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                    {ticket.bookedBy}
                </MDTypography>
            ),
            movieName: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.movieName}
                </MDTypography>
            ),
            theatreName: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.theatreName}
                </MDTypography>
            ),
            showTime: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {formattedTime(ticket.showTime)}
                </MDTypography>
            ),
            createdAt: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {formattedDate(ticket.created_at)}
                </MDTypography>
            ),
        }))
        : [
            {
                bookedBy: (
                    <MDTypography color="warning" fontWeight="bold">
                        {error ? error.message : 'No data available'}
                    </MDTypography>
                ),
            },
        ];

    return {
        columns: [
            { Header: 'Booked By', accessor: 'bookedBy', width: '15%', align: 'left' },
            { Header: 'Theatre Name', accessor: 'theatreName', align: 'center' },
            { Header: 'Show Time', accessor: 'showTime', align: 'center' },
            { Header: 'Movie Name', accessor: 'movieName', align: 'center' },
            { Header: 'Created At', accessor: 'createdAt', align: 'center' },
        ],
        rows: rows,
    };
}