import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Pagination } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PageOptions } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-Pagination.scss';

const cnAttributesPagination = cn('Attributes', 'Pagination');

interface AttributesPaginationProps {
  pageOptions: PageOptions;
  onChange(page: number): void;
}

@observer
export class AttributesPagination extends Component<AttributesPaginationProps> {
  render() {
    const { pageOptions } = this.props;

    return (
      <Pagination
        className={cnAttributesPagination()}
        count={pageOptions.totalPages}
        page={pageOptions.page + 1}
        size='small'
        onChange={this.handlePagination}
      />
    );
  }

  @boundMethod
  private handlePagination(e: React.ChangeEvent<unknown>, page: number) {
    const { onChange } = this.props;
    onChange(page);
  }
}
