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
// import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import LogoAsana from "assets/images/small-logos/screen1.png";
import logoGithub from "assets/images/small-logos/screen7.jpg";
import logoAtlassian from "assets/images/small-logos/screen3.jpg";
import logoSlack from "assets/images/small-logos/screen4.jpg";
import logoSpotify from "assets/images/small-logos/screen5.jpg";
import logoInvesion from "assets/images/small-logos/screen6.jpg";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

export default function data() {
  const Screen = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };

  // const Progress = ({ color, value }) => (
  //   <MDBox display="flex" alignItems="center">
  //     <MDTypography variant="caption" color="text" fontWeight="medium">
  //       {value}%
  //     </MDTypography>
  //     <MDBox ml={0.5} width="9rem">
  //       <MDProgress variant="gradient" color={color} value={value} />
  //     </MDBox>
  //   </MDBox>
  // );

  return {
    columns: [
      { Header: "screen name", accessor: "name", width: "30%", align: "left" },
      { Header: "theatre name", accessor: "theatreName", align: "center" },
      { Header: "screen type", accessor: "type", align: "center" },
      { Header: "price", accessor: "budget", align: "center" },
      { Header: "sound", accessor: "sound", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "other", accessor: "action", align: "center" },
    ],

    rows: [
      {
        name: <Screen image={LogoAsana} name="Tharma" />,
        theatreName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            savoy
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            4K
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 2,500
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="running" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDButton onClick={() => openPage("/tables/edit-screen")} variant='text' size='small' color='info'>edit</MDButton>
        ),
      },
      {
        name: <Screen image={logoGithub} name="Bheema" />,
        theatreName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            regal
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2K
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,800
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="available" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDButton onClick={() => openPage("/tables/edit-screen")} variant='text' size='small' color='info'>edit</MDButton>
        ),
      },
      {
        name: <Screen image={logoAtlassian} name="Archuna" />,
        theatreName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            ss complex
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2K
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,400
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="available" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDButton onClick={() => openPage("/tables/edit-screen")} variant='text' size='small' color='info'>edit</MDButton>
        ),
      },
      {
        name: <Screen image={logoSpotify} name="Nakula" />,
        theatreName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            rajah
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2K
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,300
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="running" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDButton onClick={() => openPage("/tables/edit-screen")} variant='text' size='small' color='info'>edit</MDButton>
        ),
      },
      {
        name: <Screen image={logoSlack} name="Sakatheva" />,
        theatreName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            rajah
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2K
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,000
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="unavailable" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDButton onClick={() => openPage("/tables/edit-screen")} variant='text' size='small' color='info'>edit</MDButton>
        ),
      },
      {
        name: <Screen image={logoInvesion} name="Karna" />,
        theatreName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            majestic
          </MDTypography>
        ),
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2K
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 2,300
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="available" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDButton onClick={() => openPage("/tables/edit-screen")} variant='text' size='small' color='info'>edit</MDButton>
        ),
      },
    ],
  };
}
