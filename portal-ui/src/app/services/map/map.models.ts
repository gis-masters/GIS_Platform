import { Coordinate } from 'ol/coordinate';

export enum MapSelectionTypes {
  ADD,
  REMOVE,
  REPLACE
}

export enum MapMode {
  DEFAULT,
  SELECTION,
  MEASURE,
  ADDING_LABEL,
  DRAW,
  PICK
}

export enum MapAction {
  MOVE,
  PROKOL,
  SELECT_WITH_MODIFICATORS,
  SELECT,
  MEASUREMENT,
  DRAW,
  PICK,
  ADD_LABEL
}

export enum FilterBySelectionMode {
  ONLY_SELECTED = 'selected',
  ONLY_NOT_SELECTED = 'notSelected',
  DISABLED = 'disabled'
}

export interface MapPosition {
  zoom: number;
  center: Coordinate;
}
