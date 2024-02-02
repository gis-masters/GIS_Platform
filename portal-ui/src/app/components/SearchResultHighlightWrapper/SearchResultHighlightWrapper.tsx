import React, { FC } from 'react';

import { SearchResultHighlight } from '../SearchResultHighlight/SearchResultHighlight';
import { SearchItemData } from '../../services/data/search/search.model';

interface SearchResultHighlightWrapperProps {
  item: SearchItemData;
}

export const SearchResultHighlightWrapper: FC<SearchResultHighlightWrapperProps> = ({ item }) => (
  <SearchResultHighlight item={item} />
);
