import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentImport } from '../../../stores/CurrentImport.store';

const cnDataImport = cn('DataImport');

import '!style-loader!css-loader!sass-loader!./DataImport-Notifications.scss';

export const DataImportNotifications: FC = observer(() => {
  const { isWrongExt, isError, isSuccess, hasErrorTasks } = currentImport;

  return (
    <div className={cnDataImport('Notifications')}>
      {isWrongExt ? <div className={cnDataImport('Notification', { type: 'error' })}>Неверный формат файла</div> : null}

      {isError && !isWrongExt ? (
        <div className={cnDataImport('Notification', { type: 'error' })}>
          Не удается загрузить архив, проверьте вложенные файлы.
        </div>
      ) : null}

      {isSuccess && !hasErrorTasks ? (
        <div className={cnDataImport('Notification', { type: 'success' })}>
          Файл успешно загружен. Нажмите "Далее" для продолжения.
        </div>
      ) : null}
      {isSuccess && hasErrorTasks ? (
        <div className={cnDataImport('Notification', { type: 'error' })}>
          Файл успешно загружен. Некоторые слои загружены с ошибками, они будут удалены перед продолжением.
          <br />
          Нажмите "Далее" для продолжения.
        </div>
      ) : null}
    </div>
  );
});
