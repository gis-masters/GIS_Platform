import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { List } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import { SearchResultListItem } from '../ResultListItem/Search-ResultListItem';
import { YaGeoObjectCollection } from '../../../services/yandex-geocode.service';

import '!style-loader!css-loader!sass-loader!./Search-ResultList.scss';
import '!style-loader!css-loader!sass-loader!../Empty/Search-Empty.scss';
import '!style-loader!css-loader!sass-loader!../PrimaryText/Search-PrimaryText.scss';

const cnSearch = cn('Search');

interface SearchResultListProps {
  data?: YaGeoObjectCollection;
  onClick: () => void;
}

export const SearchResultList: FC<SearchResultListProps> = observer(({ data, onClick }) => (
  <div className={cnSearch('ResultList')}>
    {data && data.featureMember.length ?
      <List dense={true}>
        {data.featureMember.map(item => (
          <SearchResultListItem key={item.GeoObject.Point.pos} geoObject={item.GeoObject} onClick={onClick}/>
        ))}
      </List>
      : <div className={cnSearch('Empty')}>Нет результатов</div>}
  </div>
));
