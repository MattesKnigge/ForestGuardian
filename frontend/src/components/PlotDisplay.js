import React, { useEffect, useState } from 'react';
import Speedometer from 'react-d3-speedometer';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const defaultSensorData = {
    temperature: { timestamp: "", value: "-25" },
    humidity: { timestamp: "", value: "0" },
    pressure: { timestamp: "", value: "800" },
};

const PlotDisplay = () => {
    const [data, setData] = useState(defaultSensorData);
    const [error, setError] = useState(null);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

    const handleSnackbarClose = () => {
        setOpenErrorSnackbar(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/sensorknoten-vogelhaus/location/random");
                setData(response.data);
            } catch (error) {
                setError('An error occurred while fetching sensor data.');
                setOpenErrorSnackbar(true);
            }
        }

        fetchData();
    }, []);

    const gaugeConfig = (value, minValue, maxValue, units, segments, segmentColors) => ({
        value: parseInt(value),
        currentValueText: `#{value} ${units}`,
        currentValuePlaceholderStyle: '#{value}',
        minValue,
        maxValue,
        needleColor: 'black',
        segments,
        customSegmentLabels: Array(segments).fill({}),
        segmentColors,
        textColor: '#91A799',
    });

    return (
        <div className="plot-display-content">
            <div className="sensor-name">
                <h1 style={{ textAlign: 'center' }}>Test House Data {data.temperature.timestamp}</h1>
            </div>
            <div className="gauge-container">
                <div className="gauge-item temp">
                    <h3 className="headline-plot">Temperature</h3>
                    <Speedometer {...gaugeConfig(data.temperature.value, -25, 45, '°C', 8, ["#8f0000", "red", "orange", "green", "green", "orange", "red", "#8b0000"])} />
                </div>
                    <div className="gauge-item hum">
                        <h3 className="headline-plot">Humidity</h3>
                        <Speedometer {...gaugeConfig(data.humidity.value, 0, 110, '%', 6, ["#8f0000", "red", "orange", "green", "green", "green"])} />
                    </div>
                    <div className="gauge-item pres">
                        <h3 className="headline-plot">Pressure</h3>
                        <Speedometer {...gaugeConfig(data.pressure.value, 800, 1110, 'hPa', 3, ["red", "orange", "green"])} />
                    </div>
            </div>
            <Snackbar
                open={openErrorSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleSnackbarClose}>
                    {error}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default PlotDisplay;
