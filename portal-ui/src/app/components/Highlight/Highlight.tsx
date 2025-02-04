import React, { FC, memo, useMemo } from 'react';
import { cn } from '@bem-react/classname';
import Highlighter from 'react-highlight-words';

import { FilterQuery, FilterQueryValue } from '../../services/util/filters/filters.models';

import '!style-loader!css-loader!sass-loader!./Highlight.scss';

const cnHighlight = cn('Highlight');

interface HighlightProps {
  searchWords?: string[];
  word?: FilterQueryValue | FilterQuery[] | FilterQuery;
  children: string | number;
  enabled?: boolean;
}

const HighlightFC: FC<HighlightProps> = ({ enabled, word, searchWords, children }) => {
  const actualWord: string | RegExp = useMemo(() => {
    if (
      word &&
      typeof word === 'object' &&
      !Array.isArray(word) &&
      !(word instanceof RegExp) &&
      typeof word.$ilike === 'string'
    ) {
      return word.$ilike.replaceAll(/^%|%$/g, '');
    }

    return word instanceof RegExp ? word : String(word);
  }, [word]);

  return enabled && (actualWord || searchWords) ? (
    <Highlighter
      className={cnHighlight()}
      highlightClassName={cnHighlight('Mark')}
      searchWords={searchWords || [actualWord]}
      textToHighlight={String(children)}
      autoEscape
    />
  ) : (
    <>{children}</>
  );
};

export const Highlight = memo(HighlightFC);
