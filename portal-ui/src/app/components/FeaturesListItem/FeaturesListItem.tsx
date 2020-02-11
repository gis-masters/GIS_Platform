import React from 'react';
import { cn } from '@bem-react/classname';

import { WfsFeature } from '../../services/geoserver/wfs-models';
import { dataSchemaService } from '../../services/crg/data-schema.service';
import { services } from '../../services/services';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');

interface FeaturesListItemProps {
  feature: WfsFeature;
  onSelect: (item: WfsFeature) => void;
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

    this.highlightIt = this.highlightIt.bind(this);
    this.selectIt = this.selectIt.bind(this);
  }

  render () {
    return (
      <div className={cnFeaturesListItem()} onClick={this.highlightIt} onDoubleClick={this.selectIt}>
        <div className={cnFeaturesListItem('Id')}>
          {this.props.feature.id.split('.')[1]}
        </div>
        <div className={cnFeaturesListItem('Title')}>
          {this.title}
        </div>
        <div className={cnFeaturesListItem('Layer')}>
          {this.layerTitle}
        </div>
        <Button
            className={cnFeaturesListItem('Button')}
            color={'primary'}
            variant={'outlined'}
            onClick={this.selectIt}>
          Открыть
        </Button>
      </div>
    );
  }

  private highlightIt () {
    const { openLayersService } = services;
    openLayersService.clearDraft();
    openLayersService.paintFeature(this.props.feature);
  }

  private selectIt () {
    this.props.onSelect(this.props.feature);
  }
}
