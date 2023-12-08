import ParamCard from "./ParamCard";
import Detail from "./Detail";
import React, {useState} from "react";
import {gold} from '../util/utils';

const Overview = ({ title, data }) => {
    const [open, setOpen] = useState(false);
    const [measuredParamId, setMeasuredParamId] = useState("");
    const openDetails = (measured_param_id) => {
        setMeasuredParamId(measured_param_id);
        setOpen(true);
    }

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
            {data['image_url'] !== '' ?
                <img src={`/sensorknoten-vogelhaus${data['image_url']}`} alt='location' />
            :null}
            <Detail open={open} onClose={() => setOpen(false)} measured_parameter_id={measuredParamId} />
        </div>
    );
}


export default Overview;