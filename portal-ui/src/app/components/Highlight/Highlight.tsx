import React, { type FC, memo, useMemo } from 'react';
import { cn } from '@bem-react/classname';
import Highlighter from 'react-highlight-words';

import { type FilterQuery, type FilterQueryValue } from '../../services/util/filters/filters.models';
import { isArray } from '../../services/util/typeGuards/isArray';

import './Highlight.scss';

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
      !isArray(word) &&
      !(word instanceof RegExp) &&
      typeof word.$ilike === 'string'
    ) {
      return word.$ilike.replaceAll(/^%|%$/g, '');
    }

    if (word instanceof RegExp) {
      return word;
    }
    if (typeof word === 'string') {
      return word;
    }
    if (typeof word === 'number' || typeof word === 'boolean') {
      return String(word);
    }

    return '';
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
