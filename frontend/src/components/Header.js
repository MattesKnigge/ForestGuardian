import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InfoDialog from "./InfoDialog";
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate, useLocation } from 'react-router-dom';
import Typography from "@mui/material/Typography";

const Header = ({ data }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isToggleOn, setIsToggleOn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const buttonStyle = {
        backgroundColor: '#8E6F52',
        marginLeft: '.5rem',
        borderRadius: '20%',
        color: '#333333',
        padding: '.5rem',
        transition: 'background-color 0.3s, transform 0.2s',
        '&:hover': {
            backgroundColor: '#6E4A33',
            transform: 'scale(0.95) rotate(10deg)',
        },
    };

    const buttonContainerStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'default',
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleInfoClick = () => {
        setIsInfoOpen(true);
    };

    const handleCloseInfo = () => {
        setIsInfoOpen(false);
    };

    const handleToggleChange = () => {
        setIsToggleOn(!isToggleOn);
        if (!isToggleOn) {
            console.log('Dashboard View ON');
            //TODO: change to dashboard view
        } else {
            console.log('Dashboard View OFF');
            //TODO: change to dashboard view
        }
    };

    const titleStyle = {
        color: '#333333',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-1%',
    };

    const isDashboardVisible = location.pathname.includes("/bird-house/");

    return (
        <header className="header" style={headerStyle}>
            <div className="header-content">
                <h1 style={titleStyle}>ForestGuardian</h1>
            </div>
            <div className="header-button">
                {isDashboardVisible && (
                    <div style={buttonContainerStyle}>
                        <FormControlLabel
                            control={<Switch Switch checked={isToggleOn} onChange={handleToggleChange} style={{ color: "#8E6F52" }} />}
                            label={
                            <Typography variant="body2" style={{fontFamily: 'Dosis, sans-serif', color: '#2E3B4E', fontSize: '1.3em', fontWeight: 'bold'}}
                            > Dashboard <
                            /Typography>}
                            labelPlacement="start"
                            style={{ marginRight: '1rem' }}
                        />
                    </div>
                )}
                <IconButton
                    sx={buttonStyle}
                    onClick={handleHomeClick}
                >
                    <HomeRoundedIcon />
                </IconButton>
                <IconButton
                    sx={buttonStyle}
                    onClick={handleInfoClick}
                >
                    <QuestionMarkRoundedIcon />
                </IconButton>
            </div>
            <InfoDialog open={isInfoOpen} onClose={handleCloseInfo} />
        </header>
    );
};

export default Header;
