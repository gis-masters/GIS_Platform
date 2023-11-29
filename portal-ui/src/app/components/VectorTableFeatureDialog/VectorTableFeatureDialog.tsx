import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';

import { SearchSourceForFeature } from '../../services/data/search/search.model';
import { VectorTableFeature } from '../VectorTableFeature/VectorTableFeature';
import { extractFeatureId } from '../../services/geoserver/feature.util';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { TextBadge } from '../TextBadge/TextBadge';
import { Button } from '../Button/Button';

import { FeatureIcon } from '../FeatureIcon/FeatureIcon';

import '!style-loader!css-loader!sass-loader!./VectorTableFeatureDialog.scss';

const cnVectorTableFeatureDialog = cn('VectorTableFeatureDialog');

interface VectorTableFeatureProps {
  feature: WfsFeature;
  open: boolean;
  onClose(): void;
  source?: SearchSourceForFeature;
}

export const VectorTableFeatureDialog: FC<VectorTableFeatureProps> = ({ feature, open, source, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth='xl'
    PaperProps={{ className: cnVectorTableFeatureDialog() }}
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
      <Button onClick={onClose}>Закрыть</Button>
    </DialogActions>
  </Dialog>
);
