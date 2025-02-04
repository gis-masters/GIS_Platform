import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { services } from '../../services/services';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { FormDialog } from '../FormDialog/FormDialog';
import { ServicesCalculatorActions } from './Actions/ServicesCalculator-Actions';
import { ServicesCalculatorList } from './List/ServicesCalculator-List';
import { ServicesCalculatorServicesList } from './ServicesList/ServicesCalculator-ServicesList';
import { ServicesCalculatorTitle } from './Title/ServicesCalculator-Title';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator.scss';

export const cnServicesCalculator = cn('ServicesCalculator');

export interface ServicesInfo {
  id: number;
  price: number;
  service: string;
  counter?: number;
  additions?: ServicesAdditions[];
  enable?: boolean;
}

export interface ServicesAdditions {
  price: number;
  service: string;
  counter: number;
}

export interface InvoiceInfo {
  bank: string;
  bik: number;
  inn: number;
  kpp: number;
  checkingAccount: number;
  correspondentAccount: number;
  recipient: string;
  paymentPurpose: string;
  supplier: string;
  buyer: string;
  supervisor: string;
  accountant: string;
}

const properties: PropertySchema[] = [
  {
    name: 'bank',
    title: 'Банк получателя',
    required: true,
    propertyType: PropertyType.STRING
  },
  {
    name: 'bik',
    title: 'БИК',
    required: true,
    propertyType: PropertyType.INT
  },
  {
    name: 'inn',
    title: 'ИНН',
    required: true,
    propertyType: PropertyType.INT
  },
  {
    name: 'kpp',
    title: 'КПП',
    required: true,
    propertyType: PropertyType.INT
  },
  {
    name: 'checkingAccount',
    title: 'Расчетный счет',
    required: true,
    propertyType: PropertyType.INT
  },
  {
    name: 'correspondentAccount',
    title: 'Корреспондентский счет',
    required: true,
    propertyType: PropertyType.INT
  },
  {
    name: 'recipient',
    title: 'Получатель',
    required: true,
    propertyType: PropertyType.STRING
  },
  {
    name: 'paymentPurpose',
    title: 'Назначение платежа',
    required: true,
    propertyType: PropertyType.STRING
  },
  {
    name: 'supervisor',
    title: 'Руководитель',
    required: true,
    propertyType: PropertyType.STRING
  },
  {
    name: 'accountant',
    title: 'Бухгалтер',
    required: true,
    propertyType: PropertyType.STRING
  }
];

@observer
export default class ServicesCalculator extends Component {
  @observable private requisitesDialogOpen = false;
  @observable private servicesDialogOpen = false;
  @observable private clearSelectedServices = false;
  @observable private unclosable = true;
  @observable private selectedServices: ServicesInfo[] = [];

  constructor(props: Record<never, unknown>) {
    super(props);
    makeObservable(this);

    if (localStorage.getItem('invoiceRequisites')) {
      this.setUnclosable(false);
    } else {
      this.openRequisitesDialog();
    }
  }

  async componentDidMount() {
    if (!organizationSettings.viewServicesCalculator) {
      await services.provided;

      services.ngZone.run(() => {
        setTimeout(() => {
          void services.router.navigateByUrl('/projects');
        }, 0);
      });
    }
  }

  render() {
    return (
      organizationSettings.viewServicesCalculator && (
        <>
          <ServicesCalculatorTitle />

          <div className={cnServicesCalculator()}>
            <ServicesCalculatorServicesList
              selectAllService={this.selectAllService}
              selectedServices={this.selectedServices}
              openServicesDialog={this.openServicesDialog}
              selectedAllServices={this.selectedAllServices}
              selectService={this.selectService}
              deleteService={this.deleteService}
            />

            <ServicesCalculatorActions
              openRequisitesDialog={this.openRequisitesDialog}
              onClearAll={this.onClearAll}
              resultPrice={this.resultPrice}
              selectedServices={this.selectedServices}
              onClearSelectedServices={this.setClearSelectedServices}
            />
          </div>

          <FormDialog
            open={this.requisitesDialogOpen}
            schema={{ properties }}
            value={(JSON.parse(String(localStorage.getItem('invoiceRequisites'))) as InvoiceInfo) || {}}
            actionButtonProps={{ children: 'Сохранить' }}
            actionFunction={this.setSelectedServices}
            onClose={this.closeRequisitesDialog}
            unclosable={this.unclosable}
            title='Реквизиты'
          />

          <ServicesCalculatorList
            servicesDialogOpen={this.servicesDialogOpen}
            onCloseServicesDialog={this.closeServicesDialog}
            onChangeServices={this.setServices}
            clearSelectedServices={this.clearSelectedServices}
            onClearServices={this.setClearSelectedServices}
          />
        </>
      )
    );
  }

  @action.bound
  private setClearSelectedServices(clear: boolean) {
    this.clearSelectedServices = clear;
  }

  @action.bound
  private openServicesDialog() {
    this.servicesDialogOpen = true;
  }

  @action.bound
  private closeServicesDialog() {
    this.servicesDialogOpen = false;
  }

  @action.bound
  private openRequisitesDialog() {
    this.requisitesDialogOpen = true;
  }

  @action.bound
  private closeRequisitesDialog() {
    this.requisitesDialogOpen = false;
  }

  @action.bound
  private setUnclosable(enabled: boolean) {
    this.unclosable = enabled;
  }

  @action.bound
  private setServices(services: ServicesInfo[]) {
    this.selectedServices = services;
  }

  @action.bound
  private onClearAll() {
    this.selectedServices = [];
  }

  @action.bound
  private selectService(service: ServicesInfo) {
    this.selectedServices.forEach(obj => {
      if (obj.id === service.id) {
        obj.enable = !obj.enable;
      }
    });
  }

  @action.bound
  private deleteService(service: ServicesInfo) {
    this.selectedServices.forEach((obj, i) => {
      if (obj.id === service.id) {
        this.selectedServices.splice(Number(i), 1);
      }
    });
  }

  @boundMethod
  private setSelectedServices(value: InvoiceInfo) {
    localStorage.setItem('invoiceRequisites', JSON.stringify(value));
    this.closeRequisitesDialog();
    this.setUnclosable(false);
  }

  @action.bound
  private selectAllService() {
    const enable = this.selectedAllServices;
    this.selectedServices.forEach(service => {
      service.enable = !enable;
    });
  }

  @computed
  private get selectedAllServices(): boolean {
    const enabled = this.selectedServices.filter(({ enable }) => enable);

    return this.selectedServices.length === enabled.length;
  }

  @computed
  private get resultPrice(): number {
    let sum = 0;
    this.selectedServices.forEach(service => {
      if (service.enable) {
        sum += service.price * (service.counter || 0);

        if (service.additions && service.counter) {
          service.additions.forEach(addition => {
            sum += addition.price * addition.counter;
          });
        }
      }
    });

    return sum;
  }
}
