import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AssignmentTurnedInOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type AxiosError } from 'axios';

import { type ServerError } from '../../../services/api/http.service';
import { communicationService } from '../../../services/communication.service';
import { type LibraryRecord } from '../../../services/data/library/library.models';
import { registerDocument } from '../../../services/data/library/library.service';
import { type Schema } from '../../../services/data/schema/schema.models';
import { services } from '../../../services/services';
import { type ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

const cnLibraryDocumentActionsRegister = cn('LibraryDocumentActions', 'Register');

interface LibraryDocumentActionsRegisterProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  schema?: Schema;
}

export const LibraryDocumentActionsRegister: React.FC<LibraryDocumentActionsRegisterProps> = observer(
  ({ document, as, schema }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [busy, setBusy] = useState(false);

    const isRegisterAllowed = () => {
      const { properties = [] } = schema || {};
      const requiredNames = new Set(['regdate', 'regnum', 'fias__oktmo']);
      const existingNames = new Set(properties.map(({ name }) => name));

      for (const requiredName of requiredNames) {
        if (!existingNames.has(requiredName)) {
          return false;
        }
      }

      return true;
    };

    const closeDialog = useCallback(() => {
      setDialogOpen(false);
      setBusy(false);
    }, []);

    const registerDocumentHandler = useCallback(async () => {
      if (!document.fias__oktmo) {
        setErrorMessage(
          'Не удалось зарегистрировать документ по причине. Документ не содержит код ОКТМО, заполните поле "Населенный пункт" или "Адресное описание" в соответствии с ФИАС.'
        );

        return;
      }

      setBusy(true);

      const { libraryTableName, id } = document;
      try {
        await registerDocument(libraryTableName, id);
        communicationService.libraryRecordUpdated.emit({ type: 'update', data: document });
      } catch (error) {
        const err = error as AxiosError<ServerError>;
        const msg = `Не удалось зарегистрировать документ по причине: ${err?.response?.data?.message}`;

        Toast.error(msg);
        services.logger.error(msg, error);
      } finally {
        closeDialog();
      }
    }, [closeDialog, document]);

    const openDialog = useCallback(async () => {
      await registerDocumentHandler();
      setDialogOpen(true);
    }, [registerDocumentHandler]);

    return (
      isRegisterAllowed() && (
        <>
          <ActionsItem
            className={cnLibraryDocumentActionsRegister()}
            title='Зарегистрировать документ'
            icon={<AssignmentTurnedInOutlined />}
            onClick={openDialog}
            as={as}
          />

          <Dialog open={dialogOpen} onClose={closeDialog}>
            <DialogTitle>{errorMessage ? 'Ошибка' : 'Подтверждение регистрации'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {errorMessage ||
                  'Вы действительно хотите зарегистрировать документ? Зарегистрированный документ нельзя изменить.'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {!errorMessage && (
                <Button loading={busy} onClick={registerDocumentHandler} color='primary'>
                  Зарегистрировать
                </Button>
              )}
              <Button disabled={busy} onClick={closeDialog}>
                Отмена
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )
    );
  }
);
