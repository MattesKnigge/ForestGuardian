import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import withSnackbar from "./withSnackbar";
import PlotDisplay from "./components/PlotDisplay";
import Header from "./components/Header";
import Credits from "./components/Credits";

const BirdHouse = ({ showMessage }) => {
    const {birdHouseName} = useParams();
    const [data, setData] = useState({"paramName": { timestamp: "", value: "-25", min: "-25", max: "100" }});

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/sensorknoten-vogelhaus/location/${birdHouseName}`);
                setData(response.data);
            } catch (error) {
                console.dir(error);
                showMessage('An error occurred while fetching data.', 'error');
            }
        }

        fetchData();
    }, [birdHouseName, showMessage]);

    return(
        <div className="layout">
            <Header data={data['temperature']}/>
            <div className="content-container">
                <PlotDisplay sensors={data}/>
            </div>
            <Credits />
        </div>
    );
};

export default withSnackbar(BirdHouse);