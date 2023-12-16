import ParamCard from "./ParamCard";
import Detail from "./Detail";
import React, {useState} from "react";
import {gold} from '../util/utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
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
const Overview = ({ title, data }) => {
    const [open, setOpen] = useState(false);
    const [measuredParamId, setMeasuredParamId] = useState("");
    const [showImage, setShowImage] = useState(false);
    const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);


    const mapButtonStyle = {
        backgroundColor: '#8E6F52',
        borderRadius: '20%',
        color: '#333333',
        padding: '1rem',
        marginLeft: '1rem',
        marginRight: '1rem',
        height: 'fit-content',
        display: 'flex',
        fontSize: '2rem !important',
        justifyContent: 'center',
        transition: 'background-color 0.3s, transform 0.2s',
        '&:hover': {
            backgroundColor: '#6E4A33',
            transform: 'scale(0.95) rotate(10deg)',
        },
    };

    const openDetails = (measured_param_id) => {
        setMeasuredParamId(measured_param_id);
        setOpen(true);
    }
    const toggleImage = () => {
        setShowImage(!showImage);
    };
    const handleMapClick = () => {
        setIsMapDialogOpen(true);
    };

    const handleMapDialogClose = () => {
        setIsMapDialogOpen(false);
    };
    const mapContainerStyle = {
        height: '40rem',
        width: '100%',
    };

    return (
        <div className="overview">
            {title !== '' ?
                <h1 style={{fontFamily: 'Dosis, sans-serif', color: gold}}>{data.display_name}</h1>
                :null}

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem'}}>
            <div style={{
                fontFamily: 'Dosis, sans-serif',
                color: 'var(--gold)',
                fontSize: '1.5rem',
                fontWeight: '500',
                padding: '.7em',
                backdropFilter: 'blur(3px)',
                borderRadius: '10px',
                textAlign: 'center',
                width: 'calc(45ch - 2em)',
                boxSizing: 'border-box',
                marginLeft: '1rem',
            }}>
                {data.description}

            </div>
                {data.lat ?
            <IconButton
                sx={mapButtonStyle}
                onClick={handleMapClick}
                title={'Show Birdhouse Map'}
            >
                <PublicRoundedIcon />
            </IconButton> : null}
            </div>
            <div className={`overview-grid ${title !== '' ? 'overview-one-col' : 'overview-two-col'}`}>
                {Object.keys(data.values).map((key) => (
                    <>
                        <ParamCard name={key} data={data.values[key]} onShowDetails={openDetails} />
                        {title === '' ?
                            <div className="tree-spacer" />
                        :null}
                        {title === '' && key === Object.keys(data.values)[0] ?
                            <div className="tree-spacer" />
                        :null}
                    </>
                ))}
            </div>
            {
                data['image_url'] !== '' && (
                    <div className="camera-picture" style={{ position: 'relative', height: showImage ? 'auto' : '150px', marginBottom: "15px" }}>
                        <div className="image-text">Take a look inside</div>
                        {showImage && (
                            <img
                                src={`/sensorknoten-vogelhaus${data['image_url']}`}
                                alt='B I R B .'
                                style={{ maxWidth: '35%', borderRadius: '100%' }}
                            />
                        )}
                        <IconButton
                            onClick={toggleImage}
                            style={{ position: 'absolute', top: '5px', right: '10px' }}
                        >
                            {showImage ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </div>
                )
            }
            <Detail open={open} onClose={() => setOpen(false)} measured_parameter_id={measuredParamId} />
            <Dialog open={isMapDialogOpen} onClose={handleMapDialogClose} maxWidth="lg" fullWidth>
                <DialogContent>
                    <div id="mapDialog" style={mapContainerStyle}>
                        <MapContainer center={[data.lat, data.long]} zoom={17} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[data.lat, data.long]}>
                                <Popup>
                                    Position of your ForestGuardian.
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


export default Overview;