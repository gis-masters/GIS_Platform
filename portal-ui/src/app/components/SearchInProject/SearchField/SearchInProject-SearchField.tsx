import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ExplorerSearchValue } from '../../Explorer/Explorer.models';
import { SearchField } from '../../SearchField/SearchField';

import '!style-loader!css-loader!sass-loader!./SearchInProject-SearchField.scss';

const cnSearchInProject = cn('SearchInProject');

interface SearchInProjectSearchFieldProps {
  expanded: boolean;
  onSubmit(search: ExplorerSearchValue): void;
}

export const SearchInProjectSearchField: FC<SearchInProjectSearchFieldProps> = ({ expanded, onSubmit }) => (
  <SearchField className={cnSearchInProject('SearchField', { expanded })} whiteStyle onSubmit={onSubmit} />
);
