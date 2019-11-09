import * as React from 'react';
import { cn } from '@bem-react/classname';

const cnDataImport = cn('DataImport');

import '!style-loader!css-loader!sass-loader!./DataImport-Notifications.scss';

interface DataImportNotificationsProps {
  isWrongExt: boolean;
  isImportFailed: boolean;
  isSuccess: boolean;
}

export const DataImportNotifications: React.FC<DataImportNotificationsProps> =
    ({ isWrongExt, isImportFailed, isSuccess }) => (
  <div className={cnDataImport('Notifications')}>
    {isWrongExt ? (
        <div className={cnDataImport('Notification', {type: 'error'})}>
          Неверный формат файла
        </div>
      ) : null}

    {isImportFailed && !isWrongExt ? (
        <div className={cnDataImport('Notification', {type: 'error'})}>
          Не удается загрузить архив, проверьте вложенные файлы.
        </div>
      ) : null}

    {isSuccess ? (
        <div className={cnDataImport('Notification', {type: 'success'})}>
          Файл успешно загружен. Нажмите "Далее" для продолжения.
        </div>
      ) : null}
  </div>
);
