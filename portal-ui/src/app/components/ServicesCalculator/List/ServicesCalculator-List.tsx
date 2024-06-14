import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Dialog, DialogActions, DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { ActionsRight } from '../../ActionsRight/ActionsRight';
import { Button } from '../../Button/Button';
import { XTable } from '../../XTable/XTable';
import { ServicesCalculatorCheckbox } from '../Checkbox/ServicesCalculator-Checkbox';
import { ServicesInfo } from '../ServicesCalculator';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-List.scss';

const cnServicesCalculatorList = cn('ServicesCalculator', 'List');

interface ServicesCalculatorListProps {
  servicesDialogOpen: boolean;
  clearSelectedServices: boolean;
  onCloseServicesDialog(): void;
  onChangeServices(services: ServicesInfo[]): void;
  onClearServices(clear: boolean): void;
}

@observer
export class ServicesCalculatorList extends Component<ServicesCalculatorListProps> {
  @observable private selectedList: ServicesInfo[] = [];

  constructor(props: ServicesCalculatorListProps) {
    super(props);
    makeObservable(this);
  }

  componentDidUpdate() {
    if (this.props.clearSelectedServices) {
      this.clearAllSelect();
      this.props.onClearServices(false);
    }
  }

  render() {
    return (
      <Dialog
        className={cnServicesCalculatorList()}
        open={this.props.servicesDialogOpen}
        onClose={this.props.onCloseServicesDialog}
        maxWidth='xl'
      >
        <DialogContent>
          <XTable
            title='Выбранные услуги'
            data={this.servicesInfo}
            cols={[
              {
                title: (
                  <Checkbox
                    indeterminate={this.selectedList.length > 0 && !this.selectedList}
                    checked={this.selectedAllList}
                    onChange={this.handleSelectAll}
                  />
                ),
                cellProps: { padding: 'checkbox' },
                CellContent: this.renderCheckbox
              },
              {
                title: 'Название',
                field: 'service'
              }
            ]}
          />
        </DialogContent>
        <DialogActions>
          <ActionsRight>
            <Button onClick={this.handleAdd} color='primary'>
              Выбрать
            </Button>
            <Button onClick={this.props.onCloseServicesDialog}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @action.bound
  private handleAdd() {
    this.props.onChangeServices(this.selectedList);
    this.props.onCloseServicesDialog();
  }

  @action.bound
  private handleSelectAll() {
    this.selectedList = this.selectedAllList ? [] : [...this.servicesInfo];
  }

  @action.bound
  private clearAllSelect() {
    this.selectedList = [];
  }

  @computed
  private get selectedAllList(): boolean {
    return this.selectedList.length > 0 && this.selectedList.length === this.servicesInfo.length;
  }

  @boundMethod
  private renderCheckbox({ rowData }: { rowData: ServicesInfo }): ReactElement {
    return <ServicesCalculatorCheckbox selectedService={rowData} selectedServicesList={this.selectedList} />;
  }

  private get servicesInfo() {
    const additions = [
      {
        service: 'За каждую сторону листа формата A4 таких сведений в бумажной форме',
        price: 100,
        counter: 0
      },
      {
        service: 'За предоставление сведений, в электронной форме',
        price: 100,
        counter: 0
      }
    ];

    return [
      {
        id: 1,
        service: `За предоставление копии материалов и результатов инженерных изысканий
                  в электронной форме (вне зависимости от количества листов)`,
        price: 5000,
        counter: 1,
        enable: true
      },
      {
        id: 2,
        service: 'За предоставление копии материалов и результатов инженерных изысканий в бумажной форме',
        price: 5000,
        additions: [
          {
            service: 'За каждую сторону листа формата А4 копии таких материалов и результатов',
            price: 100,
            counter: 0
          }
        ],
        counter: 1,
        enable: true
      },
      {
        id: 3,
        service:
          'За предоставление сведений об одном земельном участке (части земельного участка) за каждые полные (неполные) 10000 кв. метров площади такого участка и (или) дополнительный контур (для многоконтурных земельных участков) в электронной форме',
        price: 1000,
        additions,
        counter: 1,
        enable: true
      },
      {
        id: 4,
        service:
          'За предоставление сведений об одном земельном участке (части земельного участка) за каждые полные (неполные) 10000 кв. метров площади такого участка и (или) дополнительный контур (для многоконтурных земельных участков)',
        price: 1000,
        additions,
        counter: 1,
        enable: true
      },
      {
        id: 5,
        service: 'За предоставление сведений об одном объекте капитального строительства в электронной форме',
        price: 1000,
        additions,
        counter: 1,
        enable: true
      },
      {
        id: 6,
        service: 'За предоставление сведений об одном объекте капитального строительства',
        price: 5000,
        additions,
        counter: 1,
        enable: true
      },
      {
        id: 7,
        service:
          'За предоставление сведений о неразграниченных землях за каждые полные (неполные) 10000 кв. метров площади таких земель в электронной форме',
        price: 1000,
        additions,
        counter: 1,
        enable: true
      },
      {
        id: 8,
        service:
          'За предоставление сведений о неразграниченных землях за каждые полные (неполные) 10000 кв. метров площади таких земель',
        price: 5000,
        additions,
        counter: 1,
        enable: true
      }
    ];
  }
}
