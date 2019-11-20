import * as React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';

import { currentImport } from '../../../stores/CurrentImport.store';

const cnDataImport = cn('DataImport');

import '!style-loader!css-loader!sass-loader!./DataImport-NavButtons.scss';

interface DataImportNavButtonsProps {
  onNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  nextUrl: string;
}

export const DataImportNavButtons: React.FC<DataImportNavButtonsProps> = observer(({ onNext, onCancel, nextUrl }) => {
  const { on, isSuccess } = currentImport;

  return (
    <div className={cnDataImport('NavButtons')}>
      {on ? (
          <Button onClick={onCancel} variant='outlined'>
            Отменить импорт
          </Button>
        ) : (
          <Button routerLink='/projects' variant='outlined'>
            Вернуться к выбору проекта
          </Button>
        )}
      <Button disabled={!isSuccess}
              routerLink={nextUrl}
              variant='outlined'
              color='primary'
              onClick={onNext}>
        Далее
      </Button>
    </div>
  );
});
