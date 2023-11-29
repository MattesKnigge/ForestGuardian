import {sensorNames} from "../util/utils";
import Button from "@mui/material/Button";

const ParamCard = ({name, data}) => {

    return (
        <div className="param-card">
            <h1>{sensorNames[name]}</h1>
            <div className="param-card-content">
                <div className="card-value">
                    {data.value}
                    <div className="card-unit">
                        {data.unit}
                    </div>
                </div>
                {name === "temperature" ?
                    <div className="param-svg bird-cold" />
                    : <div></div>}
            </div>
            <div>
                <Button class="info-button">
                    More Info
                </Button>
            </div>
        </div>
    );
}

export default ParamCard;