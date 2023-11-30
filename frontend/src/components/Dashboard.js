import React, {useState} from "react";
import GaugeComponent from "./GaugeComponent";
import ChartComponent from "./ChartComponent";
import {sensorNames} from "../util/utils";
import {createTheme, ThemeProvider} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import 'dayjs/locale/de';

const Dashboard = ({ sensors }) => {
    const datePickerTheme = createTheme({
        palette: {
            primary: {
                main: '#D4A82B',
                contrastText: '#fff',
            },
            text: {
                primary: '#D4A82B',
                secondary: '#D4A82B',
            },
            background: {
                paper: '#1C352E',
            },
            action: {
                active: '#D4A82B',
            }
        },
    });
    const [from, setFrom] = useState(dayjs().subtract(1, 'week'));
    const [to, setTo] = useState(dayjs());

    return (
        <div className="flex-column">
            <ThemeProvider theme={datePickerTheme}>
                <div className="flex-row">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
                        <DatePicker label="FROM" value={from} onChange={(v) => setFrom(v)} maxDateTime={dayjs().subtract(1, 'day')} />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
                        <DatePicker label="TO" value={to} onChange={(v) => setTo(v)} maxDateTime={dayjs()} />
                    </LocalizationProvider>
                </div>
            </ThemeProvider>
            {Object.keys(sensors).map((key) => (
                <>
                    <h3 style={{fontFamily: 'Dosis, sans-serif', color: '#D4A82B'}}>{sensorNames[key] || key}</h3>
                    <div key={key} className="dashboard-row">
                        {key === "temperature" ? (
                            <GaugeComponent data={sensors[key]} arcs={[20 / 67, 35 / 67, 12 / 67]} colours={["#EA4228", "#4cda15", "#EA4228"]} />
                        ) : key === "humidity" ? (
                            <GaugeComponent data={sensors[key]} colours={["#EA4228", "#4cda15", "#4cda15"]} />
                        ) : key === "pressure" ? (
                             <GaugeComponent data={sensors[key]} padding={0} nrLevels={20} colours={["#6699CC", "#993333"]} />
                        ) : key === "air_quality" ? (
                            <GaugeComponent data={sensors[key]} colours={["#4cda15", "#F8C630", "#EA4228"]} />
                        ) : null}
                        <ChartComponent measured_parameter_id={sensors[key].id} from={from} to={to} />
                    </div>
                </>
            ))}
        </div>
    );
};

export default Dashboard;
