import React, {useState} from "react";
import GaugeComponent from "./GaugeComponent";
import ChartComponent from "./ChartComponent";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import {sensorNames} from "../util/utils";

const Dashboard = ({ sensors }) => {
    const [from, setFrom] = useState(dayjs().subtract(1, 'week'));
    const [to, setTo] = useState(dayjs());

    return (
        <div className="flex-column">
            <div className="flex-row">
                <label style={{fontFamily: 'Bebas Neue, sans-serif',}}>from:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
                    <DateTimePicker value={from} onChange={(v) => setFrom(v)} maxDateTime={dayjs().subtract(1, 'day')} />
                </LocalizationProvider>
                <label style={{fontFamily: 'Bebas Neue, sans-serif',}}>to:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
                    <DateTimePicker value={to} onChange={(v) => setTo(v)} maxDateTime={dayjs()} />
                </LocalizationProvider>
            </div>
            {Object.keys(sensors).map((key) => (
                <>
                    <h3 style={{fontFamily: 'Dosis, sans-serif'}}>{sensorNames[key] || key}</h3>
                    <div key={key} className="dashboard-row">
                        {key === "temperature" ? (
                            <GaugeComponent data={sensors[key]} arcs={[20 / 67, 35 / 67, 12 / 67]} colours={["#EA4228", "#4cda15", "#EA4228"]} unit={" °C"} />
                        ) : key === "humidity" ? (
                            <GaugeComponent data={sensors[key]} colours={["#EA4228", "#4cda15", "#4cda15"]} unit={" %"} />
                        ) : key === "pressure" ? (
                             <GaugeComponent data={sensors[key]} padding={0} nrLevels={20} colours={["#6699CC", "#993333"]} unit={" hPa"} />
                        ) : key === "air_quality" ? (
                            <GaugeComponent data={sensors[key]} colours={["#4cda15", "#F8C630", "#EA4228"]} unit={" ppm"} />
                        ) : null}
                        <ChartComponent measured_parameter_id={sensors[key].id} from={from} to={to} />
                    </div>
                </>
            ))}
        </div>
    );
};

export default Dashboard;
