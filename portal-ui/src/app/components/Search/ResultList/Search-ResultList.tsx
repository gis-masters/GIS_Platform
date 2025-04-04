import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { List } from '@mui/material';
import { cn } from '@bem-react/classname';

import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { YaGeoObjectCollection } from '../../../services/yandex-geocode.service';
import { SearchResultKadListItem } from '../ResultKadListItem/Search-ResultKadListItem';
import { SearchResultListItem } from '../ResultListItem/Search-ResultListItem';

import '!style-loader!css-loader!sass-loader!./Search-ResultList.scss';
import '!style-loader!css-loader!sass-loader!../Empty/Search-Empty.scss';
import '!style-loader!css-loader!sass-loader!../PrimaryText/Search-PrimaryText.scss';

const cnSearch = cn('Search');

interface SearchResultListProps {
  value: string;
  addressData?: YaGeoObjectCollection;
  features: WfsFeature[];
}

export const SearchResultList: FC<SearchResultListProps> = observer(({ addressData, features }) => (
  <div className={cnSearch('ResultList')}>
    {(addressData && addressData.featureMember.length) || features?.length ? (
      <List dense>
        {features.length ? (
          <>
            <div className={cnSearch('ListTitle')}>Участки:</div>
            {features.map((item, i) => (
              <SearchResultKadListItem key={`${item.id}_${i}`} feature={item} />
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
