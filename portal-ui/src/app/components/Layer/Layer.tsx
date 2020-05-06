import React, { Component } from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { CrgLayer, CrgGroup } from '../../services/crg/projects.models';
import { supportedGeometryTypes } from '../../services/geoserver/wfs-models';

import { LayerEye } from './Eye/Layer-Eye';
import { LayerGap } from './Gap/Layer-Gap';
import { LayerCard } from './Card/Layer-Card';
import { LayerIcon } from './Icon/Layer-Icon.composed';
import { LayerMenu } from './Menu/Layer-Menu';
import { LayerOpen } from './Open/Layer-Open';
import { LayerTitle } from './Title/Layer-Title';
import { LayerBurger } from './Burger/Layer-Burger';
import { LayerLegend } from './Legend/Layer-Legend';
import { LayerInnards } from './Innards/Layer-Innards';
import { LayerTransparencyIndicator } from './TransparencyIndicator/Layer-TransparencyIndicator';

import '!style-loader!css-loader!sass-loader!./Layer.scss';

export const cnLayer = cn('Layer');

export interface LayerProps extends IClassNameProps {
  isGroup: boolean;
  data: CrgLayer | CrgGroup;
  depth: number;
  visible: boolean;
  onEyeClick: () => void;
}

@observer
export class Layer extends Component<LayerProps> {
  @observable private _open = false;
  @observable private menuOpen = false;
  @observable private menuX = 0;
  @observable private menuY = 0;
  private menuAnchor?: HTMLElement;

  constructor (props: LayerProps) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleBurgerClick = this.handleBurgerClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleContextMenuClose = this.handleContextMenuClose.bind(this);
  }

  render () {
    const { className, data, isGroup, depth, onEyeClick, visible } = this.props;
    const { title, enabled } = data;
    const { expanded } = data as CrgGroup;
    const geometryType = (data as CrgLayer).geometryType;
    const iconType = (isGroup ? 'group' : (
      supportedGeometryTypes.includes(geometryType) ? geometryType : 'unknown'
    ));

    return (
      <div className={cnLayer({ open: this.open, group: isGroup, visible }, [className])}>
        <LayerCard onContextMenu={this.handleContextMenu}>
          <LayerTransparencyIndicator value={data.transparency} />
          <LayerEye enabled={enabled} onClick={onEyeClick} />
          <LayerGap gap={depth} />
          <LayerOpen onClick={this.handleOpen} open={this.open} />
          <LayerIcon type={iconType} expanded={expanded} />
          <LayerTitle>
            {title}
          </LayerTitle>
          <LayerBurger onClick={this.handleBurgerClick} />
        </LayerCard>

        <LayerInnards show={this.open && !isGroup} depth={depth}>
          <LayerLegend layer={data as CrgLayer} />
        </LayerInnards>

        <LayerMenu
          isGroup={isGroup}
          entity={data}
          open={this.menuOpen}
          x={this.menuX}
          y={this.menuY}
          anchor={this.menuAnchor}
          onClose={this.handleContextMenuClose}
        />
      </div>
    );
  }

  @computed
  get open () {
    const { isGroup, data } = this.props;

    return isGroup ? (data as CrgGroup).expanded : this._open;
  }

  @action
  private handleOpen () {
    const { isGroup, data } = this.props;

    if (isGroup) {
      const group = data as CrgGroup;
      group.expanded = !group.expanded;
    } else {
      this._open = !this._open;
    }
  }

  @action
  private handleContextMenu (e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    delete this.menuAnchor;
    this.menuX = e.clientX - 2;
    this.menuY = e.clientY - 4;
    this.menuOpen = true;
  }

  @action
  private handleBurgerClick (e: React.MouseEvent<HTMLButtonElement>) {
    this.menuAnchor = e.target as HTMLButtonElement;
    this.menuOpen = true;

    const button = document.querySelector(':focus') as HTMLButtonElement;
    if (button) {
      button.blur();
    }
  }

  @action
  private handleContextMenuClose () {
    this.menuOpen = false;
  }
}
