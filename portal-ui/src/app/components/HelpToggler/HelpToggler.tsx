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
  DialogActions
} from '@material-ui/core';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import { cn } from '@bem-react/classname';

import { HelpPart } from '../../services/HelpPart';
import { route } from '../../stores/Route.store';
import { TocItem } from '../../stores/Help.store';
import { HelpPopup } from '../HelpPopup/HelpPopup';
import { Help } from '../Help/Help';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./HelpToggler.scss';

const cnHelpToggler = cn('HelpToggler');

@observer
export class HelpToggler extends Component<{}> {
  @observable private popupOpen = false;
  @observable private dialogOpen = false;
  @observable private selectedItem?: TocItem;
  private helpPart: HelpPart;
  private ref = createRef<HTMLButtonElement>();

  constructor(props: {}) {
    super(props);

    this.helpPart = new HelpPart(route.data.page);
  }

  render() {
    if (!this.visible) {
      return null;
    }

    return (
      <>
        <IconButton className={cnHelpToggler()} onClick={this.openPopup} ref={this.ref}>
          <LiveHelpIcon />
        </IconButton>

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
  private get visible(): boolean {
    return Boolean(this.helpPart.items && this.helpPart.items.length);
  }

  @action.bound
  private openPopup() {
    this.popupOpen = true;
  }

  @action.bound
  private closePopup() {
    this.popupOpen = false;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private handleSelect(item: TocItem) {
    this.selectedItem = item;
    this.openDialog();
    this.closePopup();
  }
}
