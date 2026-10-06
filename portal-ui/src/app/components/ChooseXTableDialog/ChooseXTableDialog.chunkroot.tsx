import React, { type ReactElement, type ReactNode, useCallback, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { type Breakpoint, Dialog, DialogActions, DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type PageOptions } from '../../services/models';
import { type SortParams } from '../../services/util/sortObjects';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button, type ButtonProps } from '../Button/Button';
import { ChooseXTable, type ChooseXTableSelectionStatus } from '../ChooseXTable/ChooseXTable';
import { type XTableColumn } from '../XTable/XTable.models';

import './Content/ChooseXTableDialog-Content.scss';
import './Table/ChooseXTableDialog-Table.scss';

const cnChooseXTableDialog = cn('ChooseXTableDialog');

export interface ChooseXTableDialogBaseProps<T> extends IClassNameProps {
  title: string;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  open: boolean;
  loading?: boolean;
  maxWidth?: Breakpoint;
  fullWidth?: boolean;
  selectedItems?: T[];
  disabledTester?(item: T): boolean | string;
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  afterTable?: ReactNode;
  single?: boolean;
  withoutSelectAll?: boolean;
  additionalAction?: ReactNode;
  getRowId?(rowData: T): string | number;
  onClose(): void;
  onSelect(items: T[]): void;
  onChange?(items: T[]): void;
}

interface ChooseXTableDialogSyncProps<T> extends ChooseXTableDialogBaseProps<T> {
  data: T[];
}

interface ChooseXTableDialogAsyncProps<T> extends ChooseXTableDialogBaseProps<T> {
  getData(pageOptions: PageOptions): Promise<[T[], number]>;
}

export type ChooseXTableDialogProps<T> = ChooseXTableDialogAsyncProps<T> | ChooseXTableDialogSyncProps<T>;

type ChooseXTableDialogState = {
  empty: boolean;
  changed: boolean;
  setStatus(status: ChooseXTableSelectionStatus): void;
};

function ChooseXTableDialog<T>(props: ChooseXTableDialogProps<T>): ReactElement {
  const {
    className,
    title,
    open,
    data,
    defaultSort,
    secondarySortField,
    actionButtonProps = {},
    single,
    disabledTester,
    withoutSelectAll,
    loading,
    afterTable,
    maxWidth = 'xl',
    fullWidth,
    additionalAction,
    selectedItems,
    cols,
    getRowId,
    onClose,
    onSelect,
    onChange
  } = props as ChooseXTableDialogSyncProps<T>;
  const { getData } = props as ChooseXTableDialogAsyncProps<T>;
  const tableRef = useRef<ChooseXTable<T>>(null);

  const state = useLocalObservable<ChooseXTableDialogState>(() => ({
    empty: !(selectedItems && selectedItems.length),
    changed: false,
    setStatus(status) {
      this.empty = status.empty;
      this.changed = status.changed;
    }
  }));

  const handleSelect = useCallback(
    (selected: T[]) => {
      onChange?.(selected);
    },
    [onChange]
  );

  const handleClose = useCallback(() => {
    onClose();
    onChange?.([]);
    state.setStatus({ empty: true, changed: false });
  }, [onChange, onClose, state]);

  const handleSubmit = useCallback(() => {
    onSelect(tableRef.current?.getSelected() ?? []);
  }, [onSelect]);

  return (
    <Dialog
      slotProps={{ paper: { className: cnChooseXTableDialog(null, [className]) } }}
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogContent className={cnChooseXTableDialog('Content')}>
        <ChooseXTable<T>
          ref={tableRef}
          className={cnChooseXTableDialog('Table')}
          title={title}
          data={data}
          cols={cols}
          defaultSort={defaultSort}
          secondarySortField={secondarySortField}
          filterable
          loading={loading}
          disabledTester={disabledTester}
          filtersAlwaysEnabled
          single={single}
          withoutSelectAll={withoutSelectAll}
          selectedItems={selectedItems}
          onSelect={handleSelect}
          onSelectionStatusChange={state.setStatus}
          getRowId={getRowId}
          getData={getData}
        />

        {afterTable}
      </DialogContent>
      <DialogActions>
        <ActionsLeft>{additionalAction}</ActionsLeft>
        <ActionsRight>
          <Button
            disabled={state.empty}
            onClick={handleSubmit}
            color='primary'
            loading={loading}
            {...actionButtonProps}
            className={cnChooseXTableDialog('Submit', [actionButtonProps.className])}
          >
            {actionButtonProps.children || 'Выбрать'}
          </Button>
          <Button onClick={handleClose} className={cnChooseXTableDialog('Close')}>
            {state.changed ? 'Отмена' : 'Закрыть'}
          </Button>
        </ActionsRight>
      </DialogActions>
    </Dialog>
  );
}

export default observer(ChooseXTableDialog);
