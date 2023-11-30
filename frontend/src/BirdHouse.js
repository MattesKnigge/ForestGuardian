import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import useInterval from "./util/UseInterval";
import withSnackbar from "./withSnackbar";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Credits from "./components/Credits";
import Overview from "./components/Overview";

const BirdHouse = ({ showMessage }) => {
    const {birdHouseName} = useParams();
    const [data, setData] = useState({ season: "",
        values: {
            paramName: { timestamp: "", value: 0, min: 0, max: 100,
                value_range: { tag: "default", description: ""},
                param_ranges: [ { lower_bound: 0, tag: "default", description: ""}]
            }
        }
    });
    const [lastTimestamp, setLastTimestamp] = useState(new Date(0).getTime());
    const [isDash, setIsDash] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/sensorknoten-vogelhaus/location/${birdHouseName}`);
                console.dir(response.data)
                setData(response.data);
                const timeResponse = await axios.get(`/sensorknoten-vogelhaus/location/${birdHouseName}/latest`);
                setLastTimestamp(timeResponse.data);
            } catch (error) {
                console.dir(error);
                showMessage('An error occurred while fetching data.', 'error');
            }
        }

        fetchData();
    }, [birdHouseName, showMessage]);

    useInterval(async () => {
        if (isDash) {
            try {
                const timeResponse = await axios.get(`/sensorknoten-vogelhaus/location/${birdHouseName}/latest`);
                if (timeResponse.data > lastTimestamp) {
                    setLastTimestamp(timeResponse.data);
                    const response = await axios.get(`/sensorknoten-vogelhaus/location/${birdHouseName}`);
                    setData(response.data);
                    console.log("polling")
                }
            } catch (error) {
                console.dir(error);
                showMessage('An error occurred while fetching data.', 'error');
            }
        }
    }, 5 * 1000);

    return(
        <div className="layout">
            <Header onToggleClick={() => setIsDash(!isDash)} toggleOn={isDash} showToggle={true} />
            <div className="content-container">
                {isDash ?
                    <Dashboard sensors={data.values}/>
                :
                    <Overview data={data} />
                }
            </div>
            <Credits />
        </div>
    );
};

export default withSnackbar(BirdHouse);