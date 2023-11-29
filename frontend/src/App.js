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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const App = ({ showMessage }) => {
    const [data, setData] = useState([]);
    const [backendError, setBackendError] = useState(false);
    const [showButtons] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
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


    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} style={{ maxWidth: 'unset' }}>
                            {!showButtons && (
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontFamily: 'Dosis, sans-serif',
                                        whiteSpace: 'pre-line',
                                        marginBottom: '-9rem',
                                        marginTop: '7rem'
                                    }}
                                >
                                    <span style={{ color: '#D4A82B', fontSize: '1.3em' }}>Analytics</span>{'\n'}
                                    <span style={{ color: '#9e7400', fontSize: '1.5em', textTransform: "uppercase" }}>Data-Driven{'\n'}Wilderness Insights</span>{'\n'}
                                    <span style={{ color: "#D4A82B", fontSize: '1em' }}>Discover the forest’s hidden tales with our data-driven analytics.{'\n'}
                                        Uncover insights into air quality, tree health, and bird activity,{'\n'}
                                        empowering a deeper connection with nature.{'\n'}
                                        ForestGuardian’s analytics - your path to a greener world</span>
                                </Typography>
                            )}

                            <Button
                                style={{ width: '25rem', marginTop: '1rem', marginBottom: '0.5rem' }}
                                variant="contained"
                                className="second-button"
                                onClick={handleMenuOpen}
                            >
                                Show Our Data
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 4,
                                    style: {
                                        backgroundColor: '#2E3B4E',
                                        width: '25rem',
                                    },
                                }}
                            >
                                {data.map((name) => (
                                    <MenuItem
                                        key={name}
                                        onClick={() => handleBirdhouseClick(name)}
                                        style={{ color: '#D4A82B',
                                            fontFamily: 'Dosis, sans-serif',
                                        textTransform: 'uppercase',
                                        fontSize: '1.5rem'}}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Grid>
                        <Grid item xs={30} md={6} style={{ textAlign: 'center', whiteSpace: 'pre-line', marginTop: '7rem' }}>
                            <img
                                src="/Birdhouse.svg"
                                alt="Sleeping Bird"
                                style={{ width: '120%', height: 'auto', marginLeft: '-3rem' }}
                            />
                            <Typography color={"#D4A82B"} style={{ textAlign: 'left', fontFamily: 'Dosis, sans-serif', maxWidth: '60%', marginLeft: '8rem', fontSize: '1.3rem' }}>
                                ForestGuardian is a project at the Ostfalia Hochschule and features an autonomous birdhouse with sensors tracking tree health and environmental data.{'\n'} Equipped with smart sensors, it monitors the forest ecosystem, providing insights into tree health and environmental conditions. Join us in creating a smarter, greener world.
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Container>
            <Credits />
        </div>
    );
};

export default withSnackbar(App);
