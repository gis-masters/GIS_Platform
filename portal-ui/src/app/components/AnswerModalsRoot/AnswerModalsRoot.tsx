import React, { type FC } from 'react';
import { observer } from 'mobx-react';

import { answerModalsStore } from '../../stores/AnswerModals.store';
import { AnswerModal } from '../AnswerModal/AnswerModal';

export const AnswerModalsRoot: FC = observer(() => (
  <>
    {answerModalsStore.dialogs.map(dialog => (
      <AnswerModal info={dialog} key={dialog.id} />
    ))}
  </>
));
