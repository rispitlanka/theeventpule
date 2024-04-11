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
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";

export default function data() {
  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

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
      { Header: "screen type", accessor: "type", align: "center" },
      { Header: "price", accessor: "budget", align: "center" },
      { Header: "sound", accessor: "sound", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "other", accessor: "action", align: "center" },
    ],

    rows: [
      {
        name: <Project image={LogoAsana} name="Platinum" />,
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            hd
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 2,500
          </MDTypography>
        ),
        status: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            working
          </MDTypography>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        name: <Project image={logoGithub} name="Github" />,
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            hd
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,800
          </MDTypography>
        ),
        status: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            working
          </MDTypography>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        name: <Project image={logoAtlassian} name="Atlassian" />,
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            hd
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,400
          </MDTypography>
        ),
        status: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            off
          </MDTypography>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        name: <Project image={logoSpotify} name="Spotify" />,
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            hd
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,300
          </MDTypography>
        ),
        status: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            working
          </MDTypography>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        name: <Project image={logoSlack} name="Slack" />,
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            hd
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 1,000
          </MDTypography>
        ),
        status: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            disabled
          </MDTypography>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        name: <Project image={logoInvesion} name="Invesion" />,
        type: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            hd
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            LKR 2,300
          </MDTypography>
        ),
        status: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            off
          </MDTypography>
        ),
        sound: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            dolby dts
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
    ],
  };
}
