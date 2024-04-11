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

export default function data() {
  const Owner = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Theatres = ({ name, location }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{location}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "owner name", accessor: "ownerName", width: "45%", align: "left" },
      { Header: "theatre", accessor: "theatre", align: "left" },
      { Header: "owner contact", accessor: "ownerContact", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        ownerName: <Owner image={team2} name="John Michael" email="john@creative-tim.com" />,
        theatre: <Theatres name="Pvr" location="colombo" />,
        ownerContact: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            0712345678
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Manage
          </MDTypography>
        ),
      },
      {
        ownerName: <Owner image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
        theatre: <Theatres name="savoy" location="colombo" />,
        ownerContact: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            0721345678
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Manage
          </MDTypography>
        ),
      },
      {
        ownerName: <Owner image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
        theatre: <Theatres name="concord" location="colombo" />,
        ownerContact: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            0731245678
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Manage
          </MDTypography>
        ),
      },
      {
        ownerName: <Owner image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
        theatre: <Theatres name="regal" location="jaffna" />,
        ownerContact: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            0741235678
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Manage
          </MDTypography>
        ),
      },
      {
        ownerName: <Owner image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
        theatre: <Theatres name="rajah" location="jaffna" />,
        ownerContact: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            0751234678
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Manage
          </MDTypography>
        ),
      },
      {
        ownerName: <Owner image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
        theatre: <Theatres name="ss complex" location="pointpedro" />,
        ownerContact: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            0761234578
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Manage
          </MDTypography>
        ),
      },
    ],
  };
}
