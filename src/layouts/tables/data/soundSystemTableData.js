

/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from "pages/supabaseClient";
import { Icon } from '@iconify/react';
import soundOneIcon from '@iconify-icons/icon-park-twotone/sound-one';
import { Switch } from "@mui/material";

export default function data() {
    const SoundIcon = ({ name }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <Icon icon={soundOneIcon} width={24} height={24} />
            <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );
    const [soundSystemData, setSoundSystemData] = useState(null);
    const navigate = useNavigate();
    const openPage = (route) => {
        navigate(route);
    };

    useEffect(() => {
        getSoundSystem();
    }, []);

    const getSoundSystem = async () => {
        try {
            const { data, error } = await supabase
                .from('soundsystem_types')
                .select('*');

            if (error) throw error;
            if (data != null) {
                setSoundSystemData(data);
                console.log(data)
            }

        } catch (error) {
            console.error('Error fetching sound system types:', error.message);
        }
    };
    // async function deleteSoundSystem(soundsys) {
    //     try {
    //         const response = await supabase
    //             .from("soundsystem_types")
    //             .delete()
    //             .eq("id", soundsys.id);

    //         if (response.error) throw response.error;
    //         window.location.reload();
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // }

    const handleChange = async (id, newValue) => {
        try {
            const { error } = await supabase
                .from('soundsystem_types')
                .update({ isActive: newValue })
                .eq('id', id);
            if (error) throw error;

            setSoundSystemData(prevData =>
                prevData.map(system =>
                    system.id === id ? { ...system, isActive: newValue } : system
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const rows = soundSystemData ? soundSystemData.map(soundsys => ({
        soundsystem_type: <SoundIcon name={soundsys.soundsystem_type} />,
        status: (
            <Switch checked={soundsys.isActive} onChange={e => handleChange(soundsys.id, e.target.checked)} />
        ),
        action: (
            <MDButton onClick={() => openPage(`/soundsystem/edit-soundsystem/${soundsys.id}`)} variant='text' size='medium' color='info'><EditIcon /></MDButton>
        ),
        // action2: (
        //     <MDButton onClick={() => deleteSoundSystem(soundsys)} variant='text' size='small' color='info'>delete</MDButton>
        // ),

    })) : [{ name: <MDTypography color='warning' fontWeight='bold'>No sound system types founded</MDTypography> }];

    return {
        columns: [
            { Header: "Sound Systems ", accessor: "soundsystem_type", width: "50%", align: "left" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "Action", accessor: "action", align: "center" },
            // { Header: "Delete", accessor: "action2", align: "center" },
        ],

        rows: rows,
    };
}

