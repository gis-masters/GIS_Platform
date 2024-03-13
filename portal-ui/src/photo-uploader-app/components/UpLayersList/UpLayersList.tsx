import React, { FC, useEffect } from 'react';
import { cn } from '@bem-react/classname';
import { List } from '@mui/material';
import { observer, useLocalObservable } from 'mobx-react';

import { getVectorTablesInAllDatasets } from '../../../app/services/data/vectorData/vectorData.service';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpLayersListItem, UpLayersListItemData } from './Item/UpLayersList-Item';
import { UpError } from '../UpError/UpError';
import { UpSearch } from '../UpSearch/UpSearch';

import '!style-loader!css-loader!sass-loader!./UpLayersList.scss';

interface UpLayersListStore {
  dataList: UpLayersListItemData[];
  setDataList(dataList: UpLayersListItemData[]): void;
}

const cnUpLayersList = cn('UpLayersList');

const photoLayerTitle = 'photo_uploader';

export const UpLayersList: FC = observer(() => {
  const store = useLocalObservable(
    (): UpLayersListStore => ({
      dataList: [],
      setDataList(this: UpLayersListStore, dataList: UpLayersListItemData[]): void {
        this.dataList = dataList;
      }
    })
  );

  const { dataList, setDataList } = store;

  const layers =
    photoUploaderStore.searchValue !== '' && !!dataList.length
      ? dataList.filter(item =>
          item.data.title.toLocaleLowerCase().includes(photoUploaderStore.searchValue.toLocaleLowerCase())
        )
      : dataList;

  useEffect(() => {
    void (async () => {
      photoUploaderStore.setBusy(true);
      try {
        const pageOptions = { page: 0, pageSize: 20, filter: { title: photoLayerTitle } };
        const response = await getVectorTablesInAllDatasets(pageOptions);
        if (!response) {
          photoUploaderStore.addError('Загрузка фотографий недоступна');
          photoUploaderStore.closeLayersList();
        }

        const data = response[0].map(item => ({ data: item }));

        setDataList(data);
      } catch {
        photoUploaderStore.addError('Загрузка фотографий недоступна');
        photoUploaderStore.closeLayersList();
      }
      photoUploaderStore.setBusy(false);
    })();
  }, [setDataList]);

  return (
    <>
      <UpSearch />
      <List className={cnUpLayersList()}>
        {!!dataList.length && layers.map((item, idx) => <UpLayersListItem type='button' {...item} key={idx} />)}
      </List>
      {photoUploaderStore.searchValue !== '' && !layers.length && <UpError message='... ничего не найдено' />}
    </>
  );
});
