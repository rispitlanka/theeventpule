import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { Typography } from '@mui/material';

export default function AddOwner() {
  return (
    <DashboardLayout><DashboardNavbar></DashboardNavbar></DashboardLayout>
  )
}
