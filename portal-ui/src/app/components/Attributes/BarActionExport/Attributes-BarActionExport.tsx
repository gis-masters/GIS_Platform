import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { FileUploadOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { applyView, getReadablePropertyValue } from '../../../services/data/schema/schema.utils';
import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { exportAsXLSX } from '../../../services/util/export';
import { PageOptions } from '../../../services/models';
import { services } from '../../../services/services';
import { XTableColumn } from '../../XTable/XTable.models';
import { IconButton } from '../../IconButton/IconButton';
import { Toast } from '../../Toast/Toast';

import { AttributesTableRecord } from '../Table/Attributes-Table';

import '!style-loader!css-loader!sass-loader!./Attributes-BarActionExport.scss';

const cnAttributesBarActionExport = cn('Attributes', 'BarActionExport');

interface AttributesBarActionExportProps {
  layer: CrgVectorLayer;
  cols: XTableColumn<AttributesTableRecord>[];
  pageOptions?: PageOptions;
  featuresTotal: number;
  getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]>;
}

@observer
export class AttributesBarActionExport extends Component<AttributesBarActionExportProps> {
  @observable private busy = false;

  constructor(props: AttributesBarActionExportProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <IconButton
        className={cnAttributesBarActionExport()}
        loading={this.busy}
        disabled={this.busy}
        onClick={this.export}
        size='small'
      >
        <Tooltip title='Экспортировать текущую таблицу в XLSX'>
          <FileUploadOutlined fontSize='small' />
        </Tooltip>
      </IconButton>
    );
  }

  @boundMethod
  private async export() {
    this.setBusy(true);

    try {
      const { layer, pageOptions, featuresTotal, getData } = this.props;
      const [records] = await getData({ ...pageOptions, page: 0, pageSize: featuresTotal });

      exportAsXLSX(await this.prepareFeatures(records), layer.tableName);
    } catch (error) {
      Toast.error('Ошибка при экспорте данных');
      services.logger.error(error);
    }

    this.setBusy(false);
  }

  private async prepareFeatures(records: AttributesTableRecord[]): Promise<unknown[][]> {
    const { layer, cols } = this.props;
    const schema = applyView(await getLayerSchema(layer), layer.view);
    const properties: PropertySchema[] = [
      { name: 'cutId', title: 'ID', propertyType: PropertyType.INT },
      ...cols
        .filter(({ field, hidden }) => field && !hidden)
        .map(({ field }) => schema.properties.find(({ name }) => name.toLowerCase() === String(field).toLowerCase()))
        .filter(notFalsyFilter)
    ];
    const header = properties.map(prop => prop.title || prop.name);
    const body = records.map(feature => this.prepareFeature(properties, feature));

    return [header, ...body];
  }

  private prepareFeature(properties: PropertySchema[], record: AttributesTableRecord): unknown[] {
    return properties.map(property =>
      getReadablePropertyValue(record[property.name] || record[property.name.toLowerCase()], property)
    );
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
