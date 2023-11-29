import GaugeChart from 'react-gauge-chart'

const GaugeComponent = ({ data, arcs, colours, nrLevels, padding }) => {
    return (
        <GaugeChart id={data.id}
                    percent={(data.value - data.min) / (data.max - data.min)}
                    colors={colours}
                    arcsLength={arcs}
                    formatTextValue={() => data.value +' '+ data.unit}
                    needleColor={"#D4A82B"}
                    needleBaseColor={"#D4A82B"}
                    nrOfLevels={nrLevels}
                    arcPadding={padding}
                    />
    )
};

export default GaugeComponent;