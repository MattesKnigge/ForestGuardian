import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InfoDialog from "./InfoDialog";
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DynamicFeedRoundedIcon from '@mui/icons-material/DynamicFeedRounded';import { useNavigate } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import {brown, green} from "../util/utils";

const Header = ({ onToggleClick, toggleOn, showToggle = false, weather }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const navigate = useNavigate();

    const buttonStyle = {
        backgroundColor: '#8E6F52',
        marginLeft: '.1rem',
        marginRight: '1rem',
        borderRadius: '20%',
        color: '#333333',
        padding: '0.5rem',
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

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleInfoClick = () => {
        setIsInfoOpen(true);
    };

    const handleCloseInfo = () => {
        setIsInfoOpen(false);
    };

    const handleMenuClick = () => {
        navigate('/bird-house/min,random,max');
    }

    const titleStyle = {
        color: green,
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-1%',
        padding: '0 1rem',
    };

    const weatherDescriptionStyle = {
        marginLeft: 'auto',
        marginRight: '2rem',
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1 style={titleStyle}>ForestGuardian</h1>
            </div>
            <div className="weather_description" style={weatherDescriptionStyle}>
                {weather ? "Weather Description: " + weather.name : null}

            </div>
            <div className="header-button">
                {showToggle && (
                    <div style={buttonContainerStyle}>
                        <FormControlLabel
                            control={<Switch Switch checked={toggleOn} onChange={onToggleClick} style={{ color: brown }} title={'Toggle dashboard view'} />}
                            label={
                                <Typography variant="body2" style={{fontFamily: 'Dosis, sans-serif', color: green, fontSize: '1.3em', fontWeight: 'bold'}}>
                                    Dashboard
                                </Typography>
                            }
                            labelPlacement="start"
                            style={{ marginRight: '1rem' }}
                        />
                    </div>
                )}
                <IconButton
                    sx={buttonStyle}
                    onClick={handleHomeClick}
                    title={'Go to home page'}
                >
                    <HomeRoundedIcon />
                </IconButton>
                <IconButton
                    sx={buttonStyle}
                    onClick={handleInfoClick}
                    title={'Show information dialog'}
                >
                    <QuestionMarkRoundedIcon />
                </IconButton>
                {/*TODO: display menu with all birdhouses to choose from*/}
                <IconButton
                    sx={buttonStyle}
                    onClick={handleMenuClick}
                    title={'Show multi-view'}
                >
                    <DynamicFeedRoundedIcon />
                </IconButton>
            </div>
            <InfoDialog open={isInfoOpen} onClose={handleCloseInfo} />
        </header>
    );
};

export default Header;
