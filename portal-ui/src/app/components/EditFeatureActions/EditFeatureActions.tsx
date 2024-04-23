import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { CopyFeaturesButton } from '../CopyFeaturesButton/CopyFeaturesButton';
import { CopyUrlButton } from '../CopyUrlButton/CopyUrlButton';
import { OpenInAnotherProject } from '../OpenInAnotherProject/OpenInAnotherProject';
import { PrintFeature } from '../PrintFeature/PrintFeature';
import { XmlDownload } from '../XmlDownload/XmlDownload';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';

import '!style-loader!css-loader!sass-loader!./EditFeatureActions.scss';

const cnEditFeatureActions = cn('EditFeatureActions');

interface EditFeatureActionsProps {
  feature: WfsFeature;
  layer?: CrgVectorLayer;
}

@observer
export class EditFeatureActions extends Component<EditFeatureActionsProps> {
  render() {
    const { feature, layer } = this.props;

    return (
      <div className={cnEditFeatureActions()}>
        {layer && (
          <CopyFeaturesButton layer={layer} features={[feature]} tooltipTitle='Копировать объект в другой слой' />
        )}
        <PrintFeature feature={feature} layer={layer} />
        {layer && <XmlDownload feature={feature} layer={layer} />}
        <OpenInAnotherProject feature={feature} />
        <CopyUrlButton features={[feature]} />
        <ZoomToFeature feature={feature} />
      </div>
    );
  }
}
