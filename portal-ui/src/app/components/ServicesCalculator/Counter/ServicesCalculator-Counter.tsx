import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ServicesCalculatorButton } from '../Button/ServicesCalculator-Button';
import { ServicesCalculatorCounterValue } from '../CounterValue/ServicesCalculator-CounterValue';
import { ServicesInfo } from '../ServicesCalculator';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Counter.scss';

const cnServicesCalculatorCounter = cn('ServicesCalculator', 'Counter');

interface ServicesCalculatorCounterProps {
  service: Partial<ServicesInfo>;
}

@observer
export class ServicesCalculatorCounter extends Component<ServicesCalculatorCounterProps> {
  constructor(props: ServicesCalculatorCounterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { service } = this.props;

    return (
      <div className={cnServicesCalculatorCounter()}>
        <ServicesCalculatorButton action={'+'} clickHandler={this.increment} />
        <ServicesCalculatorCounterValue counter={service.counter} />
        <ServicesCalculatorButton action={'-'} clickHandler={this.decrement} />
      </div>
    );
  }

  @action.bound
  private increment() {
    this.props.service.counter++;
  }

  @action.bound
  private decrement() {
    if (this.props.service.counter > 0) {
      this.props.service.counter--;
    }
  }
}
