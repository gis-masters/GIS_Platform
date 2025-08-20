import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema/schema.models';
import { VectorTable } from '../../services/data/vectorData/vectorData.models';
import { extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { FeatureActions } from '../FeatureActions/FeatureActions';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { FeatureView } from '../FeatureView/FeatureView';
import { TextBadge } from '../TextBadge/TextBadge';

import '!style-loader!css-loader!sass-loader!./FeatureDialog.scss';

const cnFeatureDialog = cn('FeatureDialog');

interface FeatureDialogProps {
  feature: WfsFeature;
  schema: Schema;
  vectorTable: VectorTable;
  open: boolean;
  onClose(): void;
}

export const FeatureDialog: FC<FeatureDialogProps> = ({ feature, schema, vectorTable, open, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' PaperProps={{ className: cnFeatureDialog() }}>
    <DialogTitle>
      <div className={cnFeatureDialog('TypeIcon')}>
        {feature.geometry?.type && <FeatureIcon geometryType={feature.geometry.type} />}
      </div>
      Просмотр объекта
      {feature.id && <TextBadge id={extractFeatureId(feature.id)} />}
    </DialogTitle>

    <DialogContent>
      <FeatureView schema={schema} feature={feature} vectorTable={vectorTable} className={cnFeatureDialog('Feature')} />
    </DialogContent>

    <DialogActions>
      <FeatureActions vectorTable={vectorTable} featureId={feature.id} onDialogClose={onClose} as='iconButton' />
    </DialogActions>
  </Dialog>
);
