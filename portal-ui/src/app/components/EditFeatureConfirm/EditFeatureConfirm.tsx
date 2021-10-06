import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { cn } from '@bem-react/classname';

import { sidebars } from '../../stores/Sidebars.store';
import { Button } from '../Button/Button';

const cnEditFeatureConfirm = cn('EditFeatureConfirm');

export const EditFeatureConfirm: FC = observer(() => (
  <Dialog
    className={cnEditFeatureConfirm()}
    open={sidebars.featuresClosingConfirmationOpen}
    onClose={sidebars.closeEditFeatureConfirmation}
  >
    <DialogContent>
      <DialogContentText>Есть несохранённые изменения. Они будут потеряны при закрытии.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={sidebars.featuresClosingConfirmationCallback} color='primary'>
        Всё равно закрыть
      </Button>
      <Button onClick={sidebars.closeEditFeatureConfirmation}>Не закрывать</Button>
    </DialogActions>
  </Dialog>
));
