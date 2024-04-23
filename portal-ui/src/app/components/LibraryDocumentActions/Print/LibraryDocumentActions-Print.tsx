import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { Schema } from '../../../services/data/schema/schema.models';
import { documentPrintTemplates } from '../../../services/print/print.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { PrintAction } from '../../PrintAction/PrintAction';

const cnLibraryDocumentActionsPrint = cn('LibraryDocumentActions', 'Print');

interface LibraryDocumentActionsPrintProps {
  document: LibraryRecord;
  schema?: Schema;
  as: ActionsItemVariant;
}

export const LibraryDocumentActionsPrint: FC<LibraryDocumentActionsPrintProps> = observer(
  ({ as, document, schema }) => {
    const names = schema?.printTemplates || [];
    const templates = documentPrintTemplates.filter(({ name }) => names.includes(name));

    return (
      <PrintAction<LibraryRecord>
        className={cnLibraryDocumentActionsPrint()}
        as={as}
        entity={document}
        templates={templates}
      />
    );
  }
);
