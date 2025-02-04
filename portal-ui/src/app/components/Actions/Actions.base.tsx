import React, { Component, ComponentType } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../services/models';
import { ActionsItemVariant } from './Item/Actions-Item.base';

import '!style-loader!css-loader!sass-loader!./Actions.scss';

export const cnActions = cn('Actions');

export interface ActionsProps extends IClassNameProps, ChildrenProps {
  as: ActionsItemVariant;
  ContainerComponent?: ComponentType;
}

@observer
export class ActionsBase extends Component<ActionsProps> {
  render() {
    const { ContainerComponent = 'div', className, children } = this.props;

    return <ContainerComponent className={cnActions(null, [className])}>{children}</ContainerComponent>;
  }
}
