import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import React, { useState } from 'react'
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from "pages/supabaseClient";

export default function PasswordResetModel({ open, onClose }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClose = () => {
        onClose();
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setShowPassword(false);
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        try {
            const { data, error } = await supabase.auth.updateUser({ password: confirmPassword });
            if (data) {
                toast.info('Password Has Been Changed!');
                handleClose();
            }
            if (error) alert("There was an error updating your password.");
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
        <>
            <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <MDBox pt={4} pb={3} px={3} component="form" role="form">
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
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleResetPassword} disabled={newPassword === '' || confirmPassword === '' || newPassword !== confirmPassword} color="primary">Reset</Button>
                </DialogActions>
            </Dialog>
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
        </>
    );
}

PasswordResetModel.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
