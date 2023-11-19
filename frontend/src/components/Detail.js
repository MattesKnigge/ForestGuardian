import { useEffect, useState } from 'react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import axios from 'axios';

const Detail = ({ measured_parameter_id }) => {
    const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7).getTime());
    const [to, setTo] = useState(new Date().getTime());

    const [data, setData] = useState({
        name: '',
        sensor: '',
        parameter_description: '',
        values: [{ timestamp: '', value: 0 }],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/sensorknoten-vogelhaus/measured_parameter/${measured_parameter_id}?from=${from}&to=${to}`);
                console.dir(response.data);
                setData(response.data);
            } catch (error) {
                console.dir(error);
            }
        }

        fetchData();
    }, [from, measured_parameter_id, to]);

    return (
        <div className="detail">
            <div className="detail-layout">
                {/* <h1 style={{gridArea: "a"}}>{data.name}</h1> */}
                {/* <h2 style={{gridArea: "b"}}>{data.sensor}</h2> */}
                {/* <div style={{gridArea: "c"}}>add sensor display here</div> */}
                <div style={{ gridArea: 'e' }}>
                    <LineChart
                        width={500}
                        height={150}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        data={data.values}
                    >
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
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <p>{data.parameter_description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
