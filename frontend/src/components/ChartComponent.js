import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import axios from "axios";
import {gold, violet} from '../util/utils';

const ChartComponent =  ({ measured_parameter_id, from, to }) => {
    const [data, setData] = useState({
        name: '',
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
        <ChartDisplay name={data.name} id={measured_parameter_id} values={data.values} />
    );
}

const ChartDisplay = ({ name, id, values }) => {
    return (
        <ResponsiveContainer width="100%" aspect={3.5}>
            <LineChart data={values} id={id}>
                <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    domain={['dataMin', 'dataMax + 1']}
                    tickFormatter={(msTime) => new Date(msTime).toLocaleString()}
                    tick={{ fill: gold }}
                    tickLine={{ stroke: gold }}
                    stroke='#D4A82B'
                />
                <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: gold }} tickLine={{ stroke: gold }} stroke={violet} />
                <Tooltip labelFormatter={(msTime) => new Date(msTime).toLocaleString()} />
                <Line dataKey="value" data={values} name={name} dot={false} stroke={'#B58BC2'} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export {ChartComponent, ChartDisplay};