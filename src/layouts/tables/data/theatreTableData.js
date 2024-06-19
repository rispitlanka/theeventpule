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

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "pages/supabaseClient";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Switch } from "@mui/material";

export default function data() {
  const Screen = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const [theatreData, setTheatreData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const openPage = (route) => {
    navigate(route);
  };

  const fetchTheatreData = async () => {
    try {
      const { data: theatresResponse, error: theatresError } = await supabase
        .from('theatres')
        .select();

      if (theatresError) throw theatresError;

      const theatreIds = theatresResponse.map(theatre => theatre.id);

      const { data: screensResponse, error: screensError } = await supabase
        .from('screens')
        .select('theatreId, screenId:id')
        .in('theatreId', theatreIds);

      if (screensError) throw screensError;

      const screenCounts = screensResponse.reduce((counts, screen) => {
        const { theatreId } = screen;
        counts[theatreId] = counts[theatreId] ? counts[theatreId] + 1 : 1;
        return counts;
      }, {});

      const enhancedTheatres = theatresResponse.map(theatre => ({
        ...theatre,
        screensCount: screenCounts[theatre.id] || 0,
      }));

      setTheatreData(enhancedTheatres);

    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTheatreData();
  }, [])

  const handleChange = async (theatreId, newValue) => {
    try {
      const { error } = await supabase
        .from('theatres')
        .update({ isActive: newValue })
        .eq('id', theatreId);
      if (error) throw error;

      setTheatreData(prevData =>
        prevData.map(theatre =>
          theatre.id === theatreId ? { ...theatre, isActive: newValue } : theatre
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const rows = theatreData ? theatreData.map(theatre => ({
    name: (
      <Screen name={theatre.name} />
    ),
    city: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.city}
      </MDTypography>
    ),
    telephone: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.telephone}
      </MDTypography>
    ),
    screens: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.screensCount}
      </MDTypography>
    ),
    coordinatorName: (
      <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
        {theatre.coordinatorName}
      </MDTypography>
    ),
    coordinatorMobile: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {theatre.coordinatorMobile}
      </MDTypography>
    ),
    status: (
      <Switch checked={theatre.isActive} onChange={e => handleChange(theatre.id, e.target.checked)} />
    ),
    action: (
      <>
        <MDButton onClick={() => openPage(`/theatres/single-theatre/${theatre.id}`)} variant='text' size='medium' color='info'><VisibilityIcon /></MDButton>
        <MDButton onClick={() => openPage(`/theatres/edit-theatre/${theatre.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
      </>
    ),
    
  })) : [{ name: <MDTypography color='warning' fontWeight='bold'>{error}</MDTypography> }];

  return {
    columns: [
      { Header: "name", accessor: "name", width: "30%", align: "left" },
      { Header: "city", accessor: "city", align: "center" },
      { Header: "telephone", accessor: "telephone", align: "center" },
      { Header: "screens", accessor: "screens", align: "center" },
      { Header: "Coordinator Name", accessor: "coordinatorName", align: "center" },
      { Header: "Coordinator Mobile", accessor: "coordinatorMobile", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "actions", accessor: "action", align: "center" },
    ],

    rows: rows,
  };
}