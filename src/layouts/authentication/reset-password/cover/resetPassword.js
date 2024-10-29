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

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { supabase } from "pages/supabaseClient";
import { ToastContainer, toast } from 'react-toastify';

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        try {
            const { data, error } = await supabase.auth.updateUser({ password: confirmPassword });
            if (data) {
                let { error } = await supabase.auth.signOut();
                if (error) alert("There was an error in signing out your account.");
                toast.info('Password Has Been Changed!');
                localStorage.removeItem('userEmail');
                setTimeout(() => {
                    navigate('/authentication/sign-in');
                }, 1000);
            }
            if (error) {
                alert("There was an error updating your password.");
                console.log("There was an error updating your password.", error);
            }
        } catch (error) {
            console.log(error, 'Error in updating password');
        }
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        if (confirmPassword && e.target.value !== confirmPassword) {
            setPasswordError('Passwords do not match.');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (newPassword && e.target.value !== newPassword) {
            setPasswordError('Passwords do not match.');
        } else {
            setPasswordError('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <BasicLayout coverHeight="50vh" image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    mx={2}
                    mt={-3}
                    py={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
                        Reset Password
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={4}>
                            <MDInput
                                type={showPassword ? 'text' : 'password'}
                                label="New Password"
                                fullWidth
                                value={newPassword}
                                onChange={handlePasswordChange}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </MDBox>
                        <MDBox mb={1}>
                            <MDInput
                                type={showPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                fullWidth
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </MDBox>
                        {passwordError && (
                            <MDBox mb={2}>
                                <MDTypography color="error">{passwordError}</MDTypography>
                            </MDBox>
                        )}
                        <MDBox mt={6} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={handleResetPassword}
                                disabled={newPassword === '' || confirmPassword === '' || newPassword !== confirmPassword}
                            >
                                Reset
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </BasicLayout>
    );
}

export default ResetPassword;
