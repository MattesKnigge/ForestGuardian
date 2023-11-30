import ParamCard from "./ParamCard";
import Detail from "./Detail";
import {useState} from "react";

const Overview = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [measuredParamId, setMeasuredParamId] = useState("");
    const openDetails = (measured_param_id) => {
        setMeasuredParamId(measured_param_id);
        setOpen(true);
    }

    return (
        <>
            <div className="overview">
                {Object.keys(data.values).map((key) => (
                    <>
                        <ParamCard name={key} data={data.values[key]} onShowDetails={openDetails} />
                        <div className="tree-spacer" />
                        {key === Object.keys(data.values)[0] ?
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