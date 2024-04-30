/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
 * =========================================================
 * Material Dashboard 2 React - v2.2.0
 * =========================================================
 *
 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)
 *
 * Coded by www.creative-tim.com
 *
 * =========================================================
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Icon } from '@iconify/react';
import languageIcon from '@iconify-icons/ion/language';
import { supabase } from "pages/supabaseClient";

export default function data() {

    const LanguageIcon = ({ name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <Icon icon={languageIcon} width={24} height={24} />
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const [languagesData, setLanguagesData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getLanguages();
    }, []);

    const getLanguages = async () => {
        try {
            const { data, error } = await supabase.from('languages').select('*');
            if (error) throw error;
            if (data != null) {
                setLanguagesData(data);
                console.log(data);
            }
        } catch (error) {
            console.error('Error fetching languages:', error.message);
        }
    };

    async function deleteLanguage(language) {
        try {
            const response = await supabase.from("languages").delete().eq("id", language.id);
            if (response.error) throw response.error;
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }

    const rows = languagesData ? languagesData.map(language => ({
        language_name: <LanguageIcon name={language.language_name} />,
        action: (
            <MDButton onClick={() => navigate(`/languages/edit-languages/${language.id}`)} variant='text' size='small' color='info'>edit</MDButton>
        ),
        action2: (
            <MDButton onClick={() => deleteLanguage(language)} variant='text' size='small' color='info'>delete</MDButton>
        ),
    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>No Languages found</MDTypography> }];

    return {
        columns: [
            { Header: "Language", accessor: "language_name", width: "50%", align: "left" },
            { Header: "Edit", accessor: "action", align: "center" },
            { Header: "Delete", accessor: "action2", align: "center" },
        ],
        rows: rows,
    };
}
