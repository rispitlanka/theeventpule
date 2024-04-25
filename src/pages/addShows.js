import { ArrowDropDown } from '@mui/icons-material'
import { Box, Button, Card, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material'
import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import ScreenMovieSelection from './screenmovieSelection'
import ShowDateSetup from './showDateSetup'
import MDTypography from 'components/MDTypography'

const steps = ['Select Movie & Screen', 'Set Date', 'Create Show'];

const stepsComponents = [
  () => <ScreenMovieSelection />,
  () => <ShowDateSetup />,
  () => <MDTypography>Finish Setup</MDTypography>,
];

export default function AddShows() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <Box sx={{ width: '100%' }}>
                <Stepper nonLinear activeStep={activeStep}>
                  {stepsComponents.map((StepComponent, index) => (
                    <Step key={index} completed={completed.has(index)}>
                      <StepButton onClick={handleStep(index)}>
                        {steps}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
                <div>
                  {stepsComponents[activeStep] && stepsComponents[activeStep]()}
                  {completedSteps() === totalSteps() ? (
                    <React.Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                        Step {activeStep + 1}
                      </Typography> */}
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext} sx={{ mr: 1 }}>
                          Next
                        </Button>
                        {activeStep !== stepsComponents.length &&
                          (completed.has(activeStep) ? (
                            <Typography variant="caption" sx={{ display: 'inline-block' }}>
                              Step {activeStep + 1} already completed
                            </Typography>
                          ) : (
                            <Button onClick={handleComplete}>
                              {completedSteps() === totalSteps() - 1
                                ? 'Finish'
                                : 'Complete Step'}
                            </Button>
                          ))}
                      </Box>
                    </React.Fragment>
                  )}
                </div>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  )
}
