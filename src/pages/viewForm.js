import { Card } from '@mui/material'
import DynamicForm from 'components/FormSubmission/dynamicForm'
import MDTypography from 'components/MDTypography'
import DataNotFound from 'components/NoData/dataNotFound'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import { useLocation } from 'react-router-dom'
import noForms from "assets/images/illustrations/noForms.png";

export default function ViewForm() {
  const location = useLocation();
  const { formFieldData, id } = location.state || { formFieldData: [] };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 2, mb: 2, mt: 2 }}>
        <MDTypography variant='h5' mb={1} fontWeight='medium'>Register For The Event</MDTypography>
        {formFieldData.length > 0 ? (
          <DynamicForm fields={formFieldData} eventId={id} />)
          :
          <DataNotFound message={'No Forms Available !'} image={noForms}/>
        }
      </Card>
      <Footer />
    </DashboardLayout>
  )
}