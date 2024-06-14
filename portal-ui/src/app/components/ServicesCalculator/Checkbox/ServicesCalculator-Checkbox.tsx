import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';

import { ServicesInfo } from '../ServicesCalculator';

interface ServicesCalculatorCheckboxProps {
  selectedService: ServicesInfo;
  selectedServicesList: ServicesInfo[];
}

@observer
export class ServicesCalculatorCheckbox extends Component<ServicesCalculatorCheckboxProps> {
  constructor(props: ServicesCalculatorCheckboxProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return <Checkbox checked={this.selected} onChange={this.handleChange} />;
  }

  @computed
  private get selected(): boolean {
    const { selectedService, selectedServicesList } = this.props;

    return selectedServicesList.some(
      service => service.id === selectedService.id && service.service === selectedService.service
    );
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { selectedService, selectedServicesList } = this.props;

    if (checked) {
      selectedServicesList.push(selectedService);
    } else {
      selectedServicesList.forEach((service, i) => {
        if (service.id === selectedService.id) {
          selectedServicesList.splice(Number(i), 1);
        }
      });
    }
  }
}
