import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { type CrgLayer } from '../../services/gis/layers/layers.models';
import { isNspdLayer, isVectorLayer } from '../../services/gis/layers/layers.typeguards';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { CopyFeaturesButton } from '../CopyFeaturesButton/CopyFeaturesButton';
import { CopyUrlButton } from '../CopyUrlButton/CopyUrlButton';
import { CreateBufferButton } from '../CreateBufferButton/CreateBufferButton';
import { OpenInAnotherProject } from '../OpenInAnotherProject/OpenInAnotherProject';
import { PrintFeature } from '../PrintFeature/PrintFeature';
import { XmlDownload } from '../XmlDownload/XmlDownload';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';

import './EditFeatureActions.scss';

const cnEditFeatureActions = cn('EditFeatureActions');

interface EditFeatureActionsProps {
  feature: WfsFeature;
  layer?: CrgLayer;
}

export const EditFeatureActions = observer(({ feature, layer }: EditFeatureActionsProps) => (
  <div className={cnEditFeatureActions()}>
    {layer && (
      <>
        <CreateBufferButton layer={layer} feature={feature} tooltipTitle='Создать буфер' />
        <CopyFeaturesButton layer={layer} features={[feature]} tooltipTitle='Копировать объект в другой слой' />
      </>
    )}
    {(isVectorLayer(layer) || isNspdLayer(layer)) && <PrintFeature feature={feature} layer={layer} />}
    {organizationSettings.downloadXml && layer && <XmlDownload feature={feature} layer={layer} />}
    {isVectorLayer(layer) && (
      <>
        <OpenInAnotherProject feature={feature} />
        <CopyUrlButton features={[feature]} />
      </>
    )}
    <ZoomToFeature featureId={feature.id} zoomToLastCoordinate />
  </div>
));
