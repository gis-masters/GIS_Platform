import React, { Component, createRef } from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import {
  IconButton,
  Fade,
  Paper,
  Popper,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
} from '@material-ui/core';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import { cn } from '@bem-react/classname';

import { HelpPart } from '../../services/HelpPart';
import { TocItem } from '../../stores/Help.store';
import { route } from '../../stores/Route.store';
import { HelpPopup } from '../HelpPopup/HelpPopup';
import { Button } from '../Button/Button';
import { Help } from '../Help/Help';

import '!style-loader!css-loader!sass-loader!./HelpToggler.scss';

const cnHelpToggler = cn('HelpToggler');

@observer
export class HelpToggler extends Component<{}> {
  @observable private popupOpen = false;
  @observable private dialogOpen = false;
  @observable private selectedItem?: TocItem;
  private ref = createRef<HTMLButtonElement>();

  render() {
    if (!this.visible) {
      return null;
    }

    return (
      <>
        <Tooltip title={'Справка'}>
          <IconButton className={cnHelpToggler()} onClick={this.togglePopup} ref={this.ref} color='inherit'>
            <LiveHelpIcon />
          </IconButton>
        </Tooltip>

        <Popper className={cnHelpToggler('Popup')} open={this.popupOpen} anchorEl={this.ref.current} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <HelpPopup items={this.helpPart.items} onSelect={this.handleSelect} onClose={this.closePopup} />
              </Paper>
            </Fade>
          )}
        </Popper>

        <Dialog open={this.dialogOpen} onClose={this.closeDialog} PaperProps={{ className: cnHelpToggler('Dialog') }}>
          <DialogContent>
            <DialogContentText>Справка</DialogContentText>
            <Help className={cnHelpToggler('Help')} selectedItem={this.selectedItem} helpPart={this.helpPart} />
          </DialogContent>
          <DialogActions>
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
  private closePopup() {
    this.popupOpen = false;
  }

  @action.bound
  private togglePopup() {
    this.popupOpen = !this.popupOpen;
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
    this.closePopup();
  }
}
