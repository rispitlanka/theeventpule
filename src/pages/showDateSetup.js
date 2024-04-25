import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MDBox from 'components/MDBox'
import { Grid } from '@mui/material';
import MDTypography from 'components/MDTypography';

export default function ShowDateSetup() {
    return (
        <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
            <MDBox p={3} >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker label="Select Start Date" />
                    </DemoContainer>
                </LocalizationProvider>
            </MDBox>
            <MDBox p={3}>
                <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Select End Date" />
                        </DemoContainer>
                    </LocalizationProvider>
                    <FormControlLabel sx={{ ml: 1 }} control={<Checkbox />} label="Do not set end date" />
                </Grid>
            </MDBox>
        </Grid>
    )
}
