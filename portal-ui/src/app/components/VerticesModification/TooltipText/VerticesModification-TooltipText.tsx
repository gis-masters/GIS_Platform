import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

const cnVerticesModificationTooltipText = cn('VerticesModification', 'TooltipText');

export const VerticesModificationTooltipText: FC = () => (
  <div className={cnVerticesModificationTooltipText()}>
    <p>Режим изменения вершин</p>
    <p>Щелчок левой кнопки мыши для выбора объекта</p>
    <p>Двойной щелчок левой кнопки мыши для удаления вершин</p>
    <p>Shift + щелчок — добавляет объекты</p>
  </div>
);
