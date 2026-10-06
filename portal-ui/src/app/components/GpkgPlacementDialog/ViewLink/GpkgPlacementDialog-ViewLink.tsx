import React, { type FC, type ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { PseudoLink } from '../../PseudoLink/PseudoLink';

import './GpkgPlacementDialog-ViewLink.scss';

const cnGpkgPlacementDialogViewLink = cn('GpkgPlacementDialog', 'ViewLink');

interface GpkgPlacementDialogViewLinkProps {
  children: ReactNode;
  onClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

export const GpkgPlacementDialogViewLink: FC<GpkgPlacementDialogViewLinkProps> = ({ children, onClick }) => (
  <PseudoLink className={cnGpkgPlacementDialogViewLink()} onClick={onClick}>
    {children}
  </PseudoLink>
);
