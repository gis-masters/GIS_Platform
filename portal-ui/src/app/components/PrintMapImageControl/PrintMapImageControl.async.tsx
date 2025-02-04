import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaCustom } from '../../services/data/schema/schema.models';
import { printSettings } from '../../stores/PrintSettings.store';
import { Button } from '../Button/Button';
import { FormControlProps } from '../Form/Control/Form-Control';
import { PrintMapDialog } from '../PrintMapDialog/PrintMapDialog';

import '!style-loader!css-loader!sass-loader!./PrintMapImageControl.scss';

const cnPrintMapImageControl = cn('PrintMapImageControl');

@observer
export default class PrintMapImageControl extends Component<FormControlProps> {
  @observable private printDialogOpen = false;
  @observable private mapLoading = false;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { fieldValue, property } = this.props;
    const { format } = property as PropertySchemaCustom;

    return (
      <>
        {typeof fieldValue === 'string' && fieldValue ? (
          <img
            className={cnPrintMapImageControl('Image')}
            alt='Фрагмент карты'
            onClick={this.openPrintDialog}
            src={fieldValue}
          />
        ) : (
          <Button
            className={cnPrintMapImageControl()}
            onClick={this.openPrintDialog}
            loading={this.mapLoading || printSettings.printingInProcess}
          >
            Выбрать фрагмент карты
          </Button>
        )}

        <PrintMapDialog
          onClose={this.closePrintDialog}
          open={this.printDialogOpen}
          onExport={this.handleExport}
          format={typeof format === 'string' ? format : 'square'}
          allowJpg
        />
      </>
    );
  }

  @boundMethod
  private handleExport(value: string) {
    const { onChange, property } = this.props;
    onChange?.({ value, propertyName: property.name });
  }

  @action.bound
  private openPrintDialog() {
    this.printDialogOpen = true;
  }

  @action.bound
  private closePrintDialog() {
    this.printDialogOpen = false;
  }
}
