import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCellTitle.scss';

const cnXTableHeadCellTitle = cn('XTable', 'HeadCellTitle');

interface XTableHeadCellTitleProps<T> {
  singleLineContent: boolean;
  col: XTableColumn<T>;
}

@observer
export class XTableHeadCellTitle<T> extends Component<XTableHeadCellTitleProps<T>> {
  @observable private needTooltip = false;

  constructor(props: XTableHeadCellTitleProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { col, singleLineContent } = this.props;
    const { title } = col;

    const inner = (
      <span className={cnXTableHeadCellTitle({ singleLineContent })} onMouseEnter={this.handleMouseEnter}>
        {title}
      </span>
    );

    return this.needTooltip ? <Tooltip title={title}>{inner}</Tooltip> : inner;
  }

  @action.bound
  private handleMouseEnter(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    const { col } = this.props;
    this.needTooltip = typeof col.title === 'string' && e.currentTarget.offsetWidth < e.currentTarget.scrollWidth;
  }
}
