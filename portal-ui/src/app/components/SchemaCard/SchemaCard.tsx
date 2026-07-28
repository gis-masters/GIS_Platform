import React, { type ChangeEvent, Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Box,
  Checkbox,
  Chip,
  Input,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
  Tooltip
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import {
  type ContentType,
  type PropertyOption,
  type PropertySchema,
  PropertyType,
  type Schema
} from '../../services/data/schema/schema.models';
import { applyContentType } from '../../services/data/schema/utils/applyContentType';
import { applyView } from '../../services/data/schema/utils/applyView';
import {
  GeometryType,
  type SupportedGeometryType,
  supportedGeometryTypes
} from '../../services/geoserver/wfs/wfs.models';
import { isLinear, isPoint, isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { getSchemaTagsOptions } from '../../services/util/form/getSchemaTagsOptions';
import { isArray } from '../../services/util/typeGuards/isArray';
import { Card } from '../Card/Card';
import { CardDescription } from '../Card/Description/Card-Description';
import { CardRow } from '../Card/Row/Card-Row';
import { CardRowTitle } from '../Card/RowTitle/Card-RowTitle';
import { CardValue } from '../Card/Value/Card-Value';
import { GeometryIcon } from '../GeometryIcon/GeometryIcon';
import { IconButton } from '../IconButton/IconButton';
import { SchemaPropertiesCreateItem } from '../SchemaProperties/createItem/SchemaProperties-CreateItem';
import { SchemaProperties } from '../SchemaProperties/SchemaProperties';
import { Select } from '../Select/Select';

import './SchemaCard.scss';

const EMPTY = '~~~empty_value~~~';
const NO_GEOMETRY = '~~~no_geometry~~~';
const WRONG_VALUE = 'Некорректное значение поля';

export const cnSchemaCard = cn('SchemaCard');

export interface SchemaCardProps extends IClassNameProps {
  schema: Schema;
  readonly: boolean;
  editing?: boolean;
  onSchemaChange(currentSchema: Schema): void;
  onError(error: string): void;
}

@observer
export class SchemaCard extends Component<SchemaCardProps> {
  @observable private selectedViewId: string = EMPTY;
  @observable private selectedContentTypeId: string = EMPTY;
  @observable open: boolean = false;
  @observable private initialSchemaTags: string[] = [];
  @observable private createPropertyDialogOpen: boolean = false;

  constructor(props: SchemaCardProps) {
    super(props);

    this.initialSchemaTags = isArray(props.schema.tags)
      ? props.schema.tags.filter((tag): tag is string => typeof tag === 'string')
      : [];

    makeObservable(this);
  }

  render() {
    const { readonly, editing } = this.props;

    return (
      this.schemaWithAppliedType && (
        <>
          <Card className={cnSchemaCard()}>
            <CardRow>
              <CardRowTitle>Наименование:</CardRowTitle>

              {this.schemaWithAppliedType.name}
            </CardRow>

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
                    multiline
                    onChange={this.editSchemaDescription}
                  />
                )}
              </CardRow>
            )}

            <CardRow>
              <CardRowTitle>Наименование таблицы:</CardRowTitle>

              {this.schemaWithAppliedType.tableName}
            </CardRow>

            <CardRow>
              <CardRowTitle>Идентификатор:</CardRowTitle>

              {this.schemaWithAppliedType.originName}
            </CardRow>

            <CardRow>
              <CardRowTitle>Только для чтения:</CardRowTitle>
              {readonly && (this.schemaWithAppliedType.readOnly ? 'да' : 'нет')}

              {!readonly && (
                <Checkbox checked={Boolean(this.schemaWithAppliedType.readOnly)} onChange={this.editSchemaReadOnly} />
              )}
            </CardRow>

            {this.schemaWithAppliedType.styleName || this.schemaWithAppliedType.styleName === '' ? (
              <CardRow>
                <CardRowTitle>Стиль:</CardRowTitle>
                {readonly && this.schemaWithAppliedType.styleName}
                {!readonly && this.schemaWithAppliedType.geometryType && (
                  <Input fullWidth value={this.schemaWithAppliedType.styleName} onChange={this.editSchemaStyleName} />
                )}
              </CardRow>
            ) : null}

            {(!readonly || this.schemaWithAppliedType.geometryType) && (
              <CardRow>
                <CardRowTitle>Тип геометрии:</CardRowTitle>

                {(readonly || !this.canEditTemplateFields) &&
                  (this.normalizedGeometryType ? (
                    <Tooltip title={this.getGeometryType()}>
                      <CardValue>
                        <div className={cnSchemaCard('GeometryTypeView')}>
                          <GeometryIcon colorized size='small' geometryType={this.normalizedGeometryType} />
                          {this.getGeometryTypeTitle(this.normalizedGeometryType)}
                        </div>
                      </CardValue>
                    </Tooltip>
                  ) : (
                    <CardValue>Схема не содержит геометрию</CardValue>
                  ))}

                {!readonly && this.canEditTemplateFields && (
                  <CardValue>
                    <Select
                      className={cnSchemaCard('GeometryTypeSelect')}
                      options={this.geometryTypeOptions}
                      value={this.normalizedGeometryType ?? NO_GEOMETRY}
                      onChange={this.handleGeometryTypeChange}
                      renderValue={this.renderGeometryTypeValue}
                    />
                  </CardValue>
                )}
              </CardRow>
            )}

            {(!readonly || this.selectedTags.length > 0) && (
              <CardRow>
                <CardRowTitle>Теги:</CardRowTitle>

                {readonly && (
                  <CardValue>
                    {this.selectedTags.length ? (
                      <Box className={cnSchemaCard('TagsContainer')}>
                        {this.selectedTags.map(tag => (
                          <Chip key={tag} label={tag} size='small' />
                        ))}
                      </Box>
                    ) : (
                      'Не выбрано'
                    )}
                  </CardValue>
                )}

                {!readonly && (
                  <CardValue>
                    <MuiSelect
                      className={cnSchemaCard('TagsSelect')}
                      variant='standard'
                      fullWidth
                      multiple
                      displayEmpty
                      value={this.selectedTags}
                      onChange={this.handleTagsChange}
                      renderValue={this.renderTagsValue}
                    >
                      {this.tagsOptions.map(option => (
                        <MenuItem key={String(option.value)} value={String(option.value)}>
                          <Checkbox checked={this.selectedTags.includes(String(option.value))} />
                          <ListItemText primary={option.title} />
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </CardValue>
                )}
              </CardRow>
            )}

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
                <div>
                  <CardRowTitle>Свойства:</CardRowTitle>

                  {editing && !readonly && (
                    <Box className={cnSchemaCard('CreatePropertyActions')}>
                      <Tooltip title='Добавить свойство'>
                        <IconButton size='small' color='primary' onClick={this.openCreatePropertyDialog}>
                          <AddOutlined fontSize='small' color='primary' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </div>

                <CardValue block>
                  <SchemaProperties
                    readonly={readonly}
                    editing={editing}
                    schema={this.schemaWithAppliedType}
                    propertiesSchemaWithoutContentType={
                      this.selectedViewId || this.selectedContentTypeId ? this.props.schema.properties : undefined
                    }
                    onPropertyChange={this.editSchemaProperty}
                    onPropertyDelete={this.deleteSchemaProperty}
                  />
                </CardValue>
              </CardRow>
            )}
          </Card>

          <SchemaPropertiesCreateItem
            open={this.createPropertyDialogOpen}
            onClose={this.closeCreatePropertyDialog}
            onCreate={this.createSchemaProperty}
            existingProperties={this.schemaWithAppliedType.properties}
          />
        </>
      )
    );
  }

  @computed
  private get canEditTemplateFields(): boolean {
    return this.props.editing === true;
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
  private get normalizedGeometryType(): SupportedGeometryType | undefined {
    const geometryType = this.schemaWithAppliedType.geometryType as string | undefined;

    if (!geometryType || this.isNoGeometryValue(geometryType)) {
      return undefined;
    }

    if (supportedGeometryTypes.includes(geometryType as SupportedGeometryType)) {
      return geometryType as SupportedGeometryType;
    }

    return undefined;
  }

  @computed
  private get viewsOptions(): PropertyOption[] {
    return [{ title: 'Без представления', value: EMPTY }, ...this.getOptions(this.props.schema.views)];
  }

  @computed
  private get contentTypesOptions(): PropertyOption[] {
    return [{ title: 'Без контент типа', value: EMPTY }, ...this.getOptions(this.props.schema.contentTypes)];
  }

  @computed
  private get tagsOptions(): PropertyOption[] {
    return getSchemaTagsOptions([...this.initialSchemaTags, ...this.selectedTags]);
  }

  @computed
  private get selectedTags(): string[] {
    return isArray(this.schemaWithAppliedType.tags) ? this.schemaWithAppliedType.tags : [];
  }

  private get geometryTypeOptions(): PropertyOption[] {
    return [
      {
        title: 'Без геометрии',
        value: NO_GEOMETRY
      },
      {
        value: GeometryType.MULTI_POINT,
        title: 'Точка'
      },
      {
        value: GeometryType.MULTI_LINE_STRING,
        title: 'Линия'
      },
      {
        value: GeometryType.MULTI_POLYGON,
        title: 'Полигон'
      }
    ];
  }

  private isNoGeometryValue(value?: string): boolean {
    return !value || value === 'не выбрано' || value === 'без геометрии';
  }

  private getGeometryType() {
    const geometryType = this.schemaWithAppliedType.geometryType;

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
  private renderTagsValue(selected: unknown) {
    if (!isArray(selected)) {
      return <em>Не выбрано</em>;
    }

    const tags = selected.filter((tag): tag is string => typeof tag === 'string');

    if (!tags.length) {
      return <em>Не выбрано</em>;
    }

    return (
      <Box className={cnSchemaCard('TagsContainer')}>
        {tags.map(tag => (
          <Chip key={tag} label={tag} size='small' />
        ))}
      </Box>
    );
  }

  @boundMethod
  private handleTagsChange(event: SelectChangeEvent<string[]>) {
    const value = event.target.value;

    let tags: string[] = [];

    if (isArray(value)) {
      tags = value.filter((tag): tag is string => typeof tag === 'string');
    } else if (typeof value === 'string') {
      tags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }

    this.editSchemaInfo({ tags });
  }

  @boundMethod
  private renderGeometryTypeValue(value: unknown) {
    const geometryType = typeof value === 'string' ? value : NO_GEOMETRY;
    const option = this.geometryTypeOptions.find(item => item.value === geometryType);

    return (
      <Box className={cnSchemaCard('GeometryTypeValue')}>
        {geometryType !== NO_GEOMETRY && (
          <GeometryIcon colorized size='small' geometryType={geometryType as SupportedGeometryType} />
        )}

        {option?.title ?? String(geometryType)}
      </Box>
    );
  }

  @boundMethod
  private handleViewChange(event: SelectChangeEvent<unknown>) {
    if (typeof event.target.value !== 'string') {
      throw new TypeError(WRONG_VALUE);
    }

    this.setSelectedViewId(event.target.value);
  }

  @boundMethod
  private handleContentTypeChange(event: SelectChangeEvent<unknown>) {
    if (typeof event.target.value !== 'string') {
      throw new TypeError(WRONG_VALUE);
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
  private editSchemaProperty(newPropertySchema: PropertySchema, oldName?: string) {
    this.props.onError('');

    const { schema } = this.props;
    const newSchema = cloneDeep(schema);
    const targetName = oldName ?? newPropertySchema.name;

    if (this.selectedViewId === EMPTY && this.selectedContentTypeId === EMPTY) {
      newSchema.properties = newSchema.properties.map(property => {
        if (property.name === targetName) {
          return newPropertySchema;
        }

        return property;
      });

      this.props.onSchemaChange(newSchema);

      return;
    }

    if (this.selectedViewId && this.selectedViewId !== EMPTY) {
      newSchema.views = newSchema.views?.map(view => {
        if (view.id === this.selectedViewId) {
          view.properties = view.properties.map(property => {
            if (property.name === targetName) {
              return newPropertySchema;
            }

            return property;
          });
        }

        return view;
      });

      this.props.onSchemaChange(newSchema);

      return;
    }

    if (this.selectedContentTypeId && this.selectedContentTypeId !== EMPTY) {
      newSchema.contentTypes = newSchema.contentTypes?.map(contentType => {
        if (contentType.id === this.selectedContentTypeId) {
          contentType.properties = contentType.properties.map(property => {
            if (property.name === targetName) {
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

  private getGeometryTypeTitle(geometryType?: string): string {
    return this.geometryTypeOptions.find(option => option.value === geometryType)?.title ?? 'Без геометрии';
  }

  @boundMethod
  private handleGeometryTypeChange(event: SelectChangeEvent<unknown>) {
    if (!this.canEditTemplateFields) {
      return;
    }

    if (typeof event.target.value !== 'string') {
      throw new TypeError(WRONG_VALUE);
    }

    const value = event.target.value;

    if (value === NO_GEOMETRY) {
      this.editGeometryType();

      return;
    }

    this.editGeometryType(value as SupportedGeometryType);
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

  @boundMethod
  private editSchemaReadOnly(event: ChangeEvent<HTMLInputElement>) {
    this.editSchemaInfo({ readOnly: event.target.checked });
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

  @action.bound
  private editGeometryType(geometryType?: SupportedGeometryType) {
    if (!this.canEditTemplateFields) {
      return;
    }

    const { schema } = this.props;
    const newSchema = cloneDeep(schema);

    if (this.selectedViewId === EMPTY && this.selectedContentTypeId === EMPTY) {
      this.props.onSchemaChange({
        ...newSchema,
        geometryType,
        properties: this.ensureShapeProperty(newSchema.properties, geometryType)
      });

      return;
    }

    if (this.selectedViewId && this.selectedViewId !== EMPTY) {
      newSchema.views = newSchema.views?.map(view => {
        if (view.id === this.selectedViewId) {
          return {
            ...view,
            geometryType,
            properties: this.ensureShapeProperty(view.properties, geometryType)
          };
        }

        return view;
      });

      this.props.onSchemaChange(newSchema);

      return;
    }

    if (this.selectedContentTypeId && this.selectedContentTypeId !== EMPTY) {
      newSchema.contentTypes = newSchema.contentTypes?.map(contentType => {
        if (contentType.id === this.selectedContentTypeId) {
          return {
            ...contentType,
            geometryType,
            properties: this.ensureShapeProperty(contentType.properties, geometryType)
          };
        }

        return contentType;
      });

      this.props.onSchemaChange(newSchema);
    }
  }

  private propertiesWithoutShape<T extends Partial<PropertySchema>>(properties: T[] = []): T[] {
    return properties.filter((property): property is T => property.name !== 'shape');
  }

  private ensureShapeProperty(properties: PropertySchema[], geometryType?: SupportedGeometryType): PropertySchema[];

  private ensureShapeProperty(
    properties: Partial<PropertySchema>[],
    geometryType?: SupportedGeometryType
  ): Partial<PropertySchema>[];

  private ensureShapeProperty(
    properties: Partial<PropertySchema>[] = [],
    geometryType?: SupportedGeometryType
  ): Partial<PropertySchema>[] {
    const propertiesWithoutShape = this.propertiesWithoutShape(properties);

    if (!geometryType) {
      return propertiesWithoutShape;
    }

    const shapeProperty: PropertySchema = {
      name: 'shape',
      title: 'Геометрия',
      hidden: true,
      propertyType: PropertyType.GEOMETRY
    };

    return [...propertiesWithoutShape, shapeProperty];
  }

  @action.bound
  private openCreatePropertyDialog() {
    this.createPropertyDialogOpen = true;
  }

  @action.bound
  private closeCreatePropertyDialog() {
    this.createPropertyDialogOpen = false;
  }

  @action.bound
  private createSchemaProperty(newProperty: PropertySchema): boolean {
    this.props.onError('');

    const { schema } = this.props;
    const newSchema = cloneDeep(schema);

    const addProperty = <T extends Partial<PropertySchema>>(properties: T[] = []): Array<T | PropertySchema> => {
      if (properties.some(property => property.name === newProperty.name)) {
        this.props.onError(`Свойство "${newProperty.name}" уже существует`);

        return properties;
      }

      return [...properties, newProperty];
    };

    if (this.selectedViewId === EMPTY && this.selectedContentTypeId === EMPTY) {
      const properties = addProperty(newSchema.properties);

      if (properties === newSchema.properties) {
        return false;
      }

      newSchema.properties = properties;
      this.props.onSchemaChange(newSchema);

      return true;
    }

    if (this.selectedViewId && this.selectedViewId !== EMPTY) {
      let created = true;

      newSchema.views = newSchema.views?.map(view => {
        if (view.id !== this.selectedViewId) {
          return view;
        }

        const properties = addProperty(view.properties);

        if (properties === view.properties) {
          created = false;
        }

        return { ...view, properties };
      });

      if (!created) {
        return false;
      }

      this.props.onSchemaChange(newSchema);

      return true;
    }

    if (this.selectedContentTypeId && this.selectedContentTypeId !== EMPTY) {
      let created = true;

      newSchema.contentTypes = newSchema.contentTypes?.map(contentType => {
        if (contentType.id !== this.selectedContentTypeId) {
          return contentType;
        }

        const properties = addProperty(contentType.properties);

        if (properties === contentType.properties) {
          created = false;
        }

        return { ...contentType, properties };
      });

      if (!created) {
        return false;
      }

      this.props.onSchemaChange(newSchema);

      return true;
    }

    return false;
  }

  @action.bound
  private deleteSchemaProperty(propertyName: string) {
    this.props.onError('');

    const { schema } = this.props;
    const newSchema = cloneDeep(schema);

    const removeProperty = <T extends Partial<PropertySchema>>(properties: T[] = []): T[] =>
      properties.filter(property => property.name !== propertyName);

    if (this.selectedViewId === EMPTY && this.selectedContentTypeId === EMPTY) {
      newSchema.properties = removeProperty(newSchema.properties);
      this.props.onSchemaChange(newSchema);

      return;
    }

    if (this.selectedViewId && this.selectedViewId !== EMPTY) {
      newSchema.views = newSchema.views?.map(view =>
        view.id === this.selectedViewId ? { ...view, properties: removeProperty(view.properties) } : view
      );

      this.props.onSchemaChange(newSchema);

      return;
    }

    if (this.selectedContentTypeId && this.selectedContentTypeId !== EMPTY) {
      newSchema.contentTypes = newSchema.contentTypes?.map(contentType =>
        contentType.id === this.selectedContentTypeId
          ? { ...contentType, properties: removeProperty(contentType.properties) }
          : contentType
      );

      this.props.onSchemaChange(newSchema);
    }
  }
}
