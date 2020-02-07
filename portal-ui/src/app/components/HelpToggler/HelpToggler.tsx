import React from 'react';
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
export class HelpToggler extends React.Component<{}> {
  @observable private popupOpen = false;
  @observable private dialogOpen = false;
  @observable private selectedItem?: TocItem;
  @observable private key: string;
  private helpPart: HelpPart;
  private ref = React.createRef<HTMLButtonElement>();

  constructor (props: {}) {
    super(props);

    this.helpPart = new HelpPart(route.data.helpPage);

    this.togglePopupOpen = this.togglePopupOpen.bind(this);
    this.toggleDialogOpen = this.toggleDialogOpen.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  async componentDidMount () {
    await this.helpPart.inited;
    this.setKey();
    const wasClosed = localStorage.getItem(this.key);
    if (!wasClosed) {
      this.togglePopupOpen();
    }
  }

  render () {
    if (!this.visible) {
      return null;
    }

    return (
      <>
        <IconButton className={cnHelpToggler()} onClick={this.togglePopupOpen} ref={this.ref}>
          <LiveHelpIcon />
        </IconButton>

        <Popper className={cnHelpToggler('Popup')} open={this.popupOpen} anchorEl={this.ref.current} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <HelpPopup items={this.helpPart.items} onSelect={this.handleSelect} onClose={this.togglePopupOpen} />
              </Paper>
            </Fade>
          )}
        </Popper>

        <Dialog open={this.dialogOpen} PaperProps={{ className: cnHelpToggler('Dialog') }}>
          <DialogContent>
            <DialogContentText>
              Справка
            </DialogContentText>
            <Help className={cnHelpToggler('Help')} selectedItem={this.selectedItem} helpPart={this.helpPart} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialogOpen} variant='outlined'>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get visible (): boolean {
    return Boolean(this.helpPart.items && this.helpPart.items.length);
  }

  @action
  private setKey () {
    this.key = 'help-popup__' + this.helpPart.path.join('/');
  }

  @action
  private togglePopupOpen () {
    this.popupOpen = !this.popupOpen;
    if (!this.popupOpen) {
      localStorage.setItem(this.key, '1');
    }
  }

  @action
  private toggleDialogOpen () {
    this.dialogOpen = !this.dialogOpen;
  }

  @action
  private handleSelect (item: TocItem) {
    this.selectedItem = item;
    this.toggleDialogOpen();
    this.togglePopupOpen();
  }
}
