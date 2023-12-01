import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import withSnackbar from "./withSnackbar";
import Header from "./components/Header";
import Credits from "./components/Credits";
import Overview from "./components/Overview";
import Dashboard from "./components/Dashboard";

const BirdHouse = ({ showMessage }) => {
    const {birdHouseNames} = useParams();
    const [data, setData] = useState({ house: {
            season: "",
            values: {
                paramName: { id: "random_temperature", timestamp: "", value: 0, min: 0, max: 100,
                    value_range: { tag: "default", description: ""},
                    param_ranges: [ { lower_bound: 0, tag: "default", description: "", color: ""}, { lower_bound: 1, tag: "default", description: "", color: ""}]
                }
            }
        }
    });
    const [houseCount, setHouseCount] =useState(1);
    const [isDash, setIsDash] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const names = birdHouseNames.split(';');
                const dat = {};
                for (const name of names) {
                    const response = await axios.get(`/sensorknoten-vogelhaus/location/${name}`);
                    dat[name] = response.data;
                }
                console.dir(dat);

                setData(dat);
                setHouseCount(names.length);
            } catch (error) {
                console.dir(error);
                showMessage('An error occurred while fetching data.', 'error');
            }
        }

        fetchData();
    }, [birdHouseNames, showMessage]);

    return(
        <div className="layout">
            <Header onToggleClick={() => setIsDash(!isDash)} toggleOn={isDash} showToggle={true} />
            <div className="content-container">
                {isDash ?
                    <div className='multi-dashboard-layout'>
                        {Object.keys(data).map((house) => (
                            <Dashboard title={houseCount > 1 ? house : ''} sensors={data[house].values} />
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