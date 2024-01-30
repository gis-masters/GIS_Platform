import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import Highlighter from 'react-highlight-words';

import { FilterQuery, FilterQueryValue } from '../../services/util/filterObjects';

import '!style-loader!css-loader!sass-loader!./Highlight.scss';

const cnHighlight = cn('Highlight');

interface HighlightProps {
  searchWords?: string[];
  word?: FilterQueryValue | FilterQuery[] | FilterQuery;
  children: string | number;
  enabled?: boolean;
}

export const Highlight: FC<HighlightProps> = ({ enabled, word, searchWords, children }) => {
  let actualWord: string | RegExp;

  if (
    word &&
    typeof word === 'object' &&
    !Array.isArray(word) &&
    !(word instanceof RegExp) &&
    typeof word.$ilike === 'string'
  ) {
    actualWord = word.$ilike.replaceAll(/^%|%$/g, '');
  } else {
    actualWord = word instanceof RegExp ? word : String(word);
  }

  return enabled && (actualWord || searchWords) ? (
    <Highlighter
      className={cnHighlight()}
      highlightClassName={cnHighlight('Mark')}
      searchWords={searchWords || [actualWord]}
      textToHighlight={String(children)}
    />
  ) : (
    <>{children}</>
  );
};
