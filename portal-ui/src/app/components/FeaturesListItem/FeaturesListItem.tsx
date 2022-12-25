import React, { Component, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { ArrowForward } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { observable, action, makeObservable } from 'mobx';

import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { PropertyType } from '../../services/data/schema.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { schemaService } from '../../services/data/schema.service';
import { FeatureError } from '../../services/map/map-link-following.service';
import { WFS_FEATURE_ID_DELIMITER } from '../../services/geoserver/wfs.service';
import { changeSchemaNamesCaseByFeature } from '../../services/data/schema.utils';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');

interface FeaturesListItemProps {
  feature?: WfsFeature;
  onSelect?: (item: WfsFeature) => void;
  onHighlight?: (item: WfsFeature) => void;
  highlighted?: boolean;
  errorData?: FeatureError;
  message?: string;
  style?: CSSProperties;
}

@observer
export class FeaturesListItem extends Component<FeaturesListItemProps> {
  @observable private title = '';
  @observable private layerTitle = '';

  constructor(props: FeaturesListItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (!this.props.errorData) {
      await this.defineAndFillTitles();
    }
  }

  render() {
    const { feature, highlighted, errorData, style } = this.props;

    return (
      <div className={cnFeaturesListItem({ highlighted })} style={style}>
        <div
          className={cnFeaturesListItem('Id', { disabled: !!errorData })}
          onDoubleClick={this.selectIt}
          onClick={this.highlightIt}
        >
          {errorData ? errorData.id : feature.id.split('.')[1]}
        </div>
        <div className={cnFeaturesListItem('Title', { disabled: !!errorData })}>
          {errorData ? errorData.message : this.title}
        </div>
        <div className={cnFeaturesListItem('Layer')}>{errorData ? errorData.layerTitle : this.layerTitle}</div>
        {!errorData && (
          <div className={cnFeaturesListItem('Buttons')}>
            <ZoomToFeature feature={feature} onClick={this.zoomHandler} />
            <Tooltip title='Открыть'>
              <IconButton onClick={this.selectIt}>
                <ArrowForward />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  private async defineAndFillTitles() {
    const { feature } = this.props;

    const tableName = this.extractTableName(feature.id);
    const layer = currentProject.getLayerByTableName(tableName);
    const rawSchema = await schemaService.getSchema(layer.schemaId);
    if (!rawSchema) {
      throw new Error(`Не удалось найти схему: ${layer.schemaId}`);
    }
    const schema = changeSchemaNamesCaseByFeature(rawSchema, feature);

    let title = '';
    const property = schema.properties.find(prop => prop.asTitle);
    if (property) {
      if (property.propertyType !== PropertyType.CHOICE) {
        title = String(feature.properties[property.name]);
      } else if (property.options) {
        // eslint-disable-next-line eqeqeq -- тут так надо
        const valueTitleProjection = property.options.find(item => item.value == feature.properties[property.name]);
        title = valueTitleProjection ? valueTitleProjection.title : '';
      }
    } else {
      title = String(feature.properties.name || feature.properties.title);
    }

    this.setTitles(title, layer.title || schema.title);
  }

  @action
  private setTitles(title: string, layerTitle: string) {
    this.title = title;
    this.layerTitle = layerTitle;
  }

  @boundMethod
  private selectIt() {
    if (!this.props.errorData) {
      const { onSelect, feature } = this.props;
      onSelect(feature);
    }
  }

  @boundMethod
  private highlightIt() {
    if (!this.props.errorData) {
      const { feature, highlighted, onHighlight } = this.props;
      onHighlight(highlighted ? null : feature);
    }
  }

  @boundMethod
  private zoomHandler() {
    this.props.onHighlight(this.props.feature);
  }

  private extractTableName(id: string) {
    const [tableName] = id.split(WFS_FEATURE_ID_DELIMITER);
    if (!tableName) {
      throw new Error('Incorrect wfs feature id: ' + id);
    }

    return tableName;
  }
}
