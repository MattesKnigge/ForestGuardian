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
    const [backendError, setBackendError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `/sensorknoten-vogelhaus/locations`
                );
                setData(response.data);
                setBackendError(false);
            } catch (error) {
                console.dir(error);
                setBackendError(true);
            }
        }

        fetchData();
    }, [showMessage]);

    const handleBirdhouseClick = (birdHouseName) => {
        navigate(`/bird-house/${birdHouseName}`, { replace: true });
    };

    return (
        <div className="layout">
            <Header />
            <Container>
                {backendError ? (
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                        <img
                            src="/sleeping_bird.png"
                            alt="Sleeping Bird"
                            style={{
                                position: 'relative',
                                maxWidth: '100%',
                                height: 'auto',
                                marginBottom: '10px',
                            }}
                        />
                        <Typography
                            variant="h6"
                            style={{
                                position: 'absolute',
                                bottom: '4vh',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 1,
                                color: '#D4A82B',
                                fontFamily: 'Dosis, sans-serif',
                            }}
                        >
                            Oh no! The birds are taking a nap...
                        </Typography>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </Container>
            <Credits />
        </div>
    );
};

export default withSnackbar(App);
