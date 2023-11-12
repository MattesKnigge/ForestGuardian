import withSnackbar from "./withSnackbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "./components/Header";
import Credits from "./components/Credits";

const App = ({ showMessage }) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `/sensorknoten-vogelhaus/locations`
                );
                setData(response.data);
            } catch (error) {
                console.dir(error);
                showMessage("An error occurred while fetching data.", "error");
            }
        }

        fetchData();
    }, [showMessage]);

    const handleBirdhouseClick = (birdHouseName) => {
        navigate(`/bird-house/${birdHouseName}`, { replace: true });
    };

    return (
        <div>
            <Header />
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Available Birdhouses
                </Typography>
                <Grid container spacing={2}>
                    {data.map((name) => (
                        <Grid item key={name} xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                className="bottom-button"
                                onClick={() => handleBirdhouseClick(name)}
                            >
                                {name}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Credits />
        </div>
    );
};

export default withSnackbar(App);
