import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Button } from '../Button/Button';
import { Explorer } from '../Explorer/Explorer';
import { emptyItem, ExplorerItemData, ExplorerItemType, ExplorerSearchValue } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./SearchResultDialog.scss';

const cnSearchResultDialog = cn('SearchResultDialog');

export interface SearchResultDialogProps {
  open: boolean;
  search: ExplorerSearchValue;
  onClose(): void;
}

@observer
export class SearchResultDialog extends Component<SearchResultDialogProps> {
  constructor(props: SearchResultDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth='xl' fullWidth>
        <DialogTitle>Результаты поиска:</DialogTitle>
        <DialogContent>
          <Explorer
            explorerRole='SearchResultDialog'
            className={cnSearchResultDialog('Explorer')}
            path={this.path}
            fixedHeight
            withInfoPanel
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get path(): ExplorerItemData[] {
    return [{ type: ExplorerItemType.SEARCH_RESULT_ROOT, payload: this.props.search }, emptyItem];
  }
}
