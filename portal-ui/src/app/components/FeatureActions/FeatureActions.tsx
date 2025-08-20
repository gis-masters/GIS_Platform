import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { VectorTable } from '../../services/data/vectorData/vectorData.models';
import { extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { Actions } from '../Actions/Actions.composed';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { FeatureConnections } from '../FeatureConnections/FeatureConnections';
import { FeatureActionsClose } from './Close/FeatureActions-Close';

export const cnLibraryDocumentVersionsActions = cn('LibraryDocumentVersionsActions');

export interface FeatureActionsProps extends IClassNameProps {
  featureId: string;
  vectorTable: VectorTable;
  onDialogClose(): void;
  as: ActionsItemVariant;
}

@observer
export class FeatureActions extends Component<FeatureActionsProps> {
  render() {
    const { as, vectorTable, featureId, onDialogClose, className } = this.props;

    return (
      <Actions className={cnLibraryDocumentVersionsActions(null, [className])} as={as}>
        <FeatureConnections featureId={String(extractFeatureId(featureId))} vectorTable={vectorTable} as={as} />
        <FeatureActionsClose onClick={onDialogClose} as={as} />
      </Actions>
    );
  }
}
