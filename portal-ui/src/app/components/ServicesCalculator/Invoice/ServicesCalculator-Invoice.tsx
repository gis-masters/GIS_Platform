import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Button } from '../../Button/Button';
import { InvoiceInfo, ServicesInfo } from '../ServicesCalculator';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Invoice.scss';

const cnServicesCalculatorInvoice = cn('ServicesCalculator', 'Invoice');

interface ServicesCalculatorInvoiceProps {
  resultPrice: number;
  services: ServicesInfo[];
}

@observer
export class ServicesCalculatorInvoice extends Component<ServicesCalculatorInvoiceProps> {
  @observable private counter = 1;
  @observable private font?: string;

  constructor(props: ServicesCalculatorInvoiceProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const response = await fetch('/assets/fonts/Roboto/Roboto-Regular.ttf.base64');

    this.setFont(await response.text());
  }

  componentDidUpdate() {
    this.clearCounter();
  }

  render() {
    return (
      <Button onClick={this.print} color='primary' className={cnServicesCalculatorInvoice()}>
        Печать квитанции
      </Button>
    );
  }

  @boundMethod
  private async print() {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'px', 'a4');

    if (!this.font) {
      throw new Error('Шрифт не загружен');
    }

    doc.addFileToVFS('roboto.ttf', this.font);
    doc.addFont('roboto.ttf', 'roboto', 'normal');
    doc.setFont('roboto');

    const source = this.invoice();

    await doc.html(source, {
      callback: function (pdf) {
        pdf.save('invoice.pdf');
      },
      margin: [10, 0, 30, 0]
    });
  }

  @action.bound
  private setFont(font: string) {
    this.font = font;
  }

  @action.bound
  private clearCounter() {
    this.counter = 1;
  }

  @action.bound
  private services(): string {
    return this.props.services
      .map(service => {
        if (service.counter && service.enable) {
          return `<tr style='border-left: 1px solid;border-bottom: 1px solid;border-right: 1px solid'>
            <th style='width: 13px;'>№${this.counter++}</th>
            <th style='border-left: 1px solid'>${service.service}</th>
            <th style='width: 40px; border-left: 1px solid; text-align: right;'>${service.price}</th>
            <th style='width: 34px; border-left: 1px solid; text-align: right;'>${service.counter}</th>
            <th style='width: 40px; border-left: 1px solid; text-align: right;'>${service.price * service.counter}</th>
          </tr>
          ${this.additions(service)}`;
        }
      })
      .join('');
  }

  @action.bound
  private additions(service: ServicesInfo): string {
    return (
      service.additions
        ?.map(addition => {
          if (addition.counter) {
            return `<tr style='border-left: 1px solid;border-bottom: 1px solid;border-right: 1px solid'>
          <th style='width: 13px;'>№${this.counter++}</th>
          <th style='border-left: 1px solid'>${service.service}. ${addition.service}</th>
          <th style='width: 40px; border-left: 1px solid; text-align: right;'>${addition.price}</th>
          <th style='width: 34px; border-left: 1px solid; text-align: right;'>${addition.counter}</th>
          <th style='width: 40px; border-left: 1px solid; text-align: right;'>${addition.price * addition.counter}</th>
        </tr>`;
          }
        })
        .join('') || ''
    );
  }

  @boundMethod
  private invoice() {
    const date = new Date();
    const invoiceInfo = JSON.parse(String(localStorage.getItem('invoiceRequisites'))) as InvoiceInfo;

    return `<div style="width: 426px; margin-left: 10px; margin-top: 15px;margin-right: auto; font-size: 8px; font-family: roboto">
        <div style="font-weight: bold; font-size: 12px; padding-left: 5px">
          Счет № ${String(Date.now()).slice(0, -3)} от ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}
        </div>
        <br />
        <table
          width="100%"
          style="margin-bottom: 5px; border-collapse: collapse; border-spacing: 0; border: 1px solid; height: auto"
          cellpadding="2"
          cellspacing="2"
        >
          <tbody>
            <tr>
              <td colspan="2">${invoiceInfo.bank}</td>
              <td style="border-right: 1px solid; border-bottom: 1px solid; border-left: 1px solid">БИK</td>
              <td style="border-bottom: 1px solid">${invoiceInfo.bik}</td>
            </tr>
            <tr>
              <td colspan="2" style="border-bottom: 1px solid">Банк получателя</td>
              <td rowspan="2" style="border-left: 1px solid; border-right: 1px solid; border-bottom: 1px solid">Корреспондентский счет</td>
              <td rowspan="2" style="border-bottom: 1px solid">${invoiceInfo.correspondentAccount}</td>
            </tr>
            <tr>
              <td style="border-right: 1px solid; border-bottom: 1px solid">ИНН ${invoiceInfo.inn}</td>
              <td style="border-bottom: 1px solid">КПП ${invoiceInfo.kpp}</td>
            </tr>
            <tr>
              <td colspan="2">${invoiceInfo.recipient}</td>
              <td rowspan="2" style="border-left: 1px solid; border-right: 1px solid">Расчетный счет</td>
              <td rowspan="2">${invoiceInfo.checkingAccount}</td>
            </tr>
            <tr>
              <td colspan="2">Получатель</td>
            </tr>
            <tr>
              <td colspan="4" style="border-top: 1px solid;">Назначение платежа  ${invoiceInfo.paymentPurpose}</td>
            </tr>
          </tbody>
        </table>

        <table width="100%" cellpadding="2" cellspacing="2" style="border-collapse: collapse; margin-top: 5px">
          <thead>
            <tr style="border-left: 1px solid; border-right: 1px solid; border-bottom: 1px solid">
              <th style="width: 13px; border-top: 1px solid">№</th>
              <th style="border-left: 1px solid; border-top: 1px solid">Товар</th>
              <th style="width: 40px; border-left: 1px solid; border-top: 1px solid">Цена,руб</th>
              <th style="width: 34px; border-left: 1px solid; border-top: 1px solid">Кол-во</th>
              <th style="width: 40px; border-left: 1px solid; border-top: 1px solid">Сумма,руб</th>
            </tr>
            ${this.services()}
            <tr>
              <td colspan="4" style="text-align: right">Итого:</td>
              <td style="border-left: 1px solid; border-bottom: 1px solid; border-right: 1px solid; text-align: right">${
                this.props.resultPrice
              }</td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <br />
        <div style="font-size: 10px; font-weight: 800;font-weight: bold;">
          Всего наименований ${this.counter - 1} на сумму ${this.props.resultPrice}.00 рублей.
        </div>
        <br />
        <div style="font-size: 8px; margin-bottom: 5px">Руководитель ${invoiceInfo.supervisor}</div>
        <div style="font-size: 8px">Главный бухгалтер ${invoiceInfo.accountant}</div>
        <br />
        <div style="text-align: left; font-size: 8px">
          Счет действителен к оплате в течении трех дней.
        </div>
      </div>
    `;
  }
}
