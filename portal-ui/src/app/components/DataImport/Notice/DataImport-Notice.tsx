import React from 'react';
import { cn } from '@bem-react/classname';

const cnDataImport = cn('DataImport');

import '!style-loader!css-loader!sass-loader!./DataImport-Notice.scss';

export const DataImportNotice = () => (
  <div className={cnDataImport('Notice')}>
    Допустимы данные в системах координат:
    <ul className={cnDataImport('NoticeList')}>
      <li className={cnDataImport('NoticeListItem')}>
        СК-42 в проекции Гаусса-Крюгера;
      </li>
      <li className={cnDataImport('NoticeListItem')}>
        WGS84 -геодезическая система координат на эллипсоиде WGS843;
      </li>
      <li className={cnDataImport('NoticeListItem')}>
        WGS84 Web Mercator.
      </li>
    </ul>
    Имена файлов в архиве не должны содержать кириллические символы.
  </div>
);
