import React, { Component, FormEvent } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import {
  orientations,
  pageFormats,
  printSettings,
  PrintSettings,
  resolutions,
  scales
} from '../../../stores/PrintSettings.store';
import { getPatch } from '../../../services/util/patch';
import { SelectLegend } from '../../SelectLegend/SelectLegend';
import { PropertyType, PropertySchema } from '../../../services/crg/schema.models';
import { FormContent } from '../../Form/Content/Form-Content';
import { Form } from '../../Form/Form';

import { PrintDialogExtra } from '../Extra/PrintDialog-Extra';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Form.scss';
import '!style-loader!css-loader!sass-loader!../FormPart/PrintDialog-FormPart.scss';

const cnPrintDialog = cn('PrintDialog');

interface PrintDialogFormProps {
  onSubmit: () => void;
}

type MainFormValues = Pick<PrintSettings, 'pageFormatId' | 'scale' | 'orientation' | 'legend'>;
type ExtraFormValues = Pick<PrintSettings, 'resolution' | 'legendSize' | 'margin' | 'windRose' | 'border' | 'date'>;

@observer
export class PrintDialogForm extends Component<PrintDialogFormProps> {
  @observable private extraOpen = false;

  render() {
    const { pageFormatId, scale, resolution, orientation, margin, windRose, border, date, legend, legendSize } =
      printSettings;
    const mainFormValues: MainFormValues = {
      pageFormatId,
      scale,
      orientation,
      legend
    };
    const extraFormValues: ExtraFormValues = {
      resolution,
      legendSize,
      margin,
      windRose,
      border,
      date
    };

    return (
      <Form className={cnPrintDialog('Form')} onSubmit={this.submitHandler} id='printDialogForm'>
        <FormContent<MainFormValues>
          className={cnPrintDialog('FormPart', { part: 'main' })}
          fields={this.mainFields}
          formValue={mainFormValues}
          onFormChange={this.handleFormChange}
        />
        <PrintDialogExtra open={this.extraOpen} onClick={this.handleExtra} />
        {this.extraOpen && (
          <FormContent<ExtraFormValues>
            className={cnPrintDialog('FormPart', { part: 'extra' })}
            fields={this.extraFields}
            formValue={extraFormValues}
            onFormChange={this.handleFormChange}
          />
        )}
      </Form>
    );
  }

  @computed
  private get mainFields(): PropertySchema<MainFormValues>[] {
    return [
      {
        name: 'pageFormatId',
        title: 'Формат',
        propertyType: PropertyType.CHOICE,
        options: pageFormats.map(({ id, name }) => ({ title: name, value: id }))
      },
      {
        name: 'scale',
        title: 'Масштаб',
        propertyType: PropertyType.CHOICE,
        options: scales.map(scale => ({ title: `1 : ${scale}`, value: scale }))
      },
      {
        name: 'orientation',
        title: 'Ориентация',
        propertyType: PropertyType.CHOICE,
        options: orientations
      },
      {
        name: 'legend',
        title: 'Легенда',
        propertyType: PropertyType.SET,
        fieldsSet: [
          {
            name: 'enabled',
            title: '',
            propertyType: PropertyType.BOOL
          },
          {
            name: 'items',
            title: 'Знаки легенды',
            propertyType: PropertyType.CUSTOM,
            hidden: !printSettings.legend.enabled,
            ControlComponent: SelectLegend
          },
          {
            name: 'auto',
            title: 'авто',
            hidden: !printSettings.legend.enabled,
            propertyType: PropertyType.BOOL
          }
        ]
      }
    ];
  }

  private get extraFields(): PropertySchema<ExtraFormValues>[] {
    return [
      {
        name: 'resolution',
        title: 'Разрешение',
        display: 'select',
        propertyType: PropertyType.CHOICE,
        options: resolutions.map(resolution => ({ title: `${resolution} dpi`, value: resolution }))
      },
      {
        name: 'legendSize',
        title: 'Размер легенды',
        propertyType: PropertyType.FLOAT,
        display: 'slider',
        step: 0.1,
        minValue: 0.8,
        maxValue: 1.8
      },
      {
        name: 'margin',
        title: 'Поля (мм)',
        propertyType: PropertyType.SET,
        fieldsSet: [
          {
            name: 'left',
            title: 'слева',
            propertyType: PropertyType.INT,
            minValue: 0,
            maxValue: 50
          },
          {
            name: 'right',
            title: 'справа',
            propertyType: PropertyType.INT,
            minValue: 0,
            maxValue: 50
          },
          {
            name: 'top',
            title: 'сверху',
            propertyType: PropertyType.INT,
            minValue: 0,
            maxValue: 50
          },
          {
            name: 'bottom',
            title: 'снизу',
            propertyType: PropertyType.INT,
            minValue: 0,
            maxValue: 50
          }
        ]
      },
      {
        name: 'windRose',
        title: 'Роза ветров',
        display: 'checkbox',
        propertyType: PropertyType.BOOL
      },
      {
        name: 'date',
        title: 'Дата',
        display: 'checkbox',
        propertyType: PropertyType.BOOL
      }
    ];
  }

  @boundMethod
  private submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onSubmit();
  }

  @action.bound
  private handleExtra() {
    this.extraOpen = !this.extraOpen;
  }

  @action.bound
  private handleFormChange(values: PrintSettings) {
    printSettings.setValues(getPatch(values, printSettings, Object.keys(values)));
  }
}
