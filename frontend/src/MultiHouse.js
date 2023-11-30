import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import withSnackbar from "./withSnackbar";
import Header from "./components/Header";
import Credits from "./components/Credits";
import Overview from "./components/Overview";
import MultiDash from "./components/MultiDash";

const MultiHouse = ({ showMessage }) => {
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
    const [isDash, setIsDash] = useState(true);

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
                    <MultiDash houses={data}/>
                    :
                    <Overview data={data['random']} />
                }
            </div>
            <Credits />
        </div>
    );
};

export default withSnackbar(MultiHouse);