import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';

import { CommonDiRegistry } from '../../services/di-registry';
import { LibraryRecord } from '../../services/data/docLibrary/docLibrary.models';
import { TextBadge } from '../TextBadge/TextBadge';

import '!style-loader!css-loader!sass-loader!./LibraryDocumentDialog.scss';

const cnLibraryDocumentDialog = cn('LibraryDocumentDialog');

interface LibraryDocumentDialogProps {
  document: LibraryRecord;
  open: boolean;
  onClose(): void;
}

export const LibraryDocumentDialog: FC<LibraryDocumentDialogProps> = ({ document, open, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' PaperProps={{ className: cnLibraryDocumentDialog() }}>
    <DialogTitle>
      <div className={cnLibraryDocumentDialog('TypeIcon')}>
        {document.is_folder ? <FolderOutlined color='primary' /> : <InsertDriveFileOutlined color='primary' />}
      </div>
      Просмотр {document.is_folder ? 'папки' : 'документа'}
      {document.id && <TextBadge id={document.id} />}
    </DialogTitle>

    <DialogContent>
      <RegistryConsumer id='common'>
        {({ LibraryDocument }: CommonDiRegistry) => (
          <LibraryDocument document={document} className={cnLibraryDocumentDialog('Document')} />
        )}
      </RegistryConsumer>
    </DialogContent>

    <DialogActions>
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }: CommonDiRegistry) => (
          <LibraryDocumentActions document={document} as='button' hideOpen forDialog onDialogClose={onClose} />
        )}
      </RegistryConsumer>
    </DialogActions>
  </Dialog>
);
