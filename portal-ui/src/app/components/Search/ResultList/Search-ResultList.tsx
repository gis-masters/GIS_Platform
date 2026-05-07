import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { List } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { type YaGeoObjectCollection } from '../../../services/yandex-geocode.service';
import { SearchResultKadListItem } from '../ResultKadListItem/Search-ResultKadListItem';
import { SearchResultListItem } from '../ResultListItem/Search-ResultListItem';

import './Search-ResultList.scss';
import '../Empty/Search-Empty.scss';
import '../ListTitle/Search-ListTitle.scss';
import '../PrimaryText/Search-PrimaryText.scss';
import '../ResultListWarning/Search-ResultListWarning.scss';

const cnSearch = cn('Search');
const defaultNspdFeatureCategoryName = 'Объекты НСПД';

interface SearchResultListProps {
  value: string;
  addressData?: YaGeoObjectCollection;
  features: WfsFeature[];
  nspdFeaturesTotalCount?: number;
}

interface NspdFeatureGroup {
  categoryName: string;
  items: WfsFeature[];
}

function getNspdFeatureGroups(features: WfsFeature[]): NspdFeatureGroup[] {
  const groups = new Map<string, WfsFeature[]>();

  for (const feature of features) {
    const categoryName = getNspdFeatureCategoryName(feature);
    const group = groups.get(categoryName) || [];

    groups.set(categoryName, [...group, feature]);
  }

  return Array.from(groups, ([categoryName, items]) => ({ categoryName, items }));
}

function getNspdFeatureCategoryName(feature: WfsFeature): string {
  const categoryName = feature.properties.categoryName;

  if (typeof categoryName === 'string' && categoryName) {
    return categoryName;
  }

  return defaultNspdFeatureCategoryName;
}

function isNspdResultLimited(features: WfsFeature[], totalCount?: number): totalCount is number {
  return totalCount !== undefined && totalCount > features.length;
}

export const SearchResultList: FC<SearchResultListProps> = observer(
  ({ addressData, features, nspdFeaturesTotalCount }) => (
    <div className={cnSearch('ResultList')}>
      {(addressData && addressData.featureMember.length) || features?.length ? (
        <>
          {isNspdResultLimited(features, nspdFeaturesTotalCount) && (
            <div className={cnSearch('ResultListWarning')}>
              Показано {features.length} из {nspdFeaturesTotalCount} объектов. Уточните параметры поиска.
            </div>
          )}
          <List dense>
            {Boolean(features.length) &&
              getNspdFeatureGroups(features).map(({ categoryName, items }) => (
                <React.Fragment key={categoryName}>
                  <div className={cnSearch('ListTitle')}>{categoryName}:</div>
                  {items.map((item, i) => (
                    <SearchResultKadListItem key={`${item.id}_${i}`} feature={item} />
                  ))}
                </React.Fragment>
              ))}
            {addressData &&
              addressData.featureMember &&
              addressData.featureMember.map(item => (
                <SearchResultListItem key={item.GeoObject.Point.pos} geoObject={item.GeoObject} />
              ))}
          </List>
        </>
      ) : (
        <div className={cnSearch('Empty')}>Нет результатов</div>
      )}
    </div>
  )
);
