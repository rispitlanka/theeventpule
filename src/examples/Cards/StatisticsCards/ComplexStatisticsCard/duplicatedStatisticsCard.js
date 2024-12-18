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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ModifiedStatisticsCard({ color, title, icon }) {
    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" pt={1} px={2} pb={2}>
                <MDBox textAlign="right" lineHeight={1.25}>
                    <MDTypography variant="h4">
                        {title}
                    </MDTypography>
                </MDBox>
                <MDBox
                    variant="gradient"
                    bgColor={color}
                    color={color === "light" ? "dark" : "white"}
                    coloredShadow={color}
                    borderRadius="xl"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="4rem"
                    height="4rem"
                    mt={-3}
                >
                    <Icon fontSize="medium" color="inherit">
                        {icon}
                    </Icon>
                </MDBox>
            </MDBox>
            {/* <Divider /> */}
            {/* <MDBox pb={2} px={2}>
                <MDTypography component="p" variant="button" color="text" display="flex">
                    <MDTypography
                        component="span"
                        variant="button"
                        fontWeight="bold"
                        color={percentage.color}
                    >
                        {percentage.amount}
                    </MDTypography>
                    &nbsp;{percentage.label}
                </MDTypography>
            </MDBox> */}
        </Card>
    );
}

// Setting default values for the props of ModifiedStatisticsCard
ModifiedStatisticsCard.defaultProps = {
    color: "info",
};

// Typechecking props for the ModifiedStatisticsCard
ModifiedStatisticsCard.propTypes = {
    color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "light",
        "dark",
    ]),
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
};

export default ModifiedStatisticsCard;
