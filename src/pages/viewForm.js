import { Card } from '@mui/material'
import DynamicForm from 'components/FormSubmission/dynamicForm'
import MDTypography from 'components/MDTypography'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function ViewForm() {
  const location = useLocation();
  const { formFieldData, id } = location.state || { formFieldData: [] };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 2, mb: 2 }}>
        <MDTypography variant='h5' mb={1} fontWeight='medium'>Register For The Event</MDTypography>
        {formFieldData.length > 0 ? (
          <DynamicForm fields={formFieldData} eventId={id} />)
          :
          <MDTypography variant='h6' mb={1} sx={{ textAlign: 'center' }}>-Unavailable-</MDTypography>
        }
      </Card>
      <Footer />
    </DashboardLayout>
  )
}