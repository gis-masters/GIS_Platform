import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { Notifications, NotificationsOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { eventService } from '../../services/event.service';
import { sidebars } from '../../stores/Sidebars.store';

const cnNotificationsToggler = cn('NotificationsToggler');

@observer
export class NotificationsToggler extends Component {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @observable private count = 0;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

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
            {sidebars.infoOpen ? <Notifications /> : <NotificationsOutlined />}
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
