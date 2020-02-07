import React from 'react';
import { cn } from '@bem-react/classname';

import { HelpToc } from '../HelpToc/HelpToc';
import { Button } from '../Button/Button';
import { Toc, TocItem } from '../../stores/Help.store';

import '!style-loader!css-loader!sass-loader!./HelpPopup.scss';

const cnHelpPopup = cn('HelpPopup');

interface HelpPopupProps {
  items: Toc;
  onSelect: (item: TocItem) => void;
  onClose: () => void;
}

export const HelpPopup: React.FC<HelpPopupProps> = ({ items, onSelect, onClose }) => (
  <div className={cnHelpPopup()}>
    <div className={cnHelpPopup('Title')}>
      Справка:
    </div>
    
    <HelpToc items={items} onSelect={onSelect} />

    <div className={cnHelpPopup('Actions')}>
      <Button onClick={onClose} variant='outlined'>
        Закрыть
      </Button>
    </div>
  </div>
);
