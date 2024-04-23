import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LookupName } from '../../Lookup/Name/Lookup-Name';
import { PseudoLink } from '../../PseudoLink/PseudoLink';
import { TextOverflow } from '../../TextOverflow/TextOverflow';
import { DocumentInfo } from '../Documents';

import '!style-loader!css-loader!sass-loader!./Documents-Name.scss';

const cnDocumentsName = cn('Documents', 'Name');

interface DocumentsNameProps {
  item: DocumentInfo;
  disabled: boolean;
  numerous: boolean;
  onClick(): void;
}

export const DocumentsName: FC<DocumentsNameProps> = observer(({ item, disabled, numerous, onClick }) => (
  <LookupName numerous={numerous} className={cnDocumentsName()}>
    <TextOverflow hideButton>
      <PseudoLink disabled={disabled} onClick={onClick}>
        {item.title}
      </PseudoLink>
    </TextOverflow>
  </LookupName>
));
