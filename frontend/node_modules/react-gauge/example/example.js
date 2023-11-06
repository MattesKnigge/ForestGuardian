'use strict';

import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

import Gauge from '../dist/react-gauge';

class ReactGaugeExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [0, 0, 0],
    }
    this.valueChange = this.valueChange.bind(this);
  }

  valueChange(index) {
    return (e) => {
      const newGaugeValue = e.target.value;
      const values = [...this.state.values];
      values[index] = newGaugeValue;
      this.setState({ values });
    }
  }

  render() {
    const { values } = this.state;
    return (
      <div className='react-gauge-example'>
        <div className='example'>
          <Gauge value={values[0]} key='gauge-0'/>
          <input type='number' value={values[0]} onChange={this.valueChange(0)}/>
        </div>
        <div className='example'>
          <Gauge value={values[1]} primaryColor="#7D9F35" key='gauge-1'/>
          <input type='number' value={values[1]} onChange={this.valueChange(1)}/>
        </div>
        <div className='example'>
          <Gauge
            value={values[2]}
            gradient={[
              {p: 0, color: "#ff0000"},
              {p: 50, color: "#ffff00"},
              {p: 75, color: "#ffc107"},
              {p: 100, color: "#00920b"},
            ]}
            key='gauge-2'
          />
          <input type='number' value={values[2]} onChange={this.valueChange(2)}/>
        </div>
      </div>
    )
  }
}

render(
  <ReactGaugeExample/>,
  document.getElementById('example')
)
