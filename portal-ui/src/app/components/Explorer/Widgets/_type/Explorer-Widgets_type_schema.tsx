import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select/Select';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { Card } from '../../../../components/Card/Card';
import { CardRow } from '../../../../components/Card/Row/Card-Row';
import { CardRowTitle } from '../../../../components/Card/RowTitle/Card-RowTitle';
import { CardValue } from '../../../../components/Card/Value/Card-Value';
import { Select } from '../../../../components/Select/Select';
import { ContentType, PropertyOption, Schema } from '../../../../services/data/schema/schema.models';
import { applyContentType, applyView } from '../../../../services/data/schema/schema.utils';
import { isLinear, isPoint, isPolygonal } from '../../../../services/geoserver/wfs/wfs.util';
import { GeometryIcon } from '../../../GeometryIcon/GeometryIcon';
import { SchemaProperties } from '../../../SchemaProperties/SchemaProperties';
import { TagsList } from '../../../TagsList/TagsList';
import { assertExplorerItemDataTypeSchema } from '../../Adapter/_type/Explorer-Adapter_type_schema';
import { ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

const EMPTY = '~~~empty_value~~~';

@observer
export class ExplorerWidgetsTypeSchema extends Component<ExplorerWidgetsProps> {
  @observable private selectedViewId: string = EMPTY;
  @observable private selectedContentTypeId: string = EMPTY;

  constructor(props: ExplorerWidgetsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, item } = this.props;
    assertExplorerItemDataTypeSchema(item);
    const schema = item.payload;
    const { tags } = schema;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        <Card>
          <CardRow>
            <CardRowTitle>Идентификатор:</CardRowTitle>
            {schema.name}
          </CardRow>
          <CardRow>
            <CardRowTitle>Только для чтения:</CardRowTitle>
            {schema.readOnly ? 'да' : 'нет'}
          </CardRow>
          {schema.styleName ? (
            <CardRow>
              <CardRowTitle>Стиль:</CardRowTitle>
              {schema.styleName}
            </CardRow>
          ) : null}
          {schema.geometryType ? (
            <CardRow>
              <CardRowTitle>Тип геометрии:</CardRowTitle>
              <Tooltip title={this.getGeometryType()}>
                <span>
                  <CardValue>
                    <GeometryIcon colorized size='small' geometryType={schema.geometryType} />
                  </CardValue>
                </span>
              </Tooltip>
            </CardRow>
          ) : null}
          {schema.views?.length ? (
            <CardRow>
              <CardRowTitle>Представление:</CardRowTitle>
              <CardValue>
                <Select options={this.viewsOptions} onChange={this.handleViewChange} value={this.selectedViewId} />
              </CardValue>
            </CardRow>
          ) : null}
          {schema.contentTypes?.length ? (
            <CardRow>
              <CardRowTitle>Тип документа:</CardRowTitle>
              <Select
                options={this.contentTypesOptions}
                onChange={this.handleContentTypeChange}
                value={this.selectedContentTypeId}
              />
            </CardRow>
          ) : null}
          {!!tags?.length && (
            <CardRow>
              <CardRowTitle>
                Тэги: <TagsList tags={tags} />
              </CardRowTitle>
            </CardRow>
          )}
          <CardRow alignBlock>
            <CardRowTitle>Свойства:</CardRowTitle>
            <CardValue block>
              <SchemaProperties readonly schema={this.schemaWithAppliedType} />
            </CardValue>
          </CardRow>
        </Card>
      </div>
    );
  }

  @computed
  private get schemaWithAppliedType(): Schema {
    const { item } = this.props;
    assertExplorerItemDataTypeSchema(item);
    const schema = item.payload;

    if (this.selectedViewId !== EMPTY) {
      return applyView(schema, this.selectedViewId);
    }
    if (this.selectedContentTypeId !== EMPTY) {
      return applyContentType(schema, this.selectedContentTypeId);
    }

    return schema;
  }

  @computed
  private get viewsOptions(): PropertyOption[] {
    const { item } = this.props;
    assertExplorerItemDataTypeSchema(item);

    return [{ title: 'Без представления', value: EMPTY }, ...this.getOptions(item.payload.views)];
  }

  @computed
  private get contentTypesOptions(): PropertyOption[] {
    const { item } = this.props;
    assertExplorerItemDataTypeSchema(item);

    return [{ title: 'Все свойства', value: EMPTY }, ...this.getOptions(item.payload.contentTypes)];
  }

  private getGeometryType() {
    const { item } = this.props;
    assertExplorerItemDataTypeSchema(item);

    const geometryType = item.payload.geometryType;
    if (isLinear(geometryType)) {
      return 'линейный';
    } else if (isPoint(geometryType)) {
      return 'точечный';
    } else if (isPolygonal(geometryType)) {
      return 'полигональный';
    }

    return 'неопределенный тип геометрии';
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
  private setSelectedContentTypeId(contentTypeId: string) {
    this.selectedContentTypeId = contentTypeId;
    this.selectedViewId = EMPTY;
  }

  @action
  private setSelectedViewId(viewId: string): void {
    this.selectedViewId = viewId;
    this.selectedContentTypeId = EMPTY;
  }
}

export const withTypeSchema = withBemMod<ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.SCHEMA },
  () => ExplorerWidgetsTypeSchema
);
