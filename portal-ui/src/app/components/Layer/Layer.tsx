import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import {
  type CrgLayer,
  type CrgLayersGroup,
  CrgLayerType,
  type CrgVectorLayer
} from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { type TreeItemPayload } from '../../services/gis/projects/projects.models';
import { MapAction } from '../../services/map/map.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { mapStore } from '../../stores/Map.store';
import { Highlight } from '../Highlight/Highlight';
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

import './Layer.scss';

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
  onEyeClick(): void;
}

interface LayerState {
  open: boolean;
  menuOpen: boolean;
  menuX: number;
  menuY: number;
  errors: string[];
  menuAnchor?: HTMLElement | null;

  setOpen(open: boolean): void;
  openContextMenu(x: number, y: number): void;
  openBurgerMenu(anchor: HTMLButtonElement): void;
  closeMenu(): void;
  addError(error: string): void;
}

export const Layer = observer((props: LayerProps) => {
  const {
    className,
    data,
    isGroup,
    isEmptyGroup,
    depth,
    onEyeClick,
    visible,
    hiddenByZoom,
    editMode,
    highlighted,
    errors: errorsProp
  } = props;

  const isMountedRef = useRef(false);
  const prevEditModeRef = useRef(editMode);

  const state = useLocalObservable<LayerState>(() => ({
    open: false,
    menuOpen: false,
    menuX: 0,
    menuY: 0,
    errors: [],
    menuAnchor: undefined,

    setOpen(open) {
      this.open = open;
    },

    openContextMenu(x, y) {
      this.menuAnchor = undefined;
      this.menuX = x;
      this.menuY = y;
      this.menuOpen = true;
    },

    openBurgerMenu(anchor) {
      this.menuAnchor = anchor;
      this.menuOpen = true;
    },

    closeMenu() {
      this.menuOpen = false;
    },

    addError(error) {
      this.errors.push(error);
    }
  }));

  const open = isGroup ? Boolean((data as CrgLayersGroup).expanded) : state.open;
  const errors = errorsProp ? [...state.errors, ...errorsProp] : state.errors;
  const isError = Boolean(errors.length);

  const handleOpen = useCallback(() => {
    if (isGroup) {
      const group = data as CrgLayersGroup;
      group.expanded = !group.expanded;

      return;
    }

    const { type } = data as CrgLayer;

    if (
      ((type !== CrgLayerType.SHP &&
        type !== CrgLayerType.VECTOR &&
        type !== CrgLayerType.EXTERNAL &&
        type !== CrgLayerType.EXTERNAL_NSPD &&
        type !== CrgLayerType.EXTERNAL_GEOSERVER) ||
        editMode) &&
      !isError
    ) {
      return;
    }

    state.setOpen(!state.open);
  }, [state, isGroup, data, editMode, isError]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (isError) {
        return;
      }

      state.openContextMenu(e.clientX - 2, e.clientY - 4);
    },
    [state, isError]
  );

  const handleBurgerClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      state.openBurgerMenu(e.target as HTMLButtonElement);

      const button: HTMLButtonElement | null = document.querySelector(':focus');
      if (button) {
        button.blur();
      }
    },
    [state]
  );

  const handleContextMenuClose = useCallback(() => {
    state.closeMenu();
  }, [state]);

  useEffect(() => {
    isMountedRef.current = true;

    const testSchema = async () => {
      if (!isMountedRef.current) {
        return;
      }

      if (isGroup) {
        return;
      }

      const { type } = data as CrgVectorLayer;
      if (type === CrgLayerType.VECTOR) {
        try {
          return await getLayerSchema(data);
        } catch {
          state.addError('Не найдена схема для слоя: ' + data.title);

          if (data.enabled) {
            onEyeClick();
          }
        }
      } else if (isVectorFromFile(type)) {
        return await getLayerSchema(data as CrgVectorLayer);
      }
    };

    void testSchema();

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- только при монтировании, как componentDidMount
  }, []);

  useEffect(() => {
    if (editMode && !prevEditModeRef.current) {
      state.setOpen(false);
    }

    prevEditModeRef.current = editMode;
  }, [editMode, state]);

  const { title, enabled, transparency } = data;
  const { expanded } = data as CrgLayersGroup;
  const out = currentProject.viewZoom > ((data as CrgLayer).minZoom || 0);
  const type = (data as CrgLayer).type;
  const isVectorLayer = type === CrgLayerType.VECTOR || type === CrgLayerType.SHP;
  let hiddenByZoomTooltipText = '';
  if (hiddenByZoom) {
    const zoomVerb = out ? 'Уменьшите' : 'Увеличьте';
    hiddenByZoomTooltipText = `${zoomVerb} карту, чтобы увидеть объекты`;
  }

  return (
    <div className={cnLayer({ open, group: isGroup, visible, editMode }, [className])}>
      <LayerCard onContextMenu={handleContextMenu} highlighted={highlighted}>
        <LayerDrag />
        {!hiddenByZoom && <LayerTransparencyIndicator value={transparency || 100} />}
        {hiddenByZoom && <LayerZoomWarning out={out} tooltipText={hiddenByZoomTooltipText} />}
        <LayerEye
          enabled={!!enabled}
          disabled={isError || !mapStore.allowedActions.includes(MapAction.LAYER_EYE)}
          onClick={onEyeClick}
          tooltipText={hiddenByZoomTooltipText}
        />
        <LayerGap gap={depth || 0} />
        <LayerOpen onClick={handleOpen} open={open} disabled={currentProject.filter ? true : editMode && !isGroup} />
        <LayerIcon isGroup={isGroup} expanded={!!expanded} data={data} isError={isError} />
        <LayerTitle isError={isError}>
          {currentProject.filter ? (
            <Highlight searchWords={[currentProject.filter]} enabled>
              {title}
            </Highlight>
          ) : (
            title
          )}
          {isEmptyGroup && <LayerEmptiness />}
        </LayerTitle>
        <LayerBurger onClick={handleBurgerClick} />
      </LayerCard>

      <LayerInnards show={open && !isGroup} depth={depth || 0}>
        {isError && <LayerErrors errors={errors} />}
        {isVectorLayer && !isError && <LayerLegend layer={data as CrgVectorLayer} />}
      </LayerInnards>

      {(state.menuAnchor || !!(state.menuX && state.menuY)) && (
        <LayerMenu
          isGroup={isGroup}
          entity={data}
          open={state.menuOpen}
          x={state.menuX}
          y={state.menuY}
          anchor={state.menuAnchor ?? undefined}
          onClose={handleContextMenuClose}
          layerWithError={isError}
          editMode={editMode}
        />
      )}
    </div>
  );
});
