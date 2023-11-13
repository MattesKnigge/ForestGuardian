import GaugeChart from 'react-gauge-chart'

const GaugeComponent = ({ data, arcs, colours, unit }) => {
    return (
        <GaugeChart id={data.id}
                    percent={((data.value + Math.abs(data.min)) / (data.max + Math.abs(data.min)))}
                    colors={colours}
                    arcsLength={arcs}
                    formatTextValue={() => data.value +''+ unit} />
    )
};

export default GaugeComponent;