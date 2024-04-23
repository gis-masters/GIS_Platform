import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PropertySchemaCustom, PropertyType, Schema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { Button } from '../Button/Button';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { XTableColumn } from '../XTable/XTable.models';
import { SelectSchemaControlActions } from './Actions/SelectSchemaControl-Actions';

import '!style-loader!css-loader!sass-loader!./SelectSchemaControl.scss';

const cnSelectSchemaControl = cn('SelectSchemaControl');
const cnSelectSchemaControlDialog = cn('SelectSchemaControl', 'Dialog');

@observer
export class SelectSchemaControl extends Component<FormControlProps> {
  @observable private dialogOpen = false;
  @observable private schemas?: Schema[];
  @observable private selectedSchema?: string;

  private cols: XTableColumn<Schema>[] = [
    {
      field: 'title',
      title: 'Заголовок',
      filterable: true,
      sortable: true
    },
    {
      field: 'name',
      title: 'Идентификатор',
      filterable: true,
      sortable: true
    },
    {
      field: 'geometryType',
      title: 'Тип геометрии',
      filterable: true,
      sortable: true,
      type: PropertyType.CHOICE,
      settings: {
        options: [
          {
            title: 'Point',
            value: 'Point'
          },
          {
            title: 'MultiPoint',
            value: 'MultiPoint'
          },
          {
            title: 'LineString',
            value: 'LineString'
          },
          {
            title: 'MultiLineString',
            value: 'MultiLineString'
          },
          {
            title: 'Polygon',
            value: 'Polygon'
          },

          {
            title: 'MultiPolygon',
            value: 'MultiPolygon'
          }
        ]
      }
    },
    {
      title: 'Действия',
      align: 'right',
      cellProps: { padding: 'checkbox' },
      CellContent: SelectSchemaControlActions
    }
  ];

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    this.setSchemas(await schemaService.getAllSchemas());
  }

  render() {
    return (
      <>
        <div className={cnSelectSchemaControl()}>{this.selectedSchema}</div>
        <Button onClick={this.openDialog}>Выбрать схему</Button>
        <ChooseXTableDialog<Schema>
          className={cnSelectSchemaControlDialog()}
          title='Выберите схему'
          data={this.schemas || []}
          cols={this.cols}
          open={this.dialogOpen}
          loading={!this.schemas?.length}
          onClose={this.closeDialog}
          onSelect={this.select}
          maxWidth='lg'
          fullWidth
          single
        />
      </>
    );
  }

  @action.bound
  private select(items: Schema[]) {
    const [item] = items;
    this.setSelectedSchema(item.title);
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value: item.name,
        propertyName: property.name
      });
    }

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

  @action.bound
  private setSchemas(allSchemas: Schema[]) {
    const property = this.props.property as PropertySchemaCustom;
    const onlyWithGeometry = Boolean(property.onlyWithGeometry);
    this.schemas = onlyWithGeometry ? allSchemas.filter(({ geometryType }) => geometryType) : allSchemas;
  }

  @action.bound
  private setSelectedSchema(selectedSchema: string) {
    this.selectedSchema = selectedSchema;
  }
}
