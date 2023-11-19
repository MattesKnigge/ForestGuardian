import React from "react";
import GaugeComponent from "./GaugeComponent";
import ChartComponent from "./ChartComponent";

const Dashboard = ({ sensors }) => {
    const sensorNames = {
        temperature: "Temperature",
        humidity: "Humidity",
        pressure: "Pressure",
        air_quality: "Air Quality (CO2)",
    };

    return (
        <div className="flex-column">
            {Object.keys(sensors).map((key) => (
                <>
                    <h3>{sensorNames[key] || key}</h3>
                    <div key={key} className="dashboard-row">
                        {key === "temperature" ? (
                            <GaugeComponent data={sensors[key]} arcs={[20 / 67, 35 / 67, 12 / 67]} colours={["#EA4228", "#4cda15", "#EA4228"]} unit={" °C"} />
                        ) : key === "humidity" ? (
                            <GaugeComponent data={sensors[key]} colours={["#EA4228", "#4cda15", "#4cda15"]} unit={" %"} />
                        ) : key === "pressure" ? (
                             <GaugeComponent data={sensors[key]} padding={0} nrLevels={20} colours={["#F5D6BA", "#B07C9E"]} unit={" hPa"} />
                        ) : key === "air_quality" ? (
                            <GaugeComponent data={sensors[key]} colours={["#4cda15", "#F8C630", "#EA4228"]} unit={" ppm"} />
                        ) : null}
                        <ChartComponent measured_parameter_id={sensors[key].id}/>
                    </div>
                </>
            ))}
        </div>
    );
};

export default Dashboard;
