import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LookupName } from '../../Lookup/Name/Lookup-Name';
import { PseudoLink } from '../../PseudoLink/PseudoLink';
import { TextOverflow } from '../../TextOverflow/TextOverflow';
import { DocumentInfo } from '../Documents';
import { DocumentsNameInner } from '../NameInner/Documents-NameInner';

import '!style-loader!css-loader!sass-loader!./Documents-Name.scss';

const cnDocuments = cn('Documents');

interface DocumentsNameProps {
  item: DocumentInfo;
  disabled: boolean;
  numerous: boolean;
  deleted?: boolean;
  onClick(): void;
}

export const DocumentsName: FC<DocumentsNameProps> = observer(({ item, disabled, numerous, deleted, onClick }) => (
  <LookupName numerous={numerous} className={cnDocuments('Name', { status: deleted ? 'deleted' : undefined })}>
    <TextOverflow hideButton>
      <PseudoLink disabled={disabled} onClick={onClick}>
        <DocumentsNameInner deleted={deleted}>{item.title}</DocumentsNameInner>
      </PseudoLink>
    </TextOverflow>
  </LookupName>
));
