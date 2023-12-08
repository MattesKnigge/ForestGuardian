import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import dayjs from 'dayjs';
import {green, gold} from "../util/utils";
import ChartComponent from "./ChartComponent";

const Detail = ({ open, onClose, measured_parameter_id }) => {
    const [data, setData] = useState({
        name: '',
        display_name: '',
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
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: green, color: gold, padding: '20px' } }}>
            <div className="detail">
                <h1 style={{ marginBottom: '15px', textAlign: 'center', fontSize: '24px', fontFamily: "Dosis" }}>{data.display_name || data.name}</h1>
                <div style={{ textAlign: 'center' }}>
                    <ChartComponent from={dayjs().subtract(1, 'week').unix()} to={dayjs().unix()} measured_parameter_id={measured_parameter_id}/>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', fontFamily: "Dosis" }}>{data.parameter_description}</p>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default Detail;
