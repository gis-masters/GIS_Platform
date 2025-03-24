import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { FileUploadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchema } from '../../../services/data/schema/schema.models';
import { applyView, getReadablePropertyValue } from '../../../services/data/schema/schema.utils';
import { CrgVectorableLayer, isVectorLayer } from '../../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { PageOptions } from '../../../services/models';
import { services } from '../../../services/services';
import { exportAsXLSX } from '../../../services/util/export';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { IconButton } from '../../IconButton/IconButton';
import { Toast } from '../../Toast/Toast';
import { XTableColumn } from '../../XTable/XTable.models';
import { AttributesTableRecord } from '../Attributes.models';

import '!style-loader!css-loader!sass-loader!./Attributes-BarActionExport.scss';

const cnAttributesBarActionExport = cn('Attributes', 'BarActionExport');

interface AttributesBarActionExportProps {
  layer: CrgVectorableLayer;
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
      <Tooltip title='Экспортировать текущую таблицу в XLSX'>
        <span>
          <IconButton
            className={cnAttributesBarActionExport()}
            loading={this.busy}
            disabled={this.busy}
            onClick={this.export}
            size='small'
          >
            <FileUploadOutlined fontSize='small' />
          </IconButton>
        </span>
      </Tooltip>
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
    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не найдена схема слоя: ${layer.tableName}`);
    }

    const schemaWithView = isVectorLayer(layer) && layer.view ? applyView(schema, layer.view) : schema;

    const properties: PropertySchema[] = cols
      .filter(({ field, hidden }) => field && !hidden)
      .map(({ field }) =>
        schemaWithView.properties.find(({ name }) => name.toLowerCase() === String(field).toLowerCase())
      )
      .filter(notFalsyFilter);
    const header = properties.map(prop => prop.title || prop.name);
    const body = records.map(record => this.prepareFeature(properties, record));

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
