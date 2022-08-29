import React, { Component } from 'react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { Box, Menu, MenuItem } from '@mui/material';
import { action, makeObservable, observable } from 'mobx';
import { MoreHoriz } from '@mui/icons-material';
import { observer } from 'mobx-react';

import { IconButton } from '../../../IconButton/IconButton';

import { BreadcrumbsItemData, BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';
import { BreadcrumbsItem } from '../Breadcrumbs-Item.composed';

interface BreadcrumbsItemTypeSubListProps extends IClassNameProps {
  type: 'showMore';
  showMoreList?: BreadcrumbsItemData[];
}

@observer
class ContainerComponent extends Component<BreadcrumbsItemTypeSubListProps> {
  @observable private anchorEl: HTMLElement | null = null;

  constructor(props: BreadcrumbsItemTypeSubListProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, showMoreList } = this.props;
    const open = Boolean(this.anchorEl);

    return (
      <Box display='flex' flexDirection='column'>
        <IconButton onMouseOver={this.toggleOpen} size='small'>
          <MoreHoriz fontSize='small' />
        </IconButton>
        <Menu open={open} MenuListProps={{ onMouseLeave: this.close }} anchorEl={this.anchorEl} keepMounted>
          {showMoreList?.map((item, i) => (
            <MenuItem key={i} onClick={this.close}>
              <BreadcrumbsItem {...item} className={className} type={'button'} />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  @action.bound
  private toggleOpen(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    this.anchorEl = this.anchorEl ? null : (e.target as HTMLElement);
  }

  @action.bound
  private close() {
    this.anchorEl = null;
  }
}

export const withTypeSubList = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeSubListProps>(
  cnBreadcrumbsItem(),
  { type: 'showMore' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
