import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { observer } from 'mobx-react';
import { action, computed, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { Dialog, DialogActions, DialogContent, DialogTitle, SelectChangeEvent, Tooltip } from '@mui/material';

import { applyContentType, applyView } from '../../services/data/schema/schema.utils';
import { isLinear, isPoint, isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { ContentType, PropertyOption, Schema } from '../../services/data/schema/schema.models';
import { CardRow } from '../Card/Row/Card-Row';
import { Card } from '../Card/Card';
import { CardDescription } from '../Card/Description/Card-Description';
import { CardRowTitle } from '../Card/RowTitle/Card-RowTitle';
import { CardValue } from '../Card/Value/Card-Value';
import { LayerIcon } from '../LayerIcon/LayerIcon.composed';
import { Select } from '../../components/Select/Select';
import { SchemaProperties } from '../SchemaProperties/SchemaProperties';
import { SchemaActions } from '../SchemaActions/SchemaActions';
import { SchemaDialogButton } from './Button/SchemaDialog-Button';

const EMPTY = '~~~empty_value~~~';

export const cnSchemaDialog = cn('SchemaDialog');

export interface SchemaDialogProps extends IClassNameProps {
  schema: Schema;
}

@observer
export class SchemaDialog extends Component<SchemaDialogProps> {
  @observable private selectedViewId: string = EMPTY;
  @observable private selectedContentTypeId: string = EMPTY;

  @observable open: boolean = false;
  constructor(props: SchemaDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, schema } = this.props;

    return (
      <>
        <SchemaDialogButton onOpen={this.openDialog} />

        <Dialog open={this.open} fullWidth maxWidth='md' className={cnSchemaDialog(null, [className])}>
          <DialogTitle>{schema.title}</DialogTitle>
          <DialogContent className={cnSchemaDialog('Content')}>
            <Card>
              <CardRow>
                <CardRowTitle>Описание:</CardRowTitle>
                <CardDescription>{schema.description}</CardDescription>
              </CardRow>
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
                    <CardValue>
                      <LayerIcon colorized size='small' type='vector' schemaId={schema.name} />
                    </CardValue>
                  </Tooltip>
                </CardRow>
              ) : null}
              {schema.views?.length ? (
                <CardRow>
                  <CardRowTitle>Представление:</CardRowTitle>
                  <Select options={this.viewsOptions} onChange={this.changeViewHadler} value={this.selectedViewId} />
                </CardRow>
              ) : null}
              {schema.contentTypes?.length ? (
                <CardRow>
                  <CardRowTitle>Тип документа:</CardRowTitle>
                  <Select
                    options={this.contentTypesOptions}
                    onChange={this.changeContentTypeHandler}
                    value={this.selectedContentTypeId}
                  />
                </CardRow>
              ) : null}
              <CardRow alignBlock>
                <CardRowTitle>Свойства:</CardRowTitle>
                <CardValue block>
                  <SchemaProperties schema={this.schemaWithAppliedType} />
                </CardValue>
              </CardRow>
            </Card>
          </DialogContent>
          <DialogActions>
            <SchemaActions forDialog onClose={this.closeDialog} schema={schema} as='button' />
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get schemaWithAppliedType(): Schema {
    if (this.selectedViewId !== EMPTY) {
      return applyView(this.props.schema, this.selectedViewId);
    }
    if (this.selectedContentTypeId !== EMPTY) {
      return applyContentType(this.props.schema, this.selectedContentTypeId);
    }

    return this.props.schema;
  }

  @computed
  private get viewsOptions(): PropertyOption[] {
    return [{ title: 'Без представления', value: EMPTY }, ...this.getOptions(this.props.schema.views)];
  }

  @computed
  private get contentTypesOptions(): PropertyOption[] {
    return [{ title: 'Все свойства', value: EMPTY }, ...this.getOptions(this.props.schema.contentTypes)];
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

  @action.bound
  private openDialog() {
    this.open = true;
  }

  @action.bound
  private closeDialog() {
    this.open = false;
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
  private setSelectedViewId(viewId: string): void {
    this.selectedViewId = viewId;
    this.selectedContentTypeId = EMPTY;
  }

  @action
  private setSelectedContentTypeId(contentTypeId: string) {
    this.selectedContentTypeId = contentTypeId;
    this.selectedViewId = EMPTY;
  }
}
