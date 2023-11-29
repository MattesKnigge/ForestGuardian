import {sensorNames} from "../util/utils";

const ParamCard = ({name, data}) => {

    return (
        <div className="param-card">
            <h3>{sensorNames[name]}</h3>
            <div className="param-card-content">
                <div>
                    {data.value}
                </div>
                <div className={`param-svg bird-${data.value_range.tag}`} />
            </div>
            <div>
                TODO: Button for more details
            </div>
        </div>
    );
}

export default ParamCard;