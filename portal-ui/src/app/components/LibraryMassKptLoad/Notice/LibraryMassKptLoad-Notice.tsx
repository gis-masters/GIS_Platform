import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Notice } from '../../Notice/Notice';

import '!style-loader!css-loader!sass-loader!./LibraryMassKptLoad-Notice.scss';

const cnLibraryMassKptLoad = cn('LibraryMassKptLoad');

export const LibraryMassKptLoadNotice: FC = () => (
  <Notice className={cnLibraryMassKptLoad('Notice')}>
    <p>
      Допустимые к загрузке файлы: только архивы с расширением zip, размер каждого файла не должен превышать 50 Мб,
      внутри каждого архива должен находится XML файл.
    </p>
    <p>Имена файлов в архиве не должны содержать кириллические символы.</p>
  </Notice>
);
