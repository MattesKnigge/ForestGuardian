import React, {useState} from "react";
import GaugeChart from 'react-gauge-chart';
import {ChartComponent} from "./ChartComponent";
import {createTheme, ThemeProvider} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import {brown, gold, green} from '../util/utils';

const Dashboard = ({ title, sensors }) => {
    const datePickerTheme = createTheme({
        palette: {
            primary: {
                main: gold,
                contrastText: '#fff',
            },
            text: {
                primary: gold,
                secondary: gold,
            },
            background: {
                paper: green,
            },
            action: {
                active: gold,
            }
        },
    });
    const [from, setFrom] = useState(dayjs().subtract(1, 'week'));
    const [to, setTo] = useState(dayjs());
    const [showGraphs, setShowGraphs] = useState(false);

    const calcArcs = (ranges) => {
        if (ranges.length === 2) {
            return [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05];
        } else {
            let percentages = []
            const fullRange = ranges[ranges.length -1].lower_bound - ranges[0].lower_bound;
            for (let i = 0; i < ranges.length - 1; i++) {
                const range = ranges[i+1].lower_bound - ranges[i].lower_bound;
                percentages.push(range / fullRange);
            }
            return percentages;
        }
    }

    const calcColors = (ranges) => {
        if (ranges.length === 2) {
            return [ranges[0].color, ranges[1].color];
        } else {
            let colors = [];
            for (let i = 0; i < ranges.length - 1; i++) {
                colors.push(ranges[i].color);
            }
            return colors;
        }
    }

    return (
        <div className={`dashboard-layout ${showGraphs ? 'with-graph' : ''}`}>
            {title !== '' ?
                <h1 style={{fontFamily: 'Dosis, sans-serif', color: gold}}>{title}</h1>
            :null}
            <ThemeProvider theme={datePickerTheme}>
                <div className="dashboard-controls">
                    <FormControlLabel
                        control={<Switch Switch checked={showGraphs} onChange={() => setShowGraphs(!showGraphs)} style={{ color: brown }} title={'Show or hide graphs'} />}
                        label={
                            <Typography variant="body2" style={{fontFamily: 'Dosis, sans-serif', color: gold, fontSize: '1.3em', fontWeight: 'bold'}}>
                                Graphs
                            </Typography>}
                        labelPlacement="start"
                        style={{ marginRight: '1rem' }}
                    />
                    {showGraphs ?
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
                            <DatePicker label="FROM" value={from} onChange={(v) => setFrom(v)} maxDateTime={dayjs().subtract(1, 'day')} />
                            <DatePicker label="TO" value={to} onChange={(v) => setTo(v)} maxDateTime={dayjs()} />
                        </LocalizationProvider>
                    : null}
                </div>
            </ThemeProvider>

            {Object.keys(sensors).map((key) => (
                <>
                    <h3 style={{fontFamily: 'Dosis, sans-serif', color: gold}}>{sensors[key].display_name || key}</h3>
                    <div key={key} className={`dashboard-row ${showGraphs? 'two-cols':'one-col'}`}>
                        <GaugeChart id={sensors[key].id}
                                    percent={(sensors[key].value - sensors[key].min) / (sensors[key].max - sensors[key].min)}
                                    colors={calcColors(sensors[key].param_ranges)}
                                    arcsLength={calcArcs(sensors[key].param_ranges)}
                                    formatTextValue={() => sensors[key].value +' '+ sensors[key].unit}
                                    needleColor={gold}
                                    needleBaseColor={gold}
                                    arcPadding={sensors[key].param_ranges.length === 2 ? 0 : 0.02}
                                    //TODO: maybe implement -> textColor={data.value_range.color}
                        />
                        {showGraphs?
                            <ChartComponent measured_parameter_id={sensors[key].id} from={from} to={to} />
                            : null
                        }
                    </div>
                </>
            ))}
        </div>
    );
};

export default Dashboard;
