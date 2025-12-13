import React, { type FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type SearchSourceForFeature } from '../../services/data/search/search.model';
import { type VectorTable } from '../../services/data/vectorData/vectorData.models';
import { extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { FeatureActions } from '../FeatureActions/FeatureActions';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { TextBadge } from '../TextBadge/TextBadge';
import { VectorTableFeature } from '../VectorTableFeature/VectorTableFeature';

import './VectorTableFeatureDialog.scss';

const cnVectorTableFeatureDialog = cn('VectorTableFeatureDialog');

interface VectorTableFeatureProps {
  feature: WfsFeature;
  vectorTable: VectorTable;
  open: boolean;
  onClose(): void;
  source?: SearchSourceForFeature;
}

export const VectorTableFeatureDialog: FC<VectorTableFeatureProps> = ({
  feature,
  open,
  vectorTable,
  source,
  onClose
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth='xl'
    slotProps={{ paper: { className: cnVectorTableFeatureDialog() } }}
  >
    <DialogTitle>
      <>
        <div className={cnVectorTableFeatureDialog('TypeIcon')}>
          {source?.geometryType && <FeatureIcon geometryType={source?.geometryType} />}
        </div>
        Просмотр объекта
        {feature.id && source && <TextBadge id={extractFeatureId(feature.id)} />}
      </>
    </DialogTitle>

    <DialogContent>
      <VectorTableFeature feature={feature} source={source} />
    </DialogContent>

    <DialogActions>
      <FeatureActions vectorTable={vectorTable} featureId={feature.id} onDialogClose={onClose} as='iconButton' />
    </DialogActions>
  </Dialog>
);
