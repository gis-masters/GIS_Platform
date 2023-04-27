import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { printSettings } from '../../../stores/PrintSettings.store';
import { PropertySchemaFile } from '../../../services/data/schema/schema.models';
import { createFile } from '../../../services/data/files/files.service';
import { FileInfo } from '../../../services/data/files/files.models';
import { FormControlProps } from '../../Form/Control/Form-Control';
import { PrintMapDialog } from '../../PrintMapDialog/PrintMapDialog';
import { Button } from '../../Button/Button';
import { Files } from '../../Files/Files';

const cnFeatureExtractMapSelector = cn('FeatureExtract', 'MapSelector');

@observer
export class FeatureExtractMapSelector extends Component<FormControlProps> {
  @observable private printDialogOpen = false;
  @observable private mapLoading = false;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { fieldValue, property } = this.props;

    return (
      <>
        {(fieldValue as FileInfo[] | null)?.length ? (
          <Files
            property={property as PropertySchemaFile}
            value={fieldValue as FileInfo[]}
            onChange={this.handleChange}
            editable
          />
        ) : (
          <Button
            className={cnFeatureExtractMapSelector()}
            onClick={this.openPrintDialog}
            loading={this.mapLoading || printSettings.printingInProcess}
          >
            Выбрать фрагмент карты
          </Button>
        )}

        <PrintMapDialog onClose={this.closePrintDialog} open={this.printDialogOpen} onPrint={this.handlePrint} />
      </>
    );
  }

  @boundMethod
  private async handlePrint(pdf: Blob) {
    const { onChange, property } = this.props;
    this.setMapLoading(true);
    const { id, size, title } = await createFile(new File([pdf], 'map.pdf'));
    onChange({ value: [{ id, size, title }], propertyName: property.name });
    this.setMapLoading(false);
  }

  @boundMethod
  private handleChange(value: FileInfo[]) {
    const { onChange, property } = this.props;
    onChange({ value, propertyName: property.name });
  }

  @action
  private setMapLoading(loading: boolean) {
    this.mapLoading = loading;
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
