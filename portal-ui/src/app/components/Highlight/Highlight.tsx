import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import Highlighter from 'react-highlight-words';

import '!style-loader!css-loader!sass-loader!./Highlight.scss';

const cnHighlight = cn('Highlight');

interface HighlightProps {
  word?: string;
  children: string | number;
  enabled?: boolean;
}

export const Highlight: FC<HighlightProps> = ({ enabled, word, children }) =>
  enabled && word ? (
    <Highlighter
      className={cnHighlight()}
      highlightClassName={cnHighlight('Mark')}
      searchWords={[word]}
      autoEscape
      textToHighlight={String(children)}
    />
  ) : (
    <>{children}</>
  );
