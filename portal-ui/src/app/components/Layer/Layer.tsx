import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { CrgGroup, CrgLayer, CrgLayerType } from '../../services/crg/projects.models';
import { supportedGeometryTypes } from '../../services/geoserver/wfs-models';
import { schemaService } from '../../services/crg/schema.service';

import { LayerEye } from './Eye/Layer-Eye';
import { LayerGap } from './Gap/Layer-Gap';
import { LayerCard } from './Card/Layer-Card';
import { LayerIcon } from './Icon/Layer-Icon.composed';
import { IconType } from './Icon/Layer-Icon';
import { LayerMenu } from './Menu/Layer-Menu';
import { LayerOpen } from './Open/Layer-Open';
import { LayerTitle } from './Title/Layer-Title';
import { LayerBurger } from './Burger/Layer-Burger';
import { LayerLegend } from './Legend/Layer-Legend';
import { LayerInnards } from './Innards/Layer-Innards';
import { LayerTransparencyIndicator } from './TransparencyIndicator/Layer-TransparencyIndicator';
import { LayerErrors } from './Errors/Layer-Errors';

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
  @observable private iconType: IconType = 'unknown';
  @observable private errors: string[] = [];
  private menuAnchor?: HTMLElement;

  constructor (props: LayerProps) {
    super(props);

    this.fetchIconType();

    this.handleOpen = this.handleOpen.bind(this);
    this.handleBurgerClick = this.handleBurgerClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleContextMenuClose = this.handleContextMenuClose.bind(this);
  }

  render () {
    const { className, data, isGroup, depth, onEyeClick, visible } = this.props;
    const { title, enabled } = data;
    const { expanded } = data as CrgGroup;

    return (
      <div className={cnLayer({ open: this.open, group: isGroup, visible }, [className])}>
        <LayerCard onContextMenu={this.handleContextMenu}>
          <LayerTransparencyIndicator value={data.transparency} />
          <LayerEye enabled={enabled} disabled={this.isError} onClick={onEyeClick} />
          <LayerGap gap={depth} />
          <LayerOpen onClick={this.handleOpen} open={this.open} />
          <LayerIcon type={this.iconType} expanded={expanded} />
          <LayerTitle isError={this.isError}>
            {title}
          </LayerTitle>
          <LayerBurger disabled={this.isError} onClick={this.handleBurgerClick} />
        </LayerCard>

        <LayerInnards show={this.open && !isGroup} depth={depth}>
          {this.isError && <LayerErrors errors={this.errors} />}
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
  private get open (): boolean {
    const { isGroup, data } = this.props;

    return isGroup ? (data as CrgGroup).expanded : this._open;
  }

  @computed
  private get isError (): boolean {
    return Boolean(this.errors.length);
  }

  private async fetchIconType () {
    const { data, isGroup } = this.props;
    let iconType: IconType;

    if (isGroup) {
      iconType = 'group';
    } else {
      const { schemaId, type } = data as CrgLayer;

      if (type === CrgLayerType.VECTOR) {
        try {
          const { geometryType } = await schemaService.getSchema(schemaId);
          iconType = supportedGeometryTypes.includes(geometryType) ? geometryType : 'unknown';
        } catch (e) {
          iconType = 'error';
          this.addError('Не найдена схема для слоя.');
        }
      } else {
        iconType = 'raster';
      }
    }

    this.setIconType(iconType);
  }

  @action
  private setIconType (iconType: IconType) {
    this.iconType = iconType;
  }

  @action
  private handleOpen () {
    const { isGroup, data } = this.props;

    if (isGroup) {
      const group = data as CrgGroup;
      group.expanded = !group.expanded;
    } else {
      const { type } = data as CrgLayer;
      if (type !== CrgLayerType.VECTOR) {
        return;
      }

      this._open = !this._open;
    }
  }

  @action
  private handleContextMenu (e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    if (this.isError) {
      return;
    }

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

  @action
  private addError (error: string) {
    this.errors.push(error);

    const { data, onEyeClick } = this.props;

    if (data.enabled) {
      onEyeClick();
    }
  }
}
