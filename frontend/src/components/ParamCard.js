import {sensorNames} from "../util/utils";
import Button from "@mui/material/Button";

const ParamCard = ({name, data, onShowDetails}) => {
    return (
        <div className="param-card">
            <h1 className="param-card-title">{sensorNames[name]}</h1>
            <div className="param-card-content">
                <div className={`card-value ${data.value > 999 ? "card-big-value" : ""}`} style={{ color: data.value_range.color }}>
                    {data.value}
                    <div className="card-unit" style={{ color: data.value_range.color }}>
                        {data.unit}
                    </div>
                </div>
                <div className={`param-svg bird-${data.value_range.tag}`} />
            </div>
            <div>
                <Button class="more-info-button"
                        onClick={() => onShowDetails(data.id)}
                        title={`More information about ${sensorNames[name]}`}
                >
                    More Information
                </Button>
            </div>
        </div>
    );
}

export default ParamCard;

