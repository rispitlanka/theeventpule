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
    const userOrganizationId = userDetails && userDetails[0].eventOrganizationId;
    const [allTickets, setAllTickets] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getAlltickets = async () => {
            try {
                const { data: ticketsResponse, error: ticketsResponseError } = await supabase.from('tickets_events').select('*').eq('eventOrganizationId', userOrganizationId);
                if (ticketsResponseError) {
                    console.log('ticketsResponseError', ticketsResponseError)
                }
                if (ticketsResponse) {
                    setAllTickets(ticketsResponse);

                    const eventIds = ticketsResponse && ticketsResponse.length > 0 && ticketsResponse.map(ticket => ticket.eventId);
                    const { data: eventResponse, error: eventResponseError } = await supabase.from('events').select('*').in('id', eventIds);
                    if (eventResponseError) {
                        console.log('eventResponseError', eventResponseError)
                    }
                    if (eventResponse) {
                        setEvents(eventResponse);
                    }
                }
            }
            catch {

            }
        };
        getAlltickets();
    }, [userOrganizationId])

    const getEventNameById = (id) => {
        const eventId = Number(id);
        const event = events && events.length > 0 && events.find(event => event.id === eventId);
        return event ? event.name : 'Unknown Event';
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
        eventId: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {getEventNameById(ticket.eventId)}
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
            { Header: "event name", accessor: "eventId", align: "center" },
            { Header: "booked Date", accessor: "bookedDate", align: "center" },
            { Header: "booked by", accessor: "bookedBy", align: "center" },
        ],

        rows: rows,
    };
}
