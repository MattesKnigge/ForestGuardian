import ParamCard from "./ParamCard";
import Detail from "./Detail";
import React, {useState} from "react";
import {gold} from '../util/utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';


const Overview = ({ title, data }) => {
    const [open, setOpen] = useState(false);
    const [measuredParamId, setMeasuredParamId] = useState("");
    const [showImage, setShowImage] = useState(false);
    const openDetails = (measured_param_id) => {
        setMeasuredParamId(measured_param_id);
        setOpen(true);
    }
    const toggleImage = () => {
        setShowImage(!showImage);
    };

    return (
        <div className="overview">
            {title !== '' ?
                <h1 style={{fontFamily: 'Dosis, sans-serif', color: gold}}>{data.display_name}</h1>
                :null}
            <div style={{fontFamily: 'Dosis, sans-serif', color: gold}}>
                {data.description}
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
                    <div className="camera-picture" style={{ position: 'relative', height: showImage ? 'auto' : '150px' }}>
                        <div className="image-text">Take a look inside</div>
                        {showImage && (
                            <img
                                src={`/sensorknoten-vogelhaus${data['image_url']}`}
                                alt='location'
                                style={{ maxWidth: '100%', borderRadius: '3px' }}
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
        </div>
    );
}


export default Overview;