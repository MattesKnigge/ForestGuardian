import {sensorNames} from "../util/utils";
import Button from "@mui/material/Button";

const ParamCard = ({name, data}) => {
    const handleButtonClick = () => {
        // Add your click handling logic here
        console.log('More Info clicked');
        //TODO: Open Detail.js on click
    };

    return (
        <div className="param-card">
            <h1 className="param-card-title">{sensorNames[name]}</h1>
            <div className="param-card-content">
                <div className="card-value">
                    {data.value}
                    <div className="card-unit">
                        {data.unit}
                    </div>
                </div>
                <div className={`param-svg bird-${data.value_range.tag}`} />
            </div>
            <div>
                <Button class="more-info-button" onClick={handleButtonClick}>
                    More Info
                </Button>
            </div>
        </div>
    );
}

export default ParamCard;

