import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Settings, SettingsOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { PropertySchema } from '../../services/data/schema/schema.models';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';

const cnRegistrySettings = cn('Registry', 'Settings');

interface RegistrySettingsProps {
  properties: PropertySchema[];
  hiddenFields: string[];
  onChangeHiddenFields(fields: string[]): void;
}

@observer
export class RegistrySettings extends Component<RegistrySettingsProps> {
  @observable private dialogOpen = false;

  constructor(props: RegistrySettingsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { hiddenFields: hiddenCols, properties } = this.props;

    return (
      <>
        <Tooltip title='Настроить столбцы'>
          <IconButton className={cnRegistrySettings()} onClick={this.openDialog}>
            {this.dialogOpen ? <Settings /> : <SettingsOutlined />}
          </IconButton>
        </Tooltip>

        <ChooseXTableDialog
          title='Выберите отображаемые столбцы'
          data={properties}
          selectedItems={properties.filter(({ name }) => !hiddenCols.includes(name))}
          cols={[{ title: 'Название', field: 'title', filterable: true }]}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.onSelect}
          getRowId={this.getRowId}
        />
      </>
    );
  }

  @action.bound
  private onSelect(items: PropertySchema[]): void {
    const { onChangeHiddenFields, properties } = this.props;
    onChangeHiddenFields(
      properties.filter(({ name }) => !items.some(item => item.name === name)).map(({ name }) => name)
    );

    this.closeDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  private getRowId(rowData: PropertySchema) {
    return rowData.name;
  }
}
