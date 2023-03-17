import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { schemaService } from '../../services/data/schema/schema.service';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { XTableColumn } from '../XTable/XTable';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SchemasSelect.scss';

const cnSchemasSelect = cn('SchemasSelect');

@observer
export class SchemasSelect extends Component<FormControlProps> {
  @observable private dialogOpen = false;
  @observable private allSchemas: Schema[];
  @observable private disabledItems: Schema[];
  @observable private selectedSchema: string;

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
    }
  ];

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    this.setAllSchemas(await schemaService.getAllSchemas());
    this.setDisabledItems();
  }

  render() {
    return (
      <>
        <div className={cnSchemasSelect()}>{this.selectedSchema}</div>
        <Button onClick={this.openDialog}>Выбрать схему</Button>
        {this.allSchemas && (
          <ChooseXTableDialog<Schema>
            title='Выберите схему'
            data={this.allSchemas}
            cols={this.cols}
            open={this.dialogOpen}
            disabledItems={this.disabledItems}
            onClose={this.closeDialog}
            onSelect={this.select}
            single
          />
        )}
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
  private setAllSchemas(allSchemas: Schema[]) {
    this.allSchemas = allSchemas
      .map(schema => {
        if (schema.geometryType) {
          return schema;
        }
      })
      .filter(Boolean);
  }

  @action.bound
  private setSelectedSchema(selectedSchema: string) {
    this.selectedSchema = selectedSchema;
  }

  @action.bound
  private setDisabledItems() {
    this.disabledItems = this.allSchemas
      .map(schema => {
        if (!schema.geometryType) {
          return schema;
        }
      })
      .filter(Boolean);
  }
}
