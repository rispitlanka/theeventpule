import { Box, Button, Card, Grid, Step, StepButton, Stepper, Typography } from '@mui/material'
import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useState } from 'react'
import ScreenMovieSelection from './screenmovieSelection'
import ShowDateSetup from './showDateSetup'


export default function AddShows() {
  const steps = ['Select Screen & Movie', 'Set Date Range'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleNext = (screenId, movieId) => {
    setSelectedScreenId(screenId);
    setSelectedMovieId(movieId);
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const stepsComponents = [
    () => <ScreenMovieSelection onNext={handleNext} initialScreenId={selectedScreenId} initialMovieId={selectedMovieId} />,
    () => <ShowDateSetup screenId={selectedScreenId} movieId={selectedMovieId} afterShowsSaved={handleShowsSaved} />,
  ];

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleShowsSaved = () => {
    setSelectedScreenId(null);
    setSelectedMovieId(null);
    setCompleted(new Set());
    setActiveStep(0);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <Box sx={{ width: '100%', pl: 2, pr: 2, mt: -3 }}>
                <Stepper nonLinear activeStep={activeStep}>
                  {steps.map((label, index) => (
                    <Step key={label} completed={completed.has(index)} sx={{ ml: 5, mr: 5, }}>
                      <StepButton onClick={() => setActiveStep(index)}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
                <div>
                  {stepsComponents[activeStep] && stepsComponents[activeStep]()}
                  {completed.size === steps.length && (
                    <React.Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                    </React.Fragment>
                  )
                  }
                </div>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  )
}
