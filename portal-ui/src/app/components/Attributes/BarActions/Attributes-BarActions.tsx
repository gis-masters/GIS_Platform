import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../../stores/Map.store';
import { CrgVectorLayer } from '../../../services/gis/projects.models';
import { WfsFeature } from '../../../services/geoserver/wfs.models';
import { PageOptions } from '../../../services/models';
import { XTableColumn } from '../../XTable/XTable';

import { AttributesBarActionExport } from '../BarActionExport/Attributes-BarActionExport';
import { AttributesTableRecord } from '../Table/Attributes-Table';

import '!style-loader!css-loader!sass-loader!./Attributes-BarActions.scss';

const cnAttributesBarActions = cn('Attributes', 'BarActions');

interface AttributesBarActionsProps {
  layer: CrgVectorLayer;
  cols: XTableColumn<AttributesTableRecord>[];
  pageOptions: PageOptions;
  featuresTotal: number;
  getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]>;
}

@observer
export class AttributesBarActions extends Component<AttributesBarActionsProps> {
  constructor(props: AttributesBarActionsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { layer, cols, pageOptions, featuresTotal, getData } = this.props;
    // кнопки пока временно скрыты
    // const count = this.selectedFeatures.length;
    // const objLabel = ` ${count} объект${pluralize(count, '', 'а', 'ов')}`;
    // const objToOtherLabel = objLabel + ' в другой слой';

    return (
      <div className={cnAttributesBarActions()}>
        {/* {!!count && (
          <>
            <Tooltip title={`Копировать${objToOtherLabel}`}>
              <IconButton size='small'>
                <ContentCopyOutlined fontSize='small' />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Переместить${objToOtherLabel}`}>
              <IconButton size='small'>
                <ContentPasteGoOutlined fontSize='small' />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Удалить${objLabel}`}>
              <IconButton size='small'>
                <DeleteOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </>
        )} */}

        {!!featuresTotal && (
          <AttributesBarActionExport
            layer={layer}
            cols={cols}
            pageOptions={pageOptions}
            featuresTotal={featuresTotal}
            getData={getData}
          />
        )}
      </div>
    );
  }

  @computed
  private get selectedFeatures(): WfsFeature[] {
    return mapStore.selectedFeaturesByTableName[this.props.layer.tableName] || [];
  }
}
