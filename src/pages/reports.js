import ComingSoon from 'components/UnderDevelopment/comingSoon'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'

export default function Reports() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ComingSoon />
            <Footer />
        </DashboardLayout>
    )
}