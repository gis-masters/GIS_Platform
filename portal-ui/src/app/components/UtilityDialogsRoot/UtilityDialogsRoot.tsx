import React, { FC } from 'react';
import { observer } from 'mobx-react';

import { utilityDialogsStore } from '../../stores/UtilityDialogs.store';
import { UtilityDialog } from '../UtilityDialog/UtilityDialog';

export const UtilityDialogsRoot: FC = observer(() => (
  <>
    {utilityDialogsStore.dialogs.map(dialog => (
      <UtilityDialog info={dialog} key={dialog.id} />
    ))}
  </>
));
