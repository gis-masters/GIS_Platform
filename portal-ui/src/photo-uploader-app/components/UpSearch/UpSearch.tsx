import React, { type ChangeEvent, type FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Input } from '@mui/material';
import { Search } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { photoUploaderStore } from '../../stores/PhotoUploader.store';

import './UpSearch.scss';
import './InputWrap/UpSearch-InputWrap.scss';
import './Input/UpSearch-Input.scss';

const cnUpSearch = cn('UpSearch');

export const UpSearch: FC = observer(() => {
  const changeHadler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    photoUploaderStore.setSearchValue(e.target.value);
  }, []);

  return (
    <div className={cnUpSearch()}>
      <Input
        type='search'
        className={cnUpSearch('InputWrap')}
        placeholder='Поиск'
        startAdornment={photoUploaderStore.searchValue === '' ? <Search /> : null}
        onChange={changeHadler}
        value={photoUploaderStore.searchValue}
        disableUnderline
        inputProps={{ className: cnUpSearch('Input') }}
      />
    </div>
  );
});
