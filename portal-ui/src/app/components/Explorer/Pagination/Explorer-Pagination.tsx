import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Pagination } from '@material-ui/lab';

import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Pagination.scss';

const cnExplorerPagination = cn('Explorer', 'Pagination');

interface ExplorerPaginationProps {
  store: ExplorerStore;
  onChange: (page: number) => void;
}

@observer
export class ExplorerPagination extends Component<ExplorerPaginationProps> {
  render() {
    const { page, totalPages } = this.props.store;

    return (
      totalPages > 1 && (
        <Pagination className={cnExplorerPagination()} page={page + 1} count={totalPages} onChange={this.setPage} />
      )
    );
  }

  @action.bound
  private setPage(e: React.ChangeEvent<unknown>, page: number) {
    this.props.onChange(page - 1);
  }
}
