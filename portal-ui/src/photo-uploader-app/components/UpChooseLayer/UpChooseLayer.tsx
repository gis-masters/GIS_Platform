import React, { FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';
import { observer, useLocalObservable } from 'mobx-react';

import { Button } from '../../../app/components/Button/Button';
import { UpCheckedLayer } from '../UpCheckedLayer/UpCheckedLayer';

import '!style-loader!css-loader!sass-loader!./UpChooseLayer.scss';

const testLayer = {
  title: 'Слой для тестирования',
  geometryType: 'полигональный',
  dataType: 'Набор данных',
  schemaName: 'admborder_line'
};

interface UpChooseLayerStore {
  clicked: boolean;
  setClicked(zoomed: boolean): void;
}

const cnUpChooseLayer = cn('UpChooseLayer');

export const UpChooseLayer: FC = observer(() => {
  const store = useLocalObservable(
    (): UpChooseLayerStore => ({
      clicked: false,
      setClicked(this: UpChooseLayerStore, clicked: boolean): void {
        this.clicked = clicked;
      }
    })
  );

  const { clicked, setClicked } = store;

  const clickHandler = useCallback(() => {
    setClicked(!clicked);
  }, [clicked, setClicked]);

  return (
    <div className={cnUpChooseLayer()}>
      <span className={cnUpChooseLayer('Annotation')}>{clicked ? 'Выбранный слой:' : 'Слой не выбран'}</span>
      {!clicked && (
        <Button className={cnUpChooseLayer('Button')} onClick={clickHandler}>
          Выбрать слой
        </Button>
      )}
      {clicked && <UpCheckedLayer {...testLayer} />}
    </div>
  );
});
