import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { Card, CardActions } from '@mui/material';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { ServicesInfo } from '../ServicesCalculator';
import { ServicesCalculatorInvoice } from '../Invoice/ServicesCalculator-Invoice';
import { ServicesCalculatorResultPrice } from '../ResultPrice/ServicesCalculator-ResultPrice';

import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Actions.scss';

const cnServicesCalculatorActions = cn('ServicesCalculator', 'Actions');

interface ServicesCalculatorActionsProps {
  openRequisitesDialog: () => void;
  onClearAll: () => void;
  resultPrice: number;
  selectedServices: ServicesInfo[];
  onClearSelectedServices: (clear: boolean) => void;
}

@observer
export class ServicesCalculatorActions extends Component<ServicesCalculatorActionsProps> {
  render() {
    const { openRequisitesDialog, resultPrice, selectedServices } = this.props;

    return (
      <div className={cnServicesCalculatorActions()}>
        <Button onClick={openRequisitesDialog} variant='contained'>
          Заполнить реквизиты
        </Button>

        <Button onClick={this.clear} variant='contained'>
          Очистить список услуг
        </Button>

        <Card sx={{ minWidth: 300 }}>
          <CardActions>
            <ServicesCalculatorResultPrice resultPrice={resultPrice} />
            <ServicesCalculatorInvoice resultPrice={resultPrice} services={selectedServices} />
          </CardActions>
        </Card>
      </div>
    );
  }

  @action.bound
  private clear() {
    this.props.onClearAll();
    this.props.onClearSelectedServices(true);
  }
}
