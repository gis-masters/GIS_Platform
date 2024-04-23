import React, { ChangeEvent, FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Input } from '@mui/material';
import { Search } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { photoUploaderStore } from '../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpSearch.scss';
import '!style-loader!css-loader!sass-loader!./InputWrap/UpSearch-InputWrap.scss';
import '!style-loader!css-loader!sass-loader!./Input/UpSearch-Input.scss';

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
