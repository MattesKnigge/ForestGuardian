import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'; // Import Typography
import { green, brown, gold } from "../util/utils";

const contributors = [
    { name: 'Niklas Lugowski', githubUsername: 'NiklasLugi' },
    { name: 'Mattes Knigge', githubUsername: 'whosmattes' },
    { name: 'Julian Schöpe', githubUsername: 'j.schoepe' },
    { name: 'Alireza Jalili Baleh', githubUsername: 'Alireza.Jalili' },
    { name: 'Hooman Taghi Zadehi', githubUsername: 'hooman.taghi' },
];

const githubURL = 'https://gitlab.com/';

const handleGitHubLinkClick = (githubUsername) => {
    window.open(`${githubURL}${githubUsername}`, '_blank');
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
};

const rgbGreen = hexToRgb(green);

const Credits = () => {
    const [qrCodeData, setQrCodeData] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const handleGenerateQRCodeClick = (data) => {
        setQrCodeData(data);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const contributorsList = contributors.map((contributor, index) => (
        <span key={index} className="credit-link" onClick={() => handleGitHubLinkClick(contributor.githubUsername)}>
            {contributor.name}{index < contributors.length - 1 ? ', ' : ''}
        </span>
    ));

    return (
        <div className="footer-container">
            <div className="credits-content">
                <p>
                    Built by: {contributorsList} |{' '}
                    <span className="credit-link" onClick={() => handleGitHubLinkClick('whosmattes/sensorknoten-vogelhaus')}>
                        Visit our GitLab
                    </span>{' '}
                    |{' '}
                    <a className="country" href="https://5g-smart-country.de" target="_blank" rel="noreferrer">
                        5G Smart Country
                    </a>{' | '}
                    <span className="country" onClick={() => handleGenerateQRCodeClick(window.location.href)}>
                        Generate QR-Code
                    </span>{' '}
                    | 2023
                </p>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    PaperProps={{
                        style: {
                            backgroundColor: `rgba(${rgbGreen.join(', ')}, 0.7)`,
                            color: gold,
                            borderRadius: '15px',
                            backdropFilter: 'blur(5px)',
                            width: 'fit-content',
                            height: 'fit-content',
                            padding: '1rem',
                            margin: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    }}
                >
                    <DialogTitle>
                        <Typography variant="h6" style={{ fontFamily: 'Dosis', fontSize: '2rem' }}>
                            Your Guardian
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ color: brown, fontFamily: 'Dosis', textAlign: 'center' }}>
                            Scan the code below to share
                        </DialogContentText>
                        <QRCode
                            value={qrCodeData}
                            style={{
                                marginTop: '1rem',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                            }}
                            fgColor={"#E2DFD2"}
                            bgColor={`rgba(${rgbGreen.join(', ')}, 0)`}
                            level={"H"}
                            size={256}
                            imageSettings={{
                                src: '/temperature_average.svg',
                                height: 200,
                                width: 350,
                                excavate: false,
                            }}
                        />
                    </DialogContent>
                    <Button onClick={handleCloseDialog} style={{ color: brown, fontFamily: 'Bebas Neue' }}>Close</Button>
                </Dialog>
            </div>
        </div>
    );
};

export default Credits;
