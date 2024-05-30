import DynamicForm from 'components/FormSubmission/dynamicForm'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function ViewForm() {
    const location = useLocation();
    const {formFieldData, id} = location.state || { formFieldData: [] };
  return (
    <DashboardLayout>
        <DashboardNavbar/>
        <DynamicForm fields={formFieldData} eventId={id}/>
        <Footer/>
        </DashboardLayout>
  )
}