import React, { Component, FormEvent } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { getPatch } from '../../../services/util/patch';
import {
  orientations,
  pageFormats,
  PrintSettings,
  printSettings,
  resolutions,
  scales
} from '../../../stores/PrintSettings.store';
import { FormContent } from '../../Form/Content/Form-Content';
import { Form } from '../../Form/Form';
import { SelectLegend } from '../../SelectLegend/SelectLegend';
import { PrintMapDialogExtra } from '../Extra/PrintMapDialog-Extra';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Form.scss';
import '!style-loader!css-loader!sass-loader!../FormPart/PrintMapDialog-FormPart.scss';

const cnPrintMapDialog = cn('PrintMapDialog');

interface PrintMapDialogFormProps {
  format?: string;
  onSubmit(): void;
}

type MainFormValues = Pick<PrintSettings, 'pageFormatId' | 'scale' | 'orientation' | 'legend' | 'showSystemLayers'>;
type ExtraFormValues = Pick<PrintSettings, 'resolution' | 'legendSize' | 'margin' | 'windRose' | 'border' | 'date'>;

@observer
export class PrintMapDialogForm extends Component<PrintMapDialogFormProps> {
  @observable private extraOpen = false;

  constructor(props: PrintMapDialogFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const {
      pageFormatId,
      scale,
      resolution,
      orientation,
      margin,
      windRose,
      border,
      date,
      legend,
      legendSize,
      showSystemLayers
    } = printSettings;
    const mainFormValues: MainFormValues = {
      pageFormatId,
      scale,
      orientation,
      legend,
      showSystemLayers
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
      <Form className={cnPrintMapDialog('Form')} onSubmit={this.handleSubmit} id='printMapDialogForm'>
        <FormContent<MainFormValues>
          className={cnPrintMapDialog('FormPart', { part: 'main' })}
          schema={{ name: '', title: '', properties: this.mainFields }}
          formValue={mainFormValues}
          onFormChange={this.handleFormChange}
        />
        <PrintMapDialogExtra open={this.extraOpen} onClick={this.handleExtra} />
        {this.extraOpen && (
          <FormContent<ExtraFormValues>
            className={cnPrintMapDialog('FormPart', { part: 'extra' })}
            schema={{ name: '', title: '', properties: this.extraFields }}
            formValue={extraFormValues}
            onFormChange={this.handleFormChange}
          />
        )}
      </Form>
    );
  }

  @computed
  private get mainFields(): PropertySchema[] {
    const { format } = this.props;

    return [
      {
        name: 'pageFormatId',
        hidden: Boolean(format),
        title: 'Формат',
        propertyType: PropertyType.CHOICE,
        options: pageFormats.filter(({ name }) => name).map(({ id, name }) => ({ title: name || '', value: id }))
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
        hidden: Boolean(format),
        propertyType: PropertyType.CHOICE,
        options: orientations
      },
      {
        name: 'legend',
        title: 'Легенда',
        propertyType: PropertyType.SET,
        properties: [
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
      },
      {
        name: 'showSystemLayers',
        title: 'Показать',
        propertyType: PropertyType.SET,
        properties: [
          {
            name: 'draft',
            propertyType: PropertyType.BOOL,
            title: 'выделение'
          },
          {
            name: 'measure',
            propertyType: PropertyType.BOOL,
            title: 'измерения'
          }
        ]
      }
    ];
  }

  private get extraFields(): PropertySchema[] {
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
        properties: [
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
        name: 'border',
        title: 'Рамка',
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
  private handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSubmit();
  }

  @action.bound
  private handleExtra() {
    this.extraOpen = !this.extraOpen;
  }

  @action.bound
  private handleFormChange(values: Partial<ExtraFormValues | MainFormValues>) {
    printSettings.setValues(getPatch(values, printSettings, Object.keys(values)));
  }
}
