import DynamicForm from 'components/FormSubmission/dynamicForm'
import Footer from 'examples/Footer'
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import { useParams } from 'react-router-dom';

export default function RegisterEvent() {
    const { eventId } = useParams();
    const [formFieldData, setFormFieldData] = useState([]);

    const fetchRegistrationFormField = async () => {
        try {
            const { data, error } = await supabase.from('registrationForm').select('*').eq('eventId', eventId);
            if (data) {
                setFormFieldData(data);
                console.log('form data', data);
            }
            if (error) throw error;
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchRegistrationFormField();
    }, [eventId])

    return (
        <>
            {formFieldData && formFieldData.length > 0 &&
                <DynamicForm sx={{ m: 2 }} fields={formFieldData} />
            }
            <Footer />

        </>
    )
}