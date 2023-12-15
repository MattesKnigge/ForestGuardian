import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InfoDialog from "./InfoDialog";
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DynamicFeedRoundedIcon from '@mui/icons-material/DynamicFeedRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import Typography from "@mui/material/Typography";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useNavigate } from 'react-router-dom';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { brown, green } from "../util/utils";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Header = ({ onToggleClick, toggleOn, showToggle = false, weather }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
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
    };

    const handleMapClick = () => {
        setIsMapDialogOpen(true);
    };

    const handleMapDialogClose = () => {
        setIsMapDialogOpen(false);
    };

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

    // TODO: Get marker coordinates from backend
    const markerLat = 52.180678;
    const markerLng = 10.556785;

    const mapContainerStyle = {
        height: '500px',
        width: '100%',
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
                            control={<Switch checked={toggleOn} onChange={onToggleClick} style={{ color: brown }} title={'Toggle dashboard view'} />}
                            label={
                                <Typography variant="body2" style={{ fontFamily: 'Dosis, sans-serif', color: green, fontSize: '1.3em', fontWeight: 'bold' }}>
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
                <IconButton
                    sx={buttonStyle}
                    onClick={handleMenuClick}
                    title={'Show multi-view'}
                >
                    <DynamicFeedRoundedIcon />
                </IconButton>
                {window.location.href.includes("bird-house") &&
                    <IconButton
                        sx={buttonStyle}
                        onClick={handleMapClick}
                        title={'Show Birdhouse Map'}
                    >
                        <PublicRoundedIcon />
                    </IconButton>
                }
            </div>
            <InfoDialog open={isInfoOpen} onClose={handleCloseInfo} />

            <Dialog open={isMapDialogOpen} onClose={handleMapDialogClose} maxWidth="lg" fullWidth>
                <DialogContent>
                    <div id="mapDialog" style={mapContainerStyle}>
                        <MapContainer center={[markerLat, markerLng]} zoom={17} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[markerLat, markerLng]}>
                                <Popup>
                                    Position of your ForestGuardian.
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
};

export default Header;
