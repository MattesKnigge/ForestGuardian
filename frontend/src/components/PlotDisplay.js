import React, { useState } from "react";
import Button from "@mui/material/Button";
import Detail from "./Detail";
import GaugeComponent from "./GaugeComponent";

const PlotDisplay = ({ sensors }) => {
    const [selected, setSelected] = useState("");

    const toggleDetails = (key) => {
        setSelected((prevSelected) => (prevSelected === key ? "" : key));
    };
    const sensorNames = {
        temperature: "Temperature",
        humidity: "Humidity",
        pressure: "Pressure",
        air_quality: "Air Quality (CO2)",
    };

    return (
        <div className="plot-display-content">
            <div className="gauge-container">
                {Object.keys(sensors).map((key) => (
                    <div key={key}>
                        <h3 style={{ color: '#8E6F52' }}>{sensorNames[key] || key}</h3>
                        <div>
                            {/* value: {sensors[key].value} timestamp: {sensors[key].timestamp} min: {sensors[key].min} max:{sensors[key].max} */}
                        </div>
                        {key === "temperature" ? (
                            <GaugeComponent data={sensors[key]} arcs={[20 / 67, 35 / 67, 12 / 67]} colours={["#EA4228", "#4cda15", "#EA4228"]} unit={" °C"} />
                        ) : key === "humidity" ? (
                            <GaugeComponent data={sensors[key]} colours={["#EA4228", "#4cda15", "#4cda15"]} unit={" %"} />
                        ) : key === "pressure" ? (
                            <GaugeComponent data={sensors[key]} padding={0} nrLevels={20} colours={["#F5D6BA", "#B07C9E"]} unit={" hPa"} />
                        ) : key === "air_quality" ? (
                            <GaugeComponent data={sensors[key]} colours={["#4cda15", "#F8C630", "#EA4228"]} unit={" ppm"} />
                        ) : null}

                        <Button style={{color: "#8E6F52"}} onClick={() => toggleDetails(key)}>{selected === key ? "Hide Details" : "Show Details"}</Button>
                        {selected === key ? <Detail measured_parameter_id={sensors[key].id} /> : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlotDisplay;
