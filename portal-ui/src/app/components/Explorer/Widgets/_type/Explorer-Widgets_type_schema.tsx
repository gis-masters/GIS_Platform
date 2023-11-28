import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, makeObservable, observable } from 'mobx';
import { withBemMod } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { SelectChangeEvent } from '@mui/material/Select/Select';

import { applyContentType, applyView } from '../../../../services/data/schema/schema.utils';
import { SchemaProperties } from '../../../SchemaProperties/SchemaProperties';
import { ContentType, PropertyOption, Schema } from '../../../../services/data/schema/schema.models';
import { Select } from '../../../../components/Select/Select';

import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets } from '../Explorer-Widgets.base';

import '!style-loader!css-loader!sass-loader!../../InfoBoxTitle/Explorer-InfoBoxTitle.scss';
import '!style-loader!css-loader!sass-loader!./Explorer-Widgets_type_schema.scss';

const cnExplorerInfoBoxTitle = cn('Explorer', 'InfoBoxTitle');
const cnExplorerWidgetsTypeSchemaItemType = cn('ExplorerWidgetsTypeSchema', 'ItemType');

const EMPTY = '~~~empty_value~~~';

interface ExplorerWidgetsTypeSchemaProps {
  className: string;
  item: ExplorerItemData<Schema>;
}

@observer
export class ExplorerWidgetsTypeSchema extends Component<ExplorerWidgetsTypeSchemaProps> {
  @observable private selectedViewId: string = EMPTY;
  @observable private selectedContentTypeId: string = EMPTY;

  constructor(props: ExplorerWidgetsTypeSchemaProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, item } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {item.payload.views?.length ? (
          <ExplorerInfoDescItem className={cnExplorerWidgetsTypeSchemaItemType()}>
            <ExplorerInfoDescTitle>Представление:</ExplorerInfoDescTitle>
            <Select options={this.viewsOptions} onChange={this.changeViewHadler} value={this.selectedViewId} />
          </ExplorerInfoDescItem>
        ) : null}
        {item.payload.contentTypes?.length ? (
          <ExplorerInfoDescItem className={cnExplorerWidgetsTypeSchemaItemType()}>
            <ExplorerInfoDescTitle>Тип документа:</ExplorerInfoDescTitle>
            <Select
              options={this.contentTypesOptions}
              onChange={this.changeContentTypeHandler}
              value={this.selectedContentTypeId}
            />
          </ExplorerInfoDescItem>
        ) : null}
        <span className={cnExplorerInfoBoxTitle()}>Свойства:</span>
        <SchemaProperties schema={this.schemaWithAppliedType} />
      </div>
    );
  }

  @computed
  private get schemaWithAppliedType(): Schema {
    if (this.selectedViewId !== EMPTY) {
      return applyView(this.props.item.payload, this.selectedViewId);
    }
    if (this.selectedContentTypeId !== EMPTY) {
      return applyContentType(this.props.item.payload, this.selectedContentTypeId);
    }

    return this.props.item.payload;
  }

  @computed
  private get viewsOptions(): PropertyOption[] {
    return [{ title: 'Без представления', value: EMPTY }, ...this.getOptions(this.props.item.payload.views)];
  }

  @computed
  private get contentTypesOptions(): PropertyOption[] {
    return [{ title: 'Все свойства', value: EMPTY }, ...this.getOptions(this.props.item.payload.contentTypes)];
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
  private changeViewHadler(event: SelectChangeEvent<unknown>) {
    if (typeof event.target.value !== 'string') {
      throw new TypeError('Некорректное значение поля');
    }

    this.setSelectedViewId(event.target.value);
  }

  @boundMethod
  private changeContentTypeHandler(event: SelectChangeEvent<unknown>) {
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

export const withTypeSchema = withBemMod<ExplorerWidgetsTypeSchemaProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.SCHEMA },
  () => ExplorerWidgetsTypeSchema
);
