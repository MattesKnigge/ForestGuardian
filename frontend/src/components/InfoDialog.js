import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const InfoDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{style: {backgroundColor: "#1C352E", color: "#F1FAFF"}}}>
            <DialogTitle style={styles.title}>Welcome to ForestGuardian</DialogTitle>
            <DialogContent>
                <p style={styles.paragraph}>
                    <strong>ForestGuardian</strong> is an advanced environmental monitoring system, designed to provide invaluable insights into our natural world.
                </p>
                <p style={styles.paragraph}>
                    Explore the following features:
                </p>
                <ul style={styles.featuresList}>
                    <li><strong>Home:</strong> Return to the main screen and navigate effortlessly through the system's features. Your starting point for a seamless and user-friendly experience.</li>
                    <br/>
                    <li><strong>Info:</strong> Dive deeper into the system's capabilities by clicking the "Info" button and discover more about its functionalities.</li>
                </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={styles.closeButton}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const styles = {
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    paragraph: {
        margin: '16px 0',
    },
    featuresList: {
        listStyleType: 'disc',
        marginLeft: '24px',
        marginTop: '8px',
    },
    closeButton: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '1.3rem',
        color: '#333333',
        backgroundColor: '#8E6F52',
    },
};

export default InfoDialog;
