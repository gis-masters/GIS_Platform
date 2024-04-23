import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { List } from '@mui/material';
import { cn } from '@bem-react/classname';

import { KadObject } from '../../../services/kad-search.models';
import { YaGeoObjectCollection } from '../../../services/yandex-geocode.service';
import { SearchResultKadListItem } from '../ResultKadListItem/Search-ResultKadListItem';
import { SearchResultListItem } from '../ResultListItem/Search-ResultListItem';

import '!style-loader!css-loader!sass-loader!./Search-ResultList.scss';
import '!style-loader!css-loader!sass-loader!../Empty/Search-Empty.scss';
import '!style-loader!css-loader!sass-loader!../PrimaryText/Search-PrimaryText.scss';

const cnSearch = cn('Search');

interface SearchResultListProps {
  addressData?: YaGeoObjectCollection;
  kadAreasData?: KadObject[];
  kadOksData?: KadObject[];
}

export const SearchResultList: FC<SearchResultListProps> = observer(({ addressData, kadAreasData, kadOksData }) => (
  <div className={cnSearch('ResultList')}>
    {(addressData && addressData.featureMember.length) || kadAreasData.length || kadOksData.length ? (
      <List dense>
        {kadAreasData.length ? (
          <>
            <div className={cnSearch('ListTitle')}>Участки:</div>
            {kadAreasData.map(item => (
              <SearchResultKadListItem key={item.value} kadObject={item} />
            ))}
          </>
        ) : null}
        {kadOksData.length ? (
          <>
            <div className={cnSearch('ListTitle')}>ОКС:</div>
            {kadOksData.map(item => (
              <SearchResultKadListItem key={item.value} kadObject={item} />
            ))}
          </>
        ) : null}
        {addressData &&
          addressData.featureMember &&
          addressData.featureMember.map(item => (
            <SearchResultListItem key={item.GeoObject.Point.pos} geoObject={item.GeoObject} />
          ))}
      </List>
    ) : (
      <div className={cnSearch('Empty')}>Нет результатов</div>
    )}
  </div>
));
