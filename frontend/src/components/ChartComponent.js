import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import axios from "axios";
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider, DateTimePicker} from "@mui/x-date-pickers";

const ChartComponent =  ({ measured_parameter_id }) => {
    const [from, setFrom] = useState(dayjs().subtract(1, 'week'));
    const [to, setTo] = useState(dayjs());

    const [data, setData] = useState({
        name: '',
        sensor: '',
        parameter_description: '',
        values: [{ timestamp: '', value: 0 }],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/sensorknoten-vogelhaus/measured_parameter/${measured_parameter_id}?from=${from.unix()}&to=${to.unix()}`);
                console.dir(response.data);
                setData(response.data);
            } catch (error) {
                console.dir(error);
            }
        }

        fetchData();
    }, [from, measured_parameter_id, to]);

    return (
        <div className="flex-column">
            <div className="dashboard-date-picker-row">
                <label>from:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
                    <DateTimePicker value={from} onChange={(v) => setFrom(v)} maxDateTime={dayjs().subtract(1, 'day')} />
                </LocalizationProvider>
                <label>to:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
                    <DateTimePicker value={to} onChange={(v) => setTo(v)} maxDateTime={dayjs()} />
                </LocalizationProvider>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.values}>
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax + 1']}
                        tickFormatter={(msTime) => new Date(msTime).toLocaleString()}
                    />
                    <YAxis domain={['dataMin', 'dataMax']} />
                    <Tooltip labelFormatter={(msTime) => new Date(msTime).toLocaleString()} />
                    <Line dataKey="value" data={data.values} name={data.name} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ChartComponent;