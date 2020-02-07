import React from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PseudoLink.scss';

const cnPseudoLink = cn('PseudoLink');

interface PseudoLinkProps {
  onClick: () => void;
  className?: string;
}

export const PseudoLink: React.FC<PseudoLinkProps> = ({ className, onClick, children }) => (
  <span className={cnPseudoLink(null, [className])} onClick={onClick}>
    <span className={cnPseudoLink('Inner')}>
      {children}
    </span>
  </span>
);
