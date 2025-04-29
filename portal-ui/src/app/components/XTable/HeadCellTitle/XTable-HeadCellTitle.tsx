import React, { Component } from 'react';
import { observer } from 'mobx-react';
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
  render() {
    const { col, singleLineContent } = this.props;
    const { title } = col;

    return <span className={cnXTableHeadCellTitle({ singleLineContent })}>{title}</span>;
  }
}
