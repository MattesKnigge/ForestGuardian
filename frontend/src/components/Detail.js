import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import dayjs from 'dayjs';
import { green, gold } from '../util/utils';
import { ChartDisplay } from './ChartComponent';

const Detail = ({ open, onClose, measured_parameter_id }) => {
    const [data, setData] = useState({
        name: '',
        display_name: '',
        parameter_description: '',
        value: 0,
        value_range: { tag: "default", description: ""},
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
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: green,
                    color: gold,
                    padding: '20px',
                    maxWidth: '600px',
                    margin: 'auto',
                    borderRadius: '15px',
                },
            }}
        >
            <div className="detail">
                <h1
                    style={{
                        marginBottom: '15px',
                        textAlign: 'center',
                        fontSize: '28px',
                        fontFamily: 'Dosis',
                    }}
                >
                    {data.display_name || data.name}
                </h1>
                <div style={{ textAlign: 'center' }}>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '18px', fontFamily: 'Dosis' }}>
                            {data.parameter_description}
                            <br />
                            <br/>
                            <span style={{ fontStyle: 'normal', fontSize: '17px' }}>{data.value_range.description}</span>
                            <br />
                            <br />
                            <ChartDisplay id={measured_parameter_id} name={data.name} values={data.values} />
                        </p>
                    </div>

                </div>
            </div>
        </Dialog>
    );
};

export default Detail;
