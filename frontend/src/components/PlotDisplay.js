import {useState} from "react";
import Button from "@mui/material/Button";
import Detail from "./Detail";

const PlotDisplay = ({ sensors }) => {
    const [selected, setSelected] = useState("");

    return (
        <div className="plot-display-content">
            <div className="gauge-container">
                {Object.keys(sensors).map((key) => (
                    <div>
                        <h3>{key}</h3>
                        <div>value:{sensors[key].value} timestamp: {sensors[key].timestamp} min: {sensors[key].min} max:{sensors[key].max}</div>
                        <Button onClick={() => setSelected(key)}>Details</Button>
                        {selected === key?
                            <Detail measured_parameter_id={sensors[key].id} />
                            : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlotDisplay;
