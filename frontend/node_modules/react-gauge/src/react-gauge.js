'use strict';

import React from 'react';

// http://stackoverflow.com/a/11832950/1337683
function roundTwoDecimals(number) {
  return Math.round(number * 100) / 100;
}


const  _colorArc = (gradient, color, id) => gradient.length == 0 ? color : `url(#linear-gradient)`;

export default class ReactGauge extends React.Component {
  static defaultProps = {
  	colors: {
  		blue: '#255C69',
  		green: '#2A7F40',
  		orange: '#AA7139',
  		red: '#AA4639'
  	},
  	primaryColor:'#255C69',
  	gradient:[],
  	width: 500,
  	height: 250,
  	min: 0,
  	max: 100,
  	value: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width,
      height: this.props.height
    }
    this.resizeGauge = this.resizeGauge.bind(this);
    window.addEventListener('resize', this.resizeGauge, false);
  }

  componentWillMount() {
    this.resizeGauge();
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.resizeGauge);
  }

	resizeGauge() {

		const width = this.props.width;
		const height = this.props.height;

    if (window.innerWidth > width) {
      if (this.state.width < width) {
        this.setState({ width, height });
      }

    } else {
      this.setState({
        width: window.innerWidth,
        height: window.innerWidth * .5
      });
    }
  }

  getStyles() {
    let xLeft = 0;
    let xMiddle = Math.round(this.state.width / 2);
    let xRight = this.state.width;

    let yTop = 0;
    let yMiddle = Math.round(this.state.height / 2);
    let yBottom = this.state.height;

    let percent = this.props.value / this.props.max;
    let degrees = percent * 180;

    // Outer circle
    let outerCircle = {
      r: xMiddle,
      cx: xMiddle,
      cy: yBottom
    }

    // Inner circle
    let innerCircle = {
      r: xMiddle * .8,
      cx: xMiddle,
      cy: yBottom
    }

    // Needle
    let needleCircle = {
      r: Math.round(this.state.width / 10),
      cx: Math.round(this.state.width / 2),
      cy: this.state.height
    }

    let needleWidth = 10;
    let needlePath = {
      d: `M ${xMiddle} ${yBottom - needleWidth} L 0 ${yBottom - needleWidth}`,
      strokeWidth: needleWidth
    }

    let needleStyle = {
      transformOrigin: '100% 50% 0',
      transform: `rotate(${degrees}deg)`,
      OTransition: 'transform 250ms ease-in',
      MozTransition: 'transform 250ms ease-in',
      WebkitTransition: 'transform 250ms ease-in'
    }

    // Text
    let textStyle = {
      text: `${ roundTwoDecimals(percent * 100) }%`,
      x: xMiddle,
      y: yBottom * .6,
      fontSize: this.state.width * .1
    }

    return { outerCircle, innerCircle, needleCircle, needlePath, needleStyle, textStyle }
  }

  renderGradientIfPresent() {
    const { gradient } = this.props;
    if (!gradient.length) return null;

    const uniqueId= this._reactInternalInstance._rootNodeID;
    return (
       <defs>
        <linearGradient id='linear-gradient' x1="0%" y1="0%" x2="100%" y2="0%">
          {gradient.map((item, index) => (
            <stop offset={item.p + "%"} stopColor={item.color} key={`stop-${index}`}/>
          ))}
        </linearGradient>
      </defs>
    )
  }

  render() {
    console.log(this.state.width)
    const styles = this.getStyles();
		const viewBox = "0 0 " + this.state.width + ' ' + this.state.height;
    const uniqueId= this._reactInternalInstance._rootNodeID;
    const { gradient, primaryColor } = this.props;
    const fillName = _colorArc(gradient, primaryColor, uniqueId);
    return(
      <svg width={ this.state.width } viewBox={viewBox} height={ this.state.height }>
        { this.renderGradientIfPresent()}
        <circle r={ styles.outerCircle.r }
            cx={ styles.outerCircle.cx  }
            cy={ styles.outerCircle.cy }
            fill={fillName}>
        </circle>
        <circle r={ styles.innerCircle.r }
            cx={ styles.innerCircle.cx }
            cy={ styles.innerCircle.cy }
            fill="white">
        </circle>
        <text x={ styles.textStyle.x } y={ styles.textStyle.y }
          fontSize={ styles.textStyle.fontSize }
          fontFamily='Arimo'
          textAnchor='middle'
          fill={ this.props.colors.blue }>
            { styles.textStyle.text }
        </text>
        <g className="needle">
          <circle r={ styles.needleCircle.r }
              cx={ styles.needleCircle.cx  }
              cy={ styles.needleCircle.cy }
              fill={ this.props.colors.red }>
          </circle>
          <path style={ styles.needleStyle }
              d={ styles.needlePath.d }
              stroke={ this.props.colors.red }
              strokeWidth={ styles.needlePath.strokeWidth }>
          </path>
        </g>
      </svg>
    )
  }
}
