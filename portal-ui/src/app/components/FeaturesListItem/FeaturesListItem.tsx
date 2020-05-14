import React from 'react';
import { cn } from '@bem-react/classname';

import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { WfsFeature } from '../../services/geoserver/wfs-models';
import { dataSchemaService } from '../../services/crg/data-schema.service';
import { IconButton, Tooltip } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');

interface FeaturesListItemProps {
  feature: WfsFeature;
  onSelect: (item: WfsFeature) => void;
  onHighlight: (item: WfsFeature) => void;
  highlighted: boolean;
}

export class FeaturesListItem extends React.Component<FeaturesListItemProps> {
  private title = '';
  private layerTitle = '';

  constructor (props: FeaturesListItemProps) {
    super(props);

    const { id, properties } = this.props.feature;
    const featureName = id.split('.')[0];
    const schema = dataSchemaService.getFeatureSchemaByName(featureName);

    if (schema) {
      this.layerTitle = schema.title;

      const property = schema.properties.find(property => property.objectIdentityOnUi);

      if (property) {
        const { name, enumerations, valueType } = property;
        if (valueType !== 'CHOICE') {
          this.title = properties[name.toLowerCase()];
        } else if (enumerations) {
          const valueTitleProjection = enumerations.find(item => item.value == properties[name]);
          this.title = valueTitleProjection ? valueTitleProjection.title : '';
        }
      } else {
        this.title = properties.name;
      }
    }

    this.selectIt = this.selectIt.bind(this);
    this.highlightIt = this.highlightIt.bind(this);
    this.zoomHandler = this.zoomHandler.bind(this);
  }

  render () {
    const { feature, highlighted } = this.props;

    return (
      <div className={cnFeaturesListItem({ highlighted })}>
        <div className={cnFeaturesListItem('Id')} onDoubleClick={this.selectIt} onClick={this.highlightIt}>
          {feature.id.split('.')[1]}
        </div>
        <div className={cnFeaturesListItem('Title')}>
          {this.title}
        </div>
        <div className={cnFeaturesListItem('Layer')}>
          {this.layerTitle}
        </div>
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

  private selectIt () {
    const { onSelect, feature, onHighlight } = this.props;
    onSelect(feature);
    onHighlight(feature);
  }

  private highlightIt () {
    const { feature, highlighted, onHighlight } = this.props;
    onHighlight(highlighted ? null : feature);
  }

  private zoomHandler () {
    this.props.onHighlight(this.props.feature);
  }
}
