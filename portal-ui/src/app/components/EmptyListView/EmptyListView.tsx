import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import { EmptyList } from '../Icons/EmptyList';

import '!style-loader!css-loader!sass-loader!./EmptyListView.scss';
import '!style-loader!css-loader!sass-loader!./Icon/EmptyListView-Icon.scss';
import '!style-loader!css-loader!sass-loader!./PrimaryText/EmptyListView-PrimaryText.scss';
import '!style-loader!css-loader!sass-loader!./SecondaryText/EmptyListView-SecondaryText.scss';

const cnEmptyListView = cn('EmptyListView');

export interface EmptyListProps {
  text: string;
  secondaryText?: string;
}

export class EmptyListView extends Component<EmptyListProps> {
  render() {
    return (
      <div className={cnEmptyListView()}>
        <div className={cnEmptyListView('Icon')}>
          <EmptyList />
        </div>
        <div className={cnEmptyListView('PrimaryText')}>{this.props.text}</div>
        <div className={cnEmptyListView('SecondaryText')}>{this.props.secondaryText}</div>
        <div className={cnEmptyListView('Children')}>{this.props.children}</div>
      </div>
    );
  }
}
