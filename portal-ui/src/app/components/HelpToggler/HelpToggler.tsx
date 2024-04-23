import React, { Component, createRef } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Tooltip } from '@mui/material';
import { LiveHelp, LiveHelpOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { HelpPart } from '../../services/HelpPart';
import { TocItem } from '../../stores/Help.store';
import { route } from '../../stores/Route.store';
import { Button } from '../Button/Button';
import { Help } from '../Help/Help';

import '!style-loader!css-loader!sass-loader!./HelpToggler.scss';

const cnHelpToggler = cn('HelpToggler');

@observer
export class HelpToggler extends Component {
  @observable private dialogOpen = false;
  @observable private selectedItem?: TocItem;
  private ref = createRef<HTMLButtonElement>();

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    if (!this.visible) {
      return null;
    }

    return (
      <>
        <Tooltip title={'Справка'}>
          <IconButton className={cnHelpToggler()} onClick={this.openDialog} ref={this.ref} color='inherit'>
            {this.dialogOpen ? <LiveHelp /> : <LiveHelpOutlined />}
          </IconButton>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeDialog} PaperProps={{ className: cnHelpToggler('Dialog') }}>
          <DialogContent>
            <DialogContentText>Справка</DialogContentText>
            <Help className={cnHelpToggler('Help')} selectedItem={this.selectedItem} helpPart={this.helpPart} />
          </DialogContent>
          <DialogActions>
            <Button color='primary' routerLink='/about'>
              Все статьи
            </Button>
            <Button onClick={this.closeDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get helpPart(): HelpPart {
    return new HelpPart(route.data.page);
  }

  @computed
  private get visible(): boolean {
    return Boolean(this.helpPart.items && this.helpPart.items.length);
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private handleSelect(item: TocItem) {
    this.selectedItem = item;
    this.openDialog();
  }
}
