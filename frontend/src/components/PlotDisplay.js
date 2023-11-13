import {useState} from "react";
import Button from "@mui/material/Button";
import Detail from "./Detail";
import GaugeComponent from "./GaugeComponent";

const PlotDisplay = ({ sensors }) => {
    const [selected, setSelected] = useState("");

    return (
        <div className="plot-display-content">
            <div className="gauge-container">
                {Object.keys(sensors).map((key) => (
                    <div>
                        <h3>{key}</h3>
                        <div>value:{sensors[key].value} timestamp: {sensors[key].timestamp} min: {sensors[key].min} max:{sensors[key].max}</div>
                        {key === "temperature"?
                            <GaugeComponent data={sensors[key]} arcs={[20/67, 35/67, 12/67]} colours={['#2ccce1', '#4cda15', '#EA4228']} unit={"°C"} />
                        : key === "humidity"?
                            <GaugeComponent data={sensors[key]} unit={"%"} />
                        : key === "pressure"?
                            <GaugeComponent data={sensors[key]} unit={"hPa"} />
                        : key === "co2"?
                            <GaugeComponent data={sensors[key]} unit={"ppm"} />
                        : null}

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
