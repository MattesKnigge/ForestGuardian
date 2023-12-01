import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InfoDialog from "./InfoDialog";
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate } from 'react-router-dom';
import Typography from "@mui/material/Typography";

const Header = ({ onToggleClick, toggleOn, showToggle = false }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const navigate = useNavigate();

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

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleInfoClick = () => {
        setIsInfoOpen(true);
    };

    const handleCloseInfo = () => {
        setIsInfoOpen(false);
    };

    const titleStyle = {
        color: '#333333',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-1%',
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1 style={titleStyle}>ForestGuardian</h1>
            </div>
            <div className="header-button">
                {showToggle && (
                    <div style={buttonContainerStyle}>
                        <FormControlLabel
                            control={<Switch Switch checked={toggleOn} onChange={onToggleClick} style={{ color: "#8E6F52" }} />}
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
