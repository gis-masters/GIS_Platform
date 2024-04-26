import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';

import { LibraryRecord } from '../../services/data/library/library.models';
import { CommonDiRegistry } from '../../services/di-registry';
import { LibraryDeletedDocumentActions } from '../LibraryDeletedDocumentActions/LibraryDeletedDocumentActions';
import { TextBadge } from '../TextBadge/TextBadge';

import '!style-loader!css-loader!sass-loader!./LibraryDocumentDialog.scss';

const cnLibraryDocumentDialog = cn('LibraryDocumentDialog');

interface LibraryDocumentDialogProps {
  document: LibraryRecord;
  open: boolean;
  onClose(): void;
}

export const LibraryDocumentDialog: FC<LibraryDocumentDialogProps> = ({ document, open, onClose }) => {
  const { is_deleted: isDeleted } = document;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' PaperProps={{ className: cnLibraryDocumentDialog() }}>
      <DialogTitle>
        <div className={cnLibraryDocumentDialog('TypeIcon')}>
          {document.is_folder ? <FolderOutlined color='primary' /> : <InsertDriveFileOutlined color='primary' />}
        </div>
        {isDeleted ? (
          <span className={cnLibraryDocumentDialog('TitleDeleted')}>Документ удален</span>
        ) : (
          `Просмотр ${document.is_folder ? 'папки' : 'документа'}`
        )}
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
        {isDeleted && (
          <LibraryDeletedDocumentActions forDialog onDialogClose={onClose} hideOpen document={document} as='button' />
        )}
        {!isDeleted && (
          <RegistryConsumer id='common'>
            {({ LibraryDocumentActions }: CommonDiRegistry) => (
              <LibraryDocumentActions document={document} as='iconButton' forDialog onDialogClose={onClose} />
            )}
          </RegistryConsumer>
        )}
      </DialogActions>
    </Dialog>
  );
};
