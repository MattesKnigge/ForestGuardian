import ParamCard from "./ParamCard";
import Detail from "./Detail";
import React, {useEffect, useState} from "react";
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
import HideValuesDialog from "./HideValuesDialog";


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
    const [showValuesVisibility, setShowValuesVisibility] = useState(false);
    const [valueVisibility, setValueVisibility] = useState( { 'value': true, });

    useEffect(() => {
        let dict = {}
        Object.keys(data.values).map((key) => ( dict[key] = true ));
        setValueVisibility(dict);
    }, [data]);

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
            <div style={{ color: gold}}>
                <IconButton
                    onClick={() => setShowValuesVisibility(true)}
                    title={'Show Value List'}
                >
                    <PublicRoundedIcon />
                </IconButton>
            </div>
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
                        {valueVisibility[key] ?
                            <>
                                <ParamCard name={key} data={data.values[key]} onShowDetails={openDetails} />
                                {title === '' ?
                                    <div className="tree-spacer" />
                                :null}
                                {title === '' && key === Object.keys(data.values)[0] ?
                                    <div className="tree-spacer" />
                                :null}
                            </>
                        : null}
                    </>
                ))}
            </div>
            {
                data['image_url'] !== '' && (
                    <div className="camera-picture" style={{ marginBottom: '15px' }}>
                        <IconButton
                            onClick={toggleImage}
                            style={{marginTop: '15px'}}
                        >
                            {showImage ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        {!showImage && (<div className="image-text">Take a look inside</div>)}
                        {showImage && (
                            <img
                                src={`/sensorknoten-vogelhaus${data['image_url']}`}
                                alt='B I R B .'
                                style={{ maxWidth: '20%', marginTop: '40px' }}
                            />
                        )}
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
            {showValuesVisibility?
                <>
                    <HideValuesDialog open={showValuesVisibility} onClose={() => setShowValuesVisibility(false)} valueVisibility={valueVisibility} onChange={setValueVisibility}></HideValuesDialog>
                </>
                : null
            }
        </div>
    );
}


export default Overview;