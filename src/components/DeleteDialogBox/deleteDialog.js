import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

export default function DeleteDialog({ open, onClose, onDelete }) {

    const handleClose = () => {
        onClose();
    };

    const handleDelete = () => {
        onDelete();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to delete this?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

DeleteDialog.propTypes = {
    open: PropTypes.isRequired,
    onClose: PropTypes.isRequired,
    onDelete: PropTypes.func.isRequired,
};
