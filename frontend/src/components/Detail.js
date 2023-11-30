import React, { useEffect, useState } from 'react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import dayjs from 'dayjs';
import {sensorNames} from "../util/utils";

const Detail = ({ open, onClose, measured_parameter_id }) => {
    const [data, setData] = useState({
        name: '',
        sensor: '',
        parameter_description: '',
        values: [{ timestamp: '', value: 0 }],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const from = dayjs().subtract(1, 'week').unix();
                const to = dayjs().unix();
                const response = await axios.get(
                    `/sensorknoten-vogelhaus/measured_parameter/${measured_parameter_id}?from=${from}&to=${to}`
                );
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        if (open) {
            fetchData();
        }
    }, [open, measured_parameter_id]);

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#1C352E', color: '#D4A82B', padding: '20px' } }}>
            <div className="detail">
                <h1 style={{ marginBottom: '15px', textAlign: 'center', fontSize: '24px', fontFamily: "Dosis" }}>{sensorNames[data.name] || data.name}</h1>
                <div style={{ textAlign: 'center' }}>
                    <LineChart width={500} height={250} margin={{ top: 10, right: 20, left: 10, bottom: 10 }} data={data.values}>
                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            scale="time"
                            domain={['dataMin', 'dataMax + 1']}
                            tickFormatter={(msTime) => new Date(msTime).toLocaleString()}
                        />
                        <YAxis />
                        <Tooltip labelFormatter={(msTime) => new Date(msTime).toLocaleString()} />
                        <Line dataKey="value" data={data.values} name={data.name} dot={false} />
                    </LineChart>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', fontFamily: "Dosis" }}>{data.parameter_description}</p>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default Detail;
