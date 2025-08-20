import React, { Component, createRef } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Popover } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./Counter.scss';

const cnCounter = cn('Counter');

export interface CounterItem {
  title: string;
  value: number;
}

interface CounterProps {
  totalItemCounter?: string;
  setCounters?(): Promise<CounterItem[]>;
}

@observer
export class Counter extends Component<CounterProps> {
  @observable private countersInfo: CounterItem[] = [];
  @observable private popoverOpen = false;
  @observable private loading = false;

  btnRef = createRef<HTMLButtonElement>();

  constructor(props: CounterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { totalItemCounter } = this.props;

    return (
      <div className={cnCounter()}>
        {totalItemCounter}
        <IconButton
          className={cnCounter('Icon')}
          size='small'
          ref={this.btnRef}
          onClick={this.getPopoverInfo}
          loading={this.loading}
          color='inherit'
        >
          <InfoOutlined fontSize='small' />
        </IconButton>

        <Popover
          open={this.popoverOpen}
          anchorEl={this.btnRef.current}
          onClose={this.closePopover}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          PaperProps={{
            className: cnCounter('Popover')
          }}
        >
          {!!this.countersInfo.length && (
            <div className={cnCounter('PopoverContent')}>
              {this.countersInfo.map((counter, i) => {
                return (
                  <div key={i} className={cnCounter('PopoverContentItem')}>
                    <span className={cnCounter('PopoverContentItemTitle')}>{counter.title}</span>
                    {counter.value}
                  </div>
                );
              })}
            </div>
          )}
        </Popover>
      </div>
    );
  }

  @boundMethod
  private async getPopoverInfo() {
    const { setCounters } = this.props;

    if (setCounters) {
      this.setLoading(true);
      const info = await setCounters();
      this.setCountersInfo(info);
      this.setLoading(false);
      this.openPopover();
    }
  }

  @action.bound
  private openPopover() {
    this.popoverOpen = true;
  }

  @action.bound
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action.bound
  private closePopover() {
    this.popoverOpen = false;
  }

  @action.bound
  private setCountersInfo(countersInfo: CounterItem[]) {
    this.countersInfo = countersInfo;
  }
}
