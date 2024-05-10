import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { supabase } from 'pages/supabaseClient'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

export default function ShowsOnDate(date) {
    const eqDate = date.date;
    const [shows, setShows] = useState();

    const fetchShowsOnDate = async () => {
        try {
            const { data, error } = await supabase.from('shows').select('*').eq('date', eqDate);
            if (data) {
                setShows(data);
                console.log(data);
            }
            if (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log('Error in fetching shows', error)
        }
    }

    useEffect(() => {
        fetchShowsOnDate();
    }, [date])

    return (
        <>
            <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    Show Details
                </MDTypography>
                <MDBox>
                    <MDTypography></MDTypography>
                </MDBox>
            </MDBox>
        </>
    )
}
ShowsOnDate.prototype = {
    date: PropTypes.isRequired,
};
