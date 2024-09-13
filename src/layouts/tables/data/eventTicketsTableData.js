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
import { useNavigate } from "react-router-dom";

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
    const [allEventTickets, setAllEventTickets] = useState([]);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    const getAllEventTickets = async () => {
        try {
            const { data, error } = await supabase.from('tickets_events').select('*,events(name),zone_ticket_category(name),eventOrganizations(name),zones_events(name),venues(name),eventRegistrations(details,paymentStatus)').eq('eventOrganizationId', userOrganizationId).order('id', { ascending: false });
            if (error) {
                console.log('ticketsResponseError', error)
            }
            if (data) {
                setAllEventTickets(data);
            }
        }
        catch (error) {
            console.error('Error in fetching tickets:', error.message);
        }
    };

    useEffect(() => {
        getAllEventTickets();
    }, [userOrganizationId]);

    const formattedDate = (date) => {
        return ((new Date(date)).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }))
    }

    const handleRowClick = (ticketId,eventId) => {
        openPage(`/viewTickets/single-ticket/${ticketId}/${eventId}`);
    };

    const rows = allEventTickets.map((ticket) => {
        const parsedDetails = ticket.eventRegistrations?.details ? JSON.parse(ticket.eventRegistrations.details) : {};
        const firstName = parsedDetails["First Name"] || "N/A";
        const lastName = parsedDetails["Last Name"] || "N/A";
        const email = parsedDetails["Email"] || "N/A";
        const phone = parsedDetails["Phone Number"] || "N/A";

        return {
            id: (
                <div onClick={() => handleRowClick(ticket.id,ticket.eventId)} style={{ cursor: 'pointer' }}>
                    <Screen id={ticket.id} />
                </div>
            ),
            eventName: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.events?.name || 'N/A'}
                </MDTypography>
            ),
            bookedDate: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {formattedDate(ticket.created_at)}
                </MDTypography>
            ),
            bookedBy: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {firstName}
                </MDTypography>
            ),
            phone: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {phone}
                </MDTypography>
            ),
            email: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {email}
                </MDTypography>
            ),
            referenceId: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.referenceId || 'N/A'}
                </MDTypography>
            ),
            category: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.zone_ticket_category?.name || 'N/A'}
                </MDTypography>
            ),
            price: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.price || 'N/A'}
                </MDTypography>
            ),
            paymentStatus: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.eventRegistrations?.paymentStatus || 'N/A'}
                </MDTypography>
            ),
            organizationName: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.eventOrganizations?.name || 'N/A'}
                </MDTypography>
            ),
            zone: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.zones_events?.name || 'N/A'}
                </MDTypography>
            ),
            venue: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.venues?.name || 'N/A'}
                </MDTypography>
            ),
            checkedIn: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.checkedIn ? 'Yes' : 'No'}
                </MDTypography>
            ),
            isActive: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {ticket.isActive ? 'Yes' : 'No'}
                </MDTypography>
            ),
        };
    });


    return {
        columns: [
            { Header: "Ticket Id", accessor: "id", width: "30%", align: "left" },
            { Header: "event name", accessor: "eventName", align: "center" },
            { Header: "booked Date", accessor: "bookedDate", align: "center" },
            { Header: "booked by", accessor: "bookedBy", align: "center" },
            { Header: "Phone Number", accessor: "phone", align: "center" },
            // { Header: "Email", accessor: "email", align: "center" },
            { Header: "Payment Status", accessor: "paymentStatus", align: "center" },
            { Header: "reference id", accessor: "referenceId", align: "center" },
            // { Header: "category", accessor: "category", align: "center" },
        ],

        rows: rows,
    };
}