import React, { type FC } from 'react';

import { type SearchItemData } from '../../services/data/search/search.model';
import { SearchResultHighlight } from '../SearchResultHighlight/SearchResultHighlight';

interface SearchResultHighlightWrapperProps {
  item: SearchItemData;
}

export const SearchResultHighlightWrapper: FC<SearchResultHighlightWrapperProps> = ({ item }) => (
  <SearchResultHighlight item={item} />
);
