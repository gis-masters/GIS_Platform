import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyType } from '../../services/data/schema/schema.models';
import { isWfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { applyPrintFocusForFeatureExtract } from '../../services/map/map-print.service';
import { printSettings } from '../../stores/PrintSettings.store';
import { Button } from '../Button/Button';
import { type FormControlProps } from '../Form/Control/Form-Control';
import { PrintMapDialog } from '../PrintMapDialog/PrintMapDialog';

import './PrintMapImageControl.scss';

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
    if (property.propertyType !== PropertyType.CUSTOM) {
      return null;
    }

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
          format={typeof property.format === 'string' ? property.format : 'square'}
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
  private async openPrintDialog() {
    const { fieldValue, property } = this.props;
    if (property.propertyType !== PropertyType.CUSTOM) {
      this.printDialogOpen = true;

      return;
    }

    const focusFeature =
      'focusFeature' in property && isWfsFeature(property.focusFeature) ? property.focusFeature : undefined;

    const fragmentAlreadyChosen = typeof fieldValue === 'string' && fieldValue.length > 0;

    if (focusFeature && !fragmentAlreadyChosen) {
      const pageFormatId = typeof property.format === 'string' ? property.format : 'square';
      this.mapLoading = true;
      try {
        await applyPrintFocusForFeatureExtract(focusFeature, { pageFormatId });
      } finally {
        this.mapLoading = false;
      }
    }

    this.printDialogOpen = true;
  }

  @action.bound
  private closePrintDialog() {
    this.printDialogOpen = false;
  }
}
