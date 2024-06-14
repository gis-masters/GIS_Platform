import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentImport } from '../../../stores/CurrentImport.store';
import { Button } from '../../Button/Button';

const cnDataImport = cn('DataImport');

import '!style-loader!css-loader!sass-loader!./DataImport-NavButtons.scss';

interface DataImportNavButtonsProps {
  nextUrl: string;
  onNext(e: React.MouseEvent<HTMLButtonElement>): void;
  onCancel(): void;
}

export const DataImportNavButtons: FC<DataImportNavButtonsProps> = observer(({ onNext, onCancel, nextUrl }) => {
  const { on, isSuccess } = currentImport;

  return (
    <div className={cnDataImport('NavButtons')}>
      {on ? (
        <Button onClick={onCancel}>Отменить импорт</Button>
      ) : (
        <Button routerLink='/projects'>Вернуться к выбору проекта</Button>
      )}
      <Button disabled={!isSuccess} routerLink={nextUrl} color='primary' onClick={onNext}>
        Далее
      </Button>
    </div>
  );
});
