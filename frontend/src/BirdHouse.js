import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import useInterval from "./util/UseInterval";
import withSnackbar from "./withSnackbar";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Credits from "./components/Credits";

const BirdHouse = ({ showMessage }) => {
    const {birdHouseName} = useParams();
    const [data, setData] = useState({"paramName": { timestamp: "", value: "-25", min: "-25", max: "100" }});
    const [lastTimestamp, setLastTimestamp] = useState(new Date(0).getTime());
    const [isDash, setIsDash] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/sensorknoten-vogelhaus/location/${birdHouseName}`);
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
    }, 5 * 1000);

    return(
        <div className="layout">
            <Header onToggleClick={() => setIsDash(!isDash)} toggleOn={isDash} showToggle={true} />
            <div className="content-container">
                {isDash ? (
                    <Dashboard sensors={data}/>
                ):
                null
                }
            </div>
            <Credits />
        </div>
    );
};

export default withSnackbar(BirdHouse);