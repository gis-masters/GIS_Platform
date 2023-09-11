import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Card, CardContent, Checkbox } from '@mui/material';

import { ServicesInfo } from '../ServicesCalculator';
import { ServicesCalculatorDelete } from '../Delete/ServicesCalculator-Delete';
import { ServicesCalculatorAdditions } from '../Additions/ServicesCalculator-Additions';
import { ServicesCalculatorServiceDetails } from '../ServiceDetails/ServicesCalculator-Service-Details';
import { ServicesCalculatorServiceDescription } from '../ServiceDescription/ServicesCalculator-ServiceDescription';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Service.scss';

const cnServicesCalculatorService = cn('ServicesCalculator', 'Service');

interface ServicesCalculatorServiceProps {
  service: ServicesInfo;
  selectService: (service: ServicesInfo) => void;
  deleteService: (service: ServicesInfo) => void;
}

@observer
export class ServicesCalculatorService extends Component<ServicesCalculatorServiceProps> {
  render() {
    const { service } = this.props;

    return (
      <Card sx={{ minWidth: 300 }} className={cnServicesCalculatorService()}>
        <Checkbox onChange={this.select} checked={service.enable} />
        <CardContent>
          <ServicesCalculatorServiceDescription serviceDescription={service.service} />
          <ServicesCalculatorServiceDetails service={service} />
          {service.additions?.map((addition, index) => <ServicesCalculatorAdditions addition={addition} key={index} />)}
        </CardContent>
        <ServicesCalculatorDelete clickHandler={this.delete} />
      </Card>
    );
  }

  @boundMethod
  private delete() {
    this.props.deleteService(this.props.service);
  }

  @boundMethod
  private select() {
    this.props.selectService({ ...this.props.service });
  }
}
