import React, { Component, ReactNode, RefObject, createRef } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { KeyboardArrowDown } from '@mui/icons-material';
import { action, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { Popover } from '@mui/material';

import { IconButton } from '../IconButton/IconButton';
import { Highlight } from '../Highlight/Highlight';
import { sleep } from '../../services/util/sleep';

import '!style-loader!css-loader!sass-loader!./FeaturesListItemSearchResult.scss';

const cnFeaturesListItemSearchResult = cn('FeaturesListItemSearchResult');

interface FeaturesListSidebarFeaturesProps {
  searchResults: ReactNode;
  headlines: string[];
  searchPreview: string;
}

@observer
export default class FeaturesListItemSearchResult extends Component<FeaturesListSidebarFeaturesProps> {
  @observable private iconCoordinates?: DOMRect;
  @observable private popoverCoordinates?: DOMRect;
  @observable private popoverAnchor?: HTMLButtonElement | null;

  private paperRef: RefObject<HTMLDivElement> = createRef();

  constructor(props: FeaturesListSidebarFeaturesProps) {
    super(props);
    makeObservable(this);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.trackCursorPosition);
  }

  render() {
    const { searchResults, headlines, searchPreview } = this.props;

    return (
      <div className={cnFeaturesListItemSearchResult()}>
        <IconButton
          className={cnFeaturesListItemSearchResult('Icon')}
          size='small'
          onMouseMove={this.openPopover}
          color='inherit'
        >
          <KeyboardArrowDown fontSize='small' />
        </IconButton>

        <Highlight searchWords={headlines} enabled>
          {searchPreview}
        </Highlight>

        <Popover
          open={!!this.popoverAnchor}
          anchorEl={this.popoverAnchor}
          onMouseEnter={this.getPopoverInfo}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          PaperProps={{
            className: cnFeaturesListItemSearchResult('Popover'),
            ref: this.paperRef
          }}
        >
          {searchResults}
        </Popover>
      </div>
    );
  }

  @action.bound
  private clearAnchor() {
    this.popoverAnchor = null;
    document.removeEventListener('mousemove', this.trackCursorPosition);
  }

  @action.bound
  private openPopover(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.popoverAnchor = e.target as HTMLButtonElement;
    this.iconCoordinates = e.currentTarget.getBoundingClientRect();
    document.addEventListener('mousemove', this.trackCursorPosition);
  }

  @boundMethod
  private async getPopoverInfo() {
    await sleep(100); // т.к. иначе попап не успевает полностью отрендериться
    const popoverCoordinates = this.paperRef?.current?.getBoundingClientRect();
    if (popoverCoordinates) {
      this.setPopoverInfo(popoverCoordinates);
    }
  }

  @action.bound
  private setPopoverInfo(popoverCoordinates: DOMRect) {
    this.popoverCoordinates = popoverCoordinates;
  }

  @boundMethod
  private trackCursorPosition(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    if (this.iconCoordinates) {
      // +5 для того что бы у пользователя было больше пространства для поглаживания иконки
      const cursorOutsideIcon =
        x < this.iconCoordinates.left + 5 ||
        x > this.iconCoordinates.right + 5 ||
        y < this.iconCoordinates.top + 5 ||
        y > this.iconCoordinates.bottom + 5;

      const cursorOutsidePopover = this.popoverCoordinates
        ? x < this.popoverCoordinates.left ||
          x > this.popoverCoordinates.right ||
          y < this.popoverCoordinates.top ||
          y > this.popoverCoordinates.bottom
        : false;

      if (cursorOutsideIcon && cursorOutsidePopover) {
        this.clearAnchor();
      }
    }
  }
}
