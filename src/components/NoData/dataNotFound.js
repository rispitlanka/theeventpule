import MDBox from 'components/MDBox'
import React from 'react'
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';

export default function DataNotFound({ message, image }) {
    return (
        <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ textAlign: 'center' }}
        >
            <img
                src={image}
                alt='No Data Found'
                style={{
                    maxWidth: '100%',
                    width: '500px',
                    height: 'auto',
                }}
            />
            <MDTypography variant='h6' mb={1} color='warning'>{message}</MDTypography>
        </MDBox>
    )
}

DataNotFound.propTypes = {
    message: PropTypes.isRequired,
    image: PropTypes.isRequired
}
