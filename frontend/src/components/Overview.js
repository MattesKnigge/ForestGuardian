import ParamCard from "./ParamCard";
import Detail from "./Detail";
import {useState} from "react";

const Overview = ({ sensors }) => {
    const [open, setOpen] = useState(false);
    const [measuredParamId, setMeasuredParamId] = useState("");
    const openDetails = (measured_param_id) => {
        setMeasuredParamId(measured_param_id);
        setOpen(true);
    }

    return (
        <>
            <div className="overview">
                {Object.keys(sensors).map((key) => (
                    <>
                        <ParamCard name={key} data={sensors[key]} onShowDetails={openDetails} />
                        <div className="tree-spacer" />
                        {key === Object.keys(sensors)[0] ?
                            <div className="tree-spacer" />
                            :
                            null
                        }
                    </>
                ))}
            </div>
            <Detail open={open} onClose={() => setOpen(false)} measured_parameter_id={measuredParamId} />
        </>
    );
}


export default Overview;