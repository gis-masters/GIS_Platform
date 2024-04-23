import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { TreeItemPayload } from '../../services/gis/projects/projects.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { LayerBurger } from './Burger/Layer-Burger';
import { LayerCard } from './Card/Layer-Card';
import { LayerDrag } from './Drag/Layer-Drag';
import { LayerEmptiness } from './Emptiness/Layer-Emptiness';
import { LayerErrors } from './Errors/Layer-Errors';
import { LayerEye } from './Eye/Layer-Eye';
import { LayerGap } from './Gap/Layer-Gap';
import { LayerIcon } from './Icon/Layer-Icon';
import { LayerInnards } from './Innards/Layer-Innards';
import { LayerLegend } from './Legend/Layer-Legend';
import { LayerMenu } from './Menu/Layer-Menu';
import { LayerOpen } from './Open/Layer-Open';
import { LayerTitle } from './Title/Layer-Title';
import { LayerTransparencyIndicator } from './TransparencyIndicator/Layer-TransparencyIndicator';
import { LayerZoomWarning } from './ZoomWarning/Layer-ZoomWarning';

import '!style-loader!css-loader!sass-loader!./Layer.scss';

export const cnLayer = cn('Layer');

export interface LayerProps extends IClassNameProps {
  isGroup: boolean;
  isEmptyGroup?: boolean;
  data: TreeItemPayload;
  depth?: number;
  visible?: boolean;
  hiddenByZoom?: boolean;
  errors?: string[];
  editMode: boolean;
  highlighted: boolean;
  onEyeClick: () => void;
}

@observer
export class Layer extends Component<LayerProps> {
  @observable private _open = false;
  @observable private menuOpen = false;
  @observable private menuX = 0;
  @observable private menuY = 0;
  @observable private _errors: string[] = [];
  private menuAnchor?: HTMLElement;

  constructor(props: LayerProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.testSchema();
  }

  componentDidUpdate({ editMode: prevEditMode }: LayerProps) {
    const { editMode } = this.props;

    if (editMode && !prevEditMode) {
      this.setOpen(false);
    }
  }
  render() {
    const { className, data, isGroup, isEmptyGroup, depth, onEyeClick, visible, hiddenByZoom, editMode, highlighted } =
      this.props;
    const { title, enabled, transparency } = data;
    const { expanded } = data as CrgLayersGroup;
    const out = currentProject.viewZoom > (data as CrgLayer).minZoom;
    const type = (data as CrgLayer).type;
    const isVectorLayer = type === CrgLayerType.VECTOR || type === CrgLayerType.SHP;
    const hiddenByZoomTooltipText = hiddenByZoom
      ? `${out ? 'Уменьшите' : 'Увеличьте'} карту, чтобы увидеть объекты`
      : '';

    return (
      <div className={cnLayer({ open: this.open, group: isGroup, visible, editMode }, [className])}>
        <LayerCard onContextMenu={this.handleContextMenu} highlighted={highlighted}>
          <LayerDrag />
          {!hiddenByZoom && <LayerTransparencyIndicator value={transparency} />}
          {hiddenByZoom && <LayerZoomWarning out={out} tooltipText={hiddenByZoomTooltipText} />}
          <LayerEye
            enabled={enabled}
            disabled={this.isError}
            onClick={onEyeClick}
            tooltipText={hiddenByZoomTooltipText}
          />
          <LayerGap gap={depth} />
          <LayerOpen onClick={this.handleOpen} open={this.open} disabled={editMode && !isGroup} />
          <LayerIcon isGroup={isGroup} expanded={expanded} data={data} isError={this.isError} />
          <LayerTitle isError={this.isError}>
            {title}
            {isEmptyGroup && <LayerEmptiness />}
          </LayerTitle>
          <LayerBurger onClick={this.handleBurgerClick} />
        </LayerCard>

        <LayerInnards show={this.open && !isGroup} depth={depth}>
          {this.isError && <LayerErrors errors={this.errors} />}
          {isVectorLayer && <LayerLegend layer={data as CrgVectorLayer} />}
        </LayerInnards>

        <LayerMenu
          isGroup={isGroup}
          entity={data}
          open={this.menuOpen}
          x={this.menuX}
          y={this.menuY}
          anchor={this.menuAnchor}
          onClose={this.handleContextMenuClose}
          layerWithError={this.isError}
          editMode={editMode}
        />
      </div>
    );
  }

  @computed
  private get open(): boolean {
    const { isGroup, data } = this.props;

    return isGroup ? Boolean((data as CrgLayersGroup).expanded) : this._open;
  }

  @computed
  private get errors(): string[] {
    if (this.props.errors) {
      return [...this._errors, ...this.props.errors];
    }

    return this._errors;
  }

  @computed
  private get isError(): boolean {
    return Boolean(this.errors.length);
  }

  private async testSchema() {
    const { data, isGroup } = this.props;
    if (isGroup) {
      return;
    }

    const { type } = data as CrgVectorLayer;
    if (type === CrgLayerType.VECTOR) {
      try {
        return await getLayerSchema(data);
      } catch {
        this.addError('Не найдена схема для слоя: ' + data.title);
      }
    } else if (isVectorFromFile(type)) {
      return await getLayerSchema(data as CrgVectorLayer);
    }
  }

  @action.bound
  private handleOpen() {
    const { isGroup, data, editMode } = this.props;

    if (isGroup) {
      const group = data as CrgLayersGroup;
      group.expanded = !group.expanded;
    } else {
      const { type } = data as CrgLayer;

      if (
        (type !== CrgLayerType.SHP &&
          type !== CrgLayerType.VECTOR &&
          type !== CrgLayerType.EXTERNAL &&
          type !== CrgLayerType.EXTERNAL_GEOSERVER) ||
        editMode
      ) {
        return;
      }

      this.setOpen(!this._open);
    }
  }

  @action.bound
  private handleContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    if (this.isError) {
      return;
    }

    delete this.menuAnchor;
    this.menuX = e.clientX - 2;
    this.menuY = e.clientY - 4;
    this.menuOpen = true;
  }

  @action.bound
  private handleBurgerClick(e: React.MouseEvent<HTMLButtonElement>) {
    this.menuAnchor = e.target as HTMLButtonElement;
    this.menuOpen = true;

    const button: HTMLButtonElement | null = document.querySelector(':focus');
    if (button) {
      button.blur();
    }
  }

  @action.bound
  private handleContextMenuClose() {
    this.menuOpen = false;
  }

  @action
  private addError(error: string) {
    this.errors.push(error);

    const { data, onEyeClick } = this.props;

    if (data.enabled) {
      onEyeClick();
    }
  }

  @action
  private setOpen(open: boolean) {
    this._open = open;
  }
}
