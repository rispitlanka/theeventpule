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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import Facilities from "pages/facilities";

export default function data() {
    const Facilities = ({ name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>

            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>

            </MDBox>
        </MDBox>
    );



    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    return {
        columns: [
            { Header: "facility name", accessor: "facilityName", width: "65%", align: "left" },
            { Header: "action", accessor: "action", align: "center" },
        ],

        rows: [
            {
                facilityName: <Facilities name="Multiple Screens" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="Comfortable Seating" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),

            },

            {
                facilityName: <Facilities name="Digital Projection" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="Air condtioning" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="Clean Restrooms" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="Lobby Area" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="Wi-Fi" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="3D Capability" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="Childcare Services" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            },
            {
                facilityName: <Facilities name="Immersive Sound Systems" />,
                action: (
                    <MDButton onClick={() => openPage("/tables/manage")} variant='text' color='info' size='small'>Manage</MDButton>
                ),
            }



        ],
    };
}
