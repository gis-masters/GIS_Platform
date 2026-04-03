import React, { type FC } from 'react';
import { ButtonBase, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { PrintMapImageControlImage } from '../Image/PrintMapImageControl-Image';
import { PrintMapImageControlLoading } from '../Loading/PrintMapImageControl-Loading';
import { PrintMapImageControlOverlay } from '../Overlay/PrintMapImageControl-Overlay';

import './PrintMapImageControl-Preview.scss';

const cnPrintMapImageControlPreview = cn('PrintMapImageControl', 'Preview');

export interface PrintMapImageControlPreviewProps {
  imageSrc: string;
  editLabel: string;
  disabled: boolean;
  mapLoading: boolean;
  onOpenPrintDialog(): void | Promise<void>;
}

export const PrintMapImageControlPreview: FC<PrintMapImageControlPreviewProps> = ({
  imageSrc,
  editLabel,
  disabled,
  mapLoading,
  onOpenPrintDialog
}) => (
  <Tooltip title={editLabel}>
    <span>
      <ButtonBase
        type='button'
        className={cnPrintMapImageControlPreview()}
        onClick={onOpenPrintDialog}
        disabled={disabled}
        focusRipple
        aria-label={editLabel}
      >
        <PrintMapImageControlImage src={imageSrc} />
        <PrintMapImageControlOverlay />
        {mapLoading ? <PrintMapImageControlLoading /> : null}
      </ButtonBase>
    </span>
  </Tooltip>
);
