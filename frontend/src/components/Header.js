import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InfoDialog from "./InfoDialog";
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate } from 'react-router-dom';

const Header = ({ data }) => {
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

    const headerStyle = {
        fontFamily: 'Arial, sans-serif',
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

    const titleStyle = {
        color: '#333333',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-1%',
    };

    return (
        <header className="header" style={headerStyle}>
            <div className="header-content">
                <h1 style={titleStyle}>ForestGuardian</h1>
            </div>
            <div className="header-button">
                <div style={buttonContainerStyle}>
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
            </div>
            <InfoDialog open={isInfoOpen} onClose={handleCloseInfo} />
        </header>
    );
};

export default Header;