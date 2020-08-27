import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Tooltip, IconButton, Badge } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { eventService, IEvent } from '../../services/event.service';
import { sidebars } from '../../stores/Sidebars.store';

const cnNotificationsToggler = cn('NotificationsToggler');

interface NotificationsTogglerProps {}

@observer
export class NotificationsToggler extends Component<NotificationsTogglerProps> {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @observable private count = 0;

  componentDidMount() {
    eventService.events$
      .pipe(
        filter(value => !!value),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(events => this.setCount(events.length));
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  render() {
    return (
      <Tooltip title='Уведомления'>
        <IconButton className={cnNotificationsToggler()} onClick={this.handleClick} color='inherit'>
          <Badge badgeContent={this.count} color='secondary' invisible={!this.count}>
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick() {
    if (sidebars.infoOpen) {
      sidebars.closeInfo();
    } else {
      sidebars.openInfo();
    }
  }

  @action
  private setCount(count: number) {
    this.count = count;
  }
}
