import React from 'react'
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import comingSoonImage from "assets/images/illustrations/coming soon.png";

export default function ComingSoon() {
    return (
        <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ textAlign: 'center' }}
        >
            <img
                src={comingSoonImage}
                alt='Coming Soon'
                style={{
                    maxWidth: '100%',
                    width: '500px',
                    height: 'auto',
                }}
            />
            <MDTypography variant='h6' mb={1} color='info'>This page is under development !</MDTypography>
        </MDBox>
    )
}