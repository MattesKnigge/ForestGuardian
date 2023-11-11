import withSnackbar from "./withSnackbar";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";

const App = ({ showMessage }) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/sensorknoten-vogelhaus/locations`);
                setData(response.data);
            } catch (error) {
                console.dir(error);
                showMessage('An error occurred while fetching data.', 'error');
            }
        }

        fetchData();
    }, [showMessage]);

    const handleBirdhouseClick = (birdHouseName) => {
        navigate(`/bird-house/${birdHouseName}`, { replace: true });
    };

    return (
        <div>
            {data.map((name) => (
                <div>
                    <Button
                        id={name}
                        variant="contained"
                        className="bottom-button"
                        onClick={()=> handleBirdhouseClick(name)}>
                        {name}
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default withSnackbar(App);