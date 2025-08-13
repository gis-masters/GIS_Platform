import React, { ChangeEvent, Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Input, SelectChangeEvent, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { ContentType, PropertyOption, PropertySchema, Schema } from '../../services/data/schema/schema.models';
import { applyContentType, applyView } from '../../services/data/schema/schema.utils';
import { isLinear, isPoint, isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { Card } from '../Card/Card';
import { CardDescription } from '../Card/Description/Card-Description';
import { CardRow } from '../Card/Row/Card-Row';
import { CardRowTitle } from '../Card/RowTitle/Card-RowTitle';
import { CardValue } from '../Card/Value/Card-Value';
import { GeometryIcon } from '../GeometryIcon/GeometryIcon';
import { SchemaProperties } from '../SchemaProperties/SchemaProperties';
import { Select } from '../Select/Select';

const EMPTY = '~~~empty_value~~~';

export const cnSchemaCard = cn('SchemaCard');

export interface SchemaCardProps extends IClassNameProps {
  schema: Schema;
  readonly: boolean;
  onSchemaChange(currentSchema: Schema): void;
  onError(error: string): void;
}

@observer
export class SchemaCard extends Component<SchemaCardProps> {
  @observable private selectedViewId: string = EMPTY;
  @observable private selectedContentTypeId: string = EMPTY;
  @observable open: boolean = false;

  constructor(props: SchemaCardProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { readonly } = this.props;

    return (
      this.schemaWithAppliedType && (
        <>
          <Card className={cnSchemaCard()}>
            <CardRow>
              <CardRowTitle>Название:</CardRowTitle>
              {readonly && this.schemaWithAppliedType.title}

              {!readonly && (
                <Input value={this.schemaWithAppliedType.title} fullWidth onChange={this.editSchemaTitle} />
              )}
            </CardRow>

            {this.schemaWithAppliedType.description && (
              <CardRow>
                <CardRowTitle>Описание:</CardRowTitle>
                {!this.editableDescription && (
                  <CardDescription>{this.schemaWithAppliedType.description}</CardDescription>
                )}

                {this.editableDescription && (
                  <Input
                    value={this.schemaWithAppliedType.description}
                    fullWidth
                    onChange={this.editSchemaDescription}
                  />
                )}
              </CardRow>
            )}
            <CardRow>
              <CardRowTitle>Идентификатор:</CardRowTitle>
              {this.schemaWithAppliedType.name}
            </CardRow>
            <CardRow>
              <CardRowTitle>Только для чтения:</CardRowTitle>
              {this.schemaWithAppliedType.readOnly ? 'да' : 'нет'}
            </CardRow>
            {this.schemaWithAppliedType.styleName || this.schemaWithAppliedType.styleName === '' ? (
              <CardRow>
                <CardRowTitle>Стиль:</CardRowTitle>
                {readonly && this.schemaWithAppliedType.styleName}
                {!readonly && this.schemaWithAppliedType.geometryType && (
                  <Input value={this.schemaWithAppliedType.styleName} onChange={this.editSchemaStyleName} />
                )}
              </CardRow>
            ) : null}
            {this.schemaWithAppliedType.geometryType ? (
              <CardRow>
                <CardRowTitle>Тип геометрии:</CardRowTitle>
                <Tooltip title={this.getGeometryType()}>
                  <CardValue>
                    <GeometryIcon colorized size='small' geometryType={this.schemaWithAppliedType.geometryType} />
                  </CardValue>
                </Tooltip>
              </CardRow>
            ) : null}
            {this.schemaWithAppliedType.views?.length ? (
              <CardRow>
                <CardRowTitle>Представление:</CardRowTitle>
                <Select options={this.viewsOptions} onChange={this.handleViewChange} value={this.selectedViewId} />
              </CardRow>
            ) : null}
            {this.schemaWithAppliedType.contentTypes?.length ? (
              <CardRow>
                <CardRowTitle>Тип документа:</CardRowTitle>
                <Select
                  options={this.contentTypesOptions}
                  onChange={this.handleContentTypeChange}
                  value={this.selectedContentTypeId}
                />
              </CardRow>
            ) : null}

            {this.schemaWithAppliedType && (
              <CardRow alignBlock>
                <CardRowTitle>Свойства:</CardRowTitle>
                <CardValue block>
                  <SchemaProperties
                    readonly={readonly}
                    schema={this.schemaWithAppliedType}
                    propertiesSchemaWithoutContentType={
                      this.selectedViewId || this.selectedContentTypeId ? this.props.schema.properties : undefined
                    }
                    onPropertyChange={this.editSchemaProperty}
                  />
                </CardValue>
              </CardRow>
            )}
          </Card>
        </>
      )
    );
  }

  @computed
  private get editableDescription(): boolean {
    return this.selectedContentTypeId === EMPTY && this.selectedViewId === EMPTY && !this.props.readonly;
  }

  @computed
  private get schemaWithAppliedType(): Schema {
    const { schema } = this.props;
    const clearedSchema = cloneDeep(schema);

    delete clearedSchema.appliedContentType;
    delete clearedSchema.appliedView;

    if (this.selectedViewId !== EMPTY) {
      return applyView(clearedSchema, this.selectedViewId);
    }

    if (this.selectedContentTypeId !== EMPTY) {
      return applyContentType(clearedSchema, this.selectedContentTypeId);
    }

    return clearedSchema;
  }

  @computed
  private get viewsOptions(): PropertyOption[] {
    return [{ title: 'Без представления', value: EMPTY }, ...this.getOptions(this.props.schema.views)];
  }

  @computed
  private get contentTypesOptions(): PropertyOption[] {
    return [{ title: 'Без контент типа', value: EMPTY }, ...this.getOptions(this.props.schema.contentTypes)];
  }

  private getGeometryType() {
    const geometryType = this.props.schema.geometryType;

    if (geometryType) {
      if (isLinear(geometryType)) {
        return 'линейный';
      } else if (isPoint(geometryType)) {
        return 'точечный';
      } else if (isPolygonal(geometryType)) {
        return 'полигональный';
      }

      return 'неподдерживаемый тип геометрии';
    }

    return 'без геометрии';
  }

  private getOptions(types?: ContentType[]): PropertyOption[] {
    if (!types) {
      return [];
    }

    return types.map(el => {
      return { title: el.title || el.id, value: el.id };
    });
  }

  @boundMethod
  private handleViewChange(event: SelectChangeEvent<unknown>) {
    if (typeof event.target.value !== 'string') {
      throw new TypeError('Некорректное значение поля');
    }

    this.setSelectedViewId(event.target.value);
  }

  @boundMethod
  private handleContentTypeChange(event: SelectChangeEvent<unknown>) {
    if (typeof event.target.value !== 'string') {
      throw new TypeError('Некорректное значение поля');
    }

    this.setSelectedContentTypeId(event.target.value);
  }

  @action
  private setSelectedViewId(viewId: string): void {
    this.selectedViewId = viewId;
    this.selectedContentTypeId = EMPTY;
  }

  @action
  private setSelectedContentTypeId(contentTypeId: string) {
    this.selectedContentTypeId = contentTypeId;
    this.selectedViewId = EMPTY;
  }

  @action.bound
  private editSchemaProperty(newPropertySchema: PropertySchema) {
    this.props.onError('');
    const { schema } = this.props;
    const newSchema = cloneDeep(schema);

    if (this.selectedViewId === EMPTY && this.selectedContentTypeId === EMPTY) {
      newSchema.properties = newSchema.properties.map(property => {
        if (property.name === newPropertySchema.name) {
          return newPropertySchema;
        }

        return property;
      });

      this.props.onSchemaChange(newSchema);
    }

    if (this.selectedViewId && this.selectedViewId !== EMPTY) {
      newSchema.views = newSchema.views?.map(view => {
        if (view.id === this.selectedViewId) {
          view.properties = view.properties.map(property => {
            if (property.name === newPropertySchema.name) {
              return newPropertySchema;
            }

            return property;
          });
        }

        return view;
      });

      this.props.onSchemaChange(newSchema);
    }

    if (this.selectedContentTypeId && this.selectedContentTypeId !== EMPTY) {
      newSchema.contentTypes = newSchema.contentTypes?.map(contentType => {
        if (contentType.id === this.selectedContentTypeId) {
          contentType.properties = contentType.properties.map(property => {
            if (property.name === newPropertySchema.name) {
              return newPropertySchema;
            }

            return property;
          });
        }

        return contentType;
      });

      this.props.onSchemaChange(newSchema);
    }
  }

  @boundMethod
  private editSchemaDescription(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.editSchemaInfo({ description: event.target.value });
  }

  @boundMethod
  private editSchemaTitle(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.editSchemaInfo({ title: event.target.value });
  }

  @boundMethod
  private editSchemaStyleName(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    this.editSchemaInfo({ styleName: event.target.value });
  }

  @action.bound
  private editSchemaInfo(newSchemaInfo?: Partial<Schema>) {
    const { schema } = this.props;
    const newSchema = cloneDeep(schema);

    if (this.selectedViewId === EMPTY && this.selectedContentTypeId === EMPTY) {
      this.props.onSchemaChange({ ...schema, ...newSchemaInfo });
    }

    if (this.selectedViewId && this.selectedViewId !== EMPTY) {
      newSchema.views = newSchema.views?.map(view => {
        if (view.id === this.selectedViewId) {
          return { ...view, ...newSchemaInfo };
        }

        return view;
      });

      this.props.onSchemaChange(newSchema);
    }

    if (this.selectedContentTypeId && this.selectedContentTypeId !== EMPTY) {
      newSchema.contentTypes = newSchema.contentTypes?.map(contentType => {
        if (contentType.id === this.selectedContentTypeId) {
          return { ...contentType, ...newSchemaInfo };
        }

        return contentType;
      });

      this.props.onSchemaChange(newSchema);
    }
  }
}
