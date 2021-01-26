import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { schemaService } from '../../services/crg/schema.service';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { WFS_FEATURE_ID_DELIMITER } from '../../services/geoserver/wfs.models';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');

interface FeaturesListItemProps {
  feature: WfsFeature;
  onSelect: (item: WfsFeature) => void;
  onHighlight: (item: WfsFeature) => void;
  highlighted: boolean;
}

@observer
export class FeaturesListItem extends Component<FeaturesListItemProps> {
  @observable private title = '';
  @observable private layerTitle = '';

  constructor(props: FeaturesListItemProps) {
    super(props);

    this.fetchSchema();
  }

  render() {
    const { feature, highlighted } = this.props;

    return (
      <div className={cnFeaturesListItem({ highlighted })}>
        <div className={cnFeaturesListItem('Id')} onDoubleClick={this.selectIt} onClick={this.highlightIt}>
          {feature.id.split('.')[1]}
        </div>
        <div className={cnFeaturesListItem('Title')}>{this.title}</div>
        <div className={cnFeaturesListItem('Layer')}>{this.layerTitle}</div>
        <div className={cnFeaturesListItem('Buttons')}>
          <ZoomToFeature feature={feature} onClick={this.zoomHandler} />
          <Tooltip title='Открыть'>
            <IconButton onClick={this.selectIt}>
              <ArrowForward />
            </IconButton>
          </Tooltip>
        </div>
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
        const { name, enumerations, valueType } = property;
        if (valueType !== 'CHOICE') {
          title = properties[name.toLowerCase()];
        } else if (enumerations) {
          const valueTitleProjection = enumerations.find(item => item.value == properties[name]);
          title = valueTitleProjection ? valueTitleProjection.title : '';
        }
      } else {
        title = properties.name;
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
    const { onSelect, feature } = this.props;
    onSelect(feature);
  }

  @boundMethod
  private highlightIt() {
    const { feature, highlighted, onHighlight } = this.props;
    onHighlight(highlighted ? null : feature);
  }

  @boundMethod
  private zoomHandler() {
    this.props.onHighlight(this.props.feature);
  }

  private extractTableName(id: string) {
    const string = id.split(WFS_FEATURE_ID_DELIMITER)[0];
    if (!string) {
      throw Error('Incorrect wfs feature id: ' + id);
    }

    return string;
  }
}
