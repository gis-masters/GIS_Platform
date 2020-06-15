import React, { Component, ChangeEvent } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { Select, MenuItem } from '@material-ui/core';

import { baseMapsStore } from '../../stores/BaseMaps.store';

import '!style-loader!css-loader!sass-loader!./BaseMapsSelect.scss';

const cnBaseMapsSelect = cn('BaseMapsSelect');

@observer
export class BaseMapsSelect extends Component<IClassNameProps> {
  constructor (props: IClassNameProps) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
  }

  render () {
    const { baseMaps, currentBaseMap } = baseMapsStore;
    const value = currentBaseMap ? currentBaseMap.id : '';

    return (
      <Select
          className={cnBaseMapsSelect(null, [this.props.className])}
          variant='outlined'
          value={value}
          onChange={this.changeHandler}
          classes={{ root: cnBaseMapsSelect('SelectRoot') }}
      >
        {baseMaps && baseMaps.map(({ id, thumbnailUrn, title }) => (
          <MenuItem value={id} key={id}>
            <img className={cnBaseMapsSelect('Thumbnail')} src={thumbnailUrn} />
            {title}
          </MenuItem>
        ))}
      </Select>
    );
  }

  private changeHandler (e: ChangeEvent<{ value: number; }>) {
    baseMapsStore.selectBaseMap(e.target.value);
  }
}
