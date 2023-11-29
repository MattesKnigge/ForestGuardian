import ParamCard from "./ParamCard";

const Overview = ({ sensors }) => {
    return (
        <div className="overview">
            {Object.keys(sensors).map((key) => (
                <>
                    <ParamCard name={key} data={sensors[key]} />
                    <div className="tree-spacer" />
                    {key === Object.keys(sensors)[0] ?
                        <div className="tree-spacer" />
                        :
                        null
                    }
                </>
            ))}
        </div>
    );
}


export default Overview;