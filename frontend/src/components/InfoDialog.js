import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { green, gold, hexToRgb, dialogStyles } from '../util/utils';

const InfoDialog = ({ open, onClose }) => {
    const rgbGreen = hexToRgb(green);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: `rgba(${rgbGreen.join(', ')}, 0.7)`,
                    color: gold,
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)',
                },
            }}
        >
            <DialogTitle style={dialogStyles.title}>Welcome to ForestGuardian</DialogTitle>
            <DialogContent>
                <p style={dialogStyles.paragraph}>
                    <strong>ForestGuardian</strong> is an advanced environmental monitoring system, designed to provide invaluable insights into our natural world.
                </p>
                <p style={dialogStyles.paragraph}>
                    <strong>Explore the following features:</strong>
                </p>
                <ul style={dialogStyles.featuresList}>
                    <li>
                        <strong>Home:</strong> Return to the main screen and navigate effortlessly through the system's features. Your starting point for a seamless and user-friendly experience.
                    </li>
                    <br/>
                    <li>
                        <strong>Info:</strong> Dive deeper into the system's capabilities by clicking the "Info" button and discover more about its functionalities.
                    </li>
                    <br />
                    <li>
                        <strong>Dashboard:</strong> View the current status of the system's birdhouses and their respective parameters. The dashboard provides a quick overview of the system's current state.
                    </li>
                    <br />
                    <li>
                        <strong>Multi-View:</strong> Compare the system's birdhouses and their respective parameters. The multi-view allows you to compare the system's birdhouses and their respective parameters.
                    </li>
                </ul>
                <br/>
                <p style={dialogStyles.valueDescription}>
                    <strong>Value Description:</strong>
                </p>
                <ul style={dialogStyles.valueList}>
                    <li>
                        <strong>PPM:</strong> PPM stands for "parts per million" and is a unit of measurement for the concentration of a substance in a medium.
                    </li>
                    <br />
                    <li>
                        <strong>HPA:</strong> HPA stands for "hectopascal," and it is a unit of measurement for atmospheric pressure.
                    </li>
                    <br />
                    <li>
                        <strong>LUX:</strong> LUX is a unit of measurement for illuminance, which is the total luminous flux incident on a surface per unit area.
                    </li>
                </ul>
            </DialogContent>
        </Dialog>
    );
};

export default InfoDialog;
