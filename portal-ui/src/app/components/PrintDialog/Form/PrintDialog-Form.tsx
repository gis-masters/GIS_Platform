import React, { Component, FormEvent } from 'react';
import { action, observable } from 'mobx';
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
import { PropertySchema, ValueType } from '../../../services/crg/schema.models';
import { getPatch } from '../../../services/util/patch';
import { Form, FormContent } from '../../Form/Form';

import { PrintDialogExtra } from '../Extra/PrintDialog-Extra';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Form.scss';
import '!style-loader!css-loader!sass-loader!../FormPart/PrintDialog-FormPart.scss';

const cnPrintDialog = cn('PrintDialog');

interface PrintDialogFormProps {
  onSubmit: () => void;
}

type MainFormValues = Pick<PrintSettings, 'pageFormatId' | 'scale' | 'orientation'>;
type ExtraFormValues = Pick<PrintSettings, 'resolution' | 'margin' | 'windRose' | 'border' | 'date'>;

@observer
export class PrintDialogForm extends Component<PrintDialogFormProps> {
  @observable private extraOpen = false;

  private mainFields: PropertySchema<MainFormValues>[] = [
    {
      name: 'pageFormatId',
      title: 'Формат',
      valueType: ValueType.CHOICE,
      enumerations: pageFormats.map(({ id, name }) => ({ title: name, value: id }))
    },
    {
      name: 'scale',
      title: 'Масштаб',
      valueType: ValueType.CHOICE,
      enumerations: scales.map(scale => ({ title: `1 : ${scale}`, value: scale }))
    },
    {
      name: 'orientation',
      title: 'Ориентация',
      valueType: ValueType.CHOICE,
      enumerations: orientations
    }
  ];

  private extraFields: PropertySchema<ExtraFormValues>[] = [
    {
      name: 'resolution',
      title: 'Разрешение',
      valueType: ValueType.CHOICE,
      enumerations: resolutions.map(resolution => ({ title: `${resolution} dpi`, value: resolution }))
    },
    {
      name: 'margin',
      title: 'Поля (мм)',
      valueType: ValueType.SET,
      fieldsSet: [
        {
          name: 'left',
          title: 'слева',
          valueType: ValueType.INT,
          minInclusive: 0,
          maxInclusive: 50
        },
        {
          name: 'right',
          title: 'справа',
          valueType: ValueType.INT,
          minInclusive: 0,
          maxInclusive: 50
        },
        {
          name: 'top',
          title: 'сверху',
          valueType: ValueType.INT,
          minInclusive: 0,
          maxInclusive: 50
        },
        {
          name: 'bottom',
          title: 'снизу',
          valueType: ValueType.INT,
          minInclusive: 0,
          maxInclusive: 50
        }
      ]
    },
    {
      name: 'windRose',
      title: 'Роза ветров',
      valueType: ValueType.CHECKBOX
    },
    {
      name: 'border',
      title: 'Рамка',
      valueType: ValueType.CHECKBOX
    },
    {
      name: 'date',
      title: 'Дата',
      valueType: ValueType.CHECKBOX
    }
  ];

  render() {
    const { pageFormatId, scale, resolution, orientation, margin, windRose, border, date } = printSettings;
    const mainFormValues: MainFormValues = {
      pageFormatId,
      scale,
      orientation
    };
    const extraFormValues: ExtraFormValues = {
      resolution,
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
