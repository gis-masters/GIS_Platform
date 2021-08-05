import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { currentProject } from '../../stores/CurrentProject.store';
import { WFS_FEATURE_ID_DELIMITER } from '../../services/geoserver/wfs.service';
import { schemaService } from '../../services/crg/schema.service';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { ValueType } from '../../services/crg/schema.models';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { FeatureError } from '../../services/map/map-link-following.service';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');

interface FeaturesListItemProps {
  feature?: WfsFeature;
  onSelect?: (item: WfsFeature) => void;
  onHighlight?: (item: WfsFeature) => void;
  highlighted?: boolean;
  errorData?: FeatureError;
  message?: string;
}

@observer
export class FeaturesListItem extends Component<FeaturesListItemProps> {
  @observable private title = '';
  @observable private layerTitle = '';

  constructor(props: FeaturesListItemProps) {
    super(props);

    if (!props.errorData) void this.fetchSchema();
  }

  render() {
    const { feature, highlighted, errorData } = this.props;

    return (
      <div className={cnFeaturesListItem({ highlighted })}>
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
        {!errorData ? (
          <div className={cnFeaturesListItem('Buttons')}>
            <ZoomToFeature feature={feature} onClick={this.zoomHandler} />
            <Tooltip title='Открыть'>
              <IconButton onClick={this.selectIt}>
                <ArrowForward />
              </IconButton>
            </Tooltip>
          </div>
        ) : null}
      </div>
    );
  }

  private async fetchSchema() {
    const { properties, id } = this.props.feature;
    const tableName = this.extractTableName(id);
    const { schemaId } = currentProject.layers.find(layer => layer.tableName === tableName);
    const schema = await schemaService.getById(schemaId);

    if (schema) {
      let title = '';

      const property = schema.properties.find(prop => prop.objectIdentityOnUi);

      if (property) {
        if (property.valueType !== ValueType.CHOICE) {
          title = String(properties[property.name.toLowerCase()]);
        } else if (property.enumerations) {
          // eslint-disable-next-line eqeqeq -- тут так надо
          const valueTitleProjection = property.enumerations.find(item => item.value == properties[property.name]);
          title = valueTitleProjection ? valueTitleProjection.title : '';
        }
      } else {
        title = String(properties.name);
      }

      this.setTitles(title, schema.title);
    }
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
    const string = id.split(WFS_FEATURE_ID_DELIMITER)[0];
    if (!string) {
      throw new Error('Incorrect wfs feature id: ' + id);
    }

    return string;
  }
}
