import React, { Component } from 'react';
import { TableRow, TableRowProps } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

const cnXTableRow = cn('XTable', 'Row');

interface XTableRowProps<T> extends TableRowProps {
  rowData: T;
  onRowDoubleClick?(rowData: T): void;
}

export class XTableRow<T> extends Component<XTableRowProps<T>> {
  render() {
    const { rowData, onRowDoubleClick, ...props } = this.props;

    return <TableRow hover {...props} className={cnXTableRow()} onDoubleClick={this.handleDoubleClick} />;
  }

  @boundMethod
  private handleDoubleClick() {
    const { onRowDoubleClick: onRowDoubleClick, rowData } = this.props;
    onRowDoubleClick?.(rowData);
  }
}
