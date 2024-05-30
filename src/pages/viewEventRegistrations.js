import MDBox from 'components/MDBox';
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ViewEventRegistrations() {
    const { id } = useParams();
    const [eventRegistrationData, setEventRegistrationData] = useState([]);

    const fetchEventRegistrations = async () => {
        try {
            const { data, error } = await supabase.from('eventRegistrations').select('*').in('eventId', id);
            if (data) {
                setEventRegistrationData(data);
                console.log('event data', data);
            }

            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchEventRegistrations();
    }, [id])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox>
                {eventRegistrationData && eventRegistrationData.length > 0 && eventRegistrationData.map((item, index) => {
                    const details = JSON.parse(item.details);

                    return (
                        <div key={index}>
                            {Object.entries(details).map(([key, value]) => (
                                <div key={key}>
                                    {key}: {value}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}
