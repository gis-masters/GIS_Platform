import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { XmlDownload } from '../XmlDownload/XmlDownload';
import { CopyUrlButton } from '../CopyUrlButton/CopyUrlButton';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { OpenInAnotherProject } from '../OpenInAnotherProject/OpenInAnotherProject';
import { FeatureExtract } from '../FeatureExtract/FeatureExtract';
import { CopyFeatureButton } from '../CopyFeatureButton/CopyFeatureButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureActions.scss';

const cnEditFeatureActions = cn('EditFeatureActions');

interface EditFeatureActionsProps {
  feature: WfsFeature;
  layer: CrgVectorLayer;
}

@observer
export class EditFeatureActions extends Component<EditFeatureActionsProps> {
  render() {
    const { feature, layer } = this.props;

    return (
      <div className={cnEditFeatureActions()}>
        {layer && <CopyFeatureButton layer={layer} feature={feature} />}
        {layer && <FeatureExtract feature={feature} layer={layer} />}
        {layer && <XmlDownload feature={feature} layer={layer} />}
        <OpenInAnotherProject feature={feature} />
        <CopyUrlButton features={[feature]} />
        <ZoomToFeature feature={feature} />
      </div>
    );
  }
}
