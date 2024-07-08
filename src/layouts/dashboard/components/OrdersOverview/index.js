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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import { supabase } from "pages/supabaseClient";
import { useEffect, useState } from "react";

function OrdersOverview() {

  const [theatres, setTheatres] = useState();

  const fetchTheatres = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_last_five_theatres');
      if (data) {
        setTheatres(data);
      }
      if (error) throw error;
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTheatres();
  }, [])

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Recent Theatres
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            with latest ticket&apos;s booked time
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {theatres && theatres.length >0 && theatres.map((theatre => (
          <TimelineItem
            key={theatre.id}
            color="dark"
            icon="theaters"
            title={theatre.theatrename}
            dateTime={theatre.last_booking_date || "No Bookings"}
          />
        )))}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
