import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import withSnackbar from "./withSnackbar";
import Header from "./components/Header";
import Credits from "./components/Credits";
import Overview from "./components/Overview";
import Dashboard from "./components/Dashboard";
import useInterval from "./util/UseInterval";

const BirdHouse = ({ showMessage }) => {
    const {birdHouseNames} = useParams();
    const [data, setData] = useState({ house: {
            display_name: "",
            description: "",
            season: "",
            values: {
                paramName: { id: "random_temperature", display_name: "", timestamp: "", value: 0, min: 0, max: 100,
                    value_range: { tag: "default", description: ""},
                    param_ranges: [ { lower_bound: 0, tag: "default", description: "", color: ""}, { lower_bound: 1, tag: "default", description: "", color: ""}]
                }
            },
            weather: {
                name: '',
                description: '',
                wind_speed: '',
            }
        }
    });
    const [houseCount, setHouseCount] =useState(1);
    const [isDash, setIsDash] = useState(false);
    const [lastTimestamps, setLastTimestamps] = useState( { house: new Date(0).getTime()});

    useEffect(() => {
        async function fetchData() {
            try {
                const names = birdHouseNames.split(',');
                let dat = {};
                let timestamps = {};
                for (const name of names) {
                    const response = await axios.get(`/sensorknoten-vogelhaus/location/${name}`);
                    dat[name] = response.data;
                    const timeResponse = await axios.get(`/sensorknoten-vogelhaus/location/${name}/latest`);
                    timestamps[name] = timeResponse.data;
                }
                console.dir(dat);

                setData(dat);
                setHouseCount(names.length);
                setLastTimestamps(timestamps);
            } catch (error) {
                console.dir(error);
                showMessage('An error occurred while fetching data.', 'error');
            }
        }

        fetchData();
    }, [birdHouseNames, showMessage]);

    useInterval(async () => {
        if (isDash) {
            try {
                const names = birdHouseNames.split(',');
                let dat = structuredClone(data);
                let timestamps = lastTimestamps;
                let update = false;
                for (const name of names) {
                    const timeResponse = await axios.get(`/sensorknoten-vogelhaus/location/${name}/latest`);
                    if (timeResponse.data > timestamps[name]) {
                        timestamps[name] = timeResponse.data;
                        const response = await axios.get(`/sensorknoten-vogelhaus/location/${name}`);
                        dat[name] = response.data;
                        update = true;
                    }
                }
                if (update) {
                    setData(dat);
                    setLastTimestamps(timestamps);
                }
            } catch (error) {
                console.dir(error);
                showMessage('An error occurred while fetching data.', 'error');
            }
        }
    }, 5 * 1000);

    return(
        <div className="layout">
            <Header onToggleClick={() => setIsDash(!isDash)} toggleOn={isDash} showToggle={true} weather={birdHouseNames.includes(",") ? null : data[birdHouseNames]?.weather} />
            <div className="content-container">
                {isDash ?
                    <div className='multi-dashboard-layout'>
                        {Object.keys(data).map((house) => (
                            <Dashboard title={houseCount > 1 ? data[house].display_name : ''} sensors={data[house].values} />
                        ))}
                    </div>
                :
                    <div className='multi-overview'>
                        {Object.keys(data).map((house) => (
                            <Overview title={houseCount > 1 ? house : ''} data={data[house]} />
                        ))}
                    </div>
                }
            </div>
            <Credits />
        </div>
    );
};

export default withSnackbar(BirdHouse);