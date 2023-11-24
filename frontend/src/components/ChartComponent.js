import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import axios from "axios";

const ChartComponent =  ({ measured_parameter_id, from, to }) => {
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