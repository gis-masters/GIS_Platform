import { useLocalObservable } from 'mobx-react';

import { type Schema } from '../../../services/data/schema/schema.models';
import { type EditedField, type OldSchema } from '../../../services/data/schema/schemaOld.models';
import { type WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import {
  type CrgExternalLayer,
  type CrgVectorableLayer,
  type CrgVectorLayer
} from '../../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../../services/map/mode/map-mode.models';
import { type ValidationResult } from '../../../services/util/FeaturePropertyValidatorsReact';

export interface ShouldRender {
  noData: boolean;
  noFeature: boolean;
  noLayerSchema: boolean;
}

export type EditFeatureLayer = CrgVectorableLayer | CrgVectorLayer | CrgExternalLayer | undefined;

export interface EditFeatureFormControl {
  key: string;
  value: unknown;
  validators?: ValidationResult[];
  disabled?: boolean;
  valid?: boolean;
  error?: string;
  dirty?: boolean;
}

export interface EditFeatureState {
  mode: EditFeatureMode;
  setMode(mode: EditFeatureMode): void;
  layer: EditFeatureLayer;
  setLayer(layer: EditFeatureLayer): void;
  isNew: boolean;
  setIsNew(isNew: boolean): void;
  features: WfsFeature[];
  setFeatures(features: WfsFeature[]): void;
  selectedTab: number;
  setSelectedTab(selectedTab: number): void;
  isGeometryChanged: boolean;
  setIsGeometryChanged(isGeometryChanged: boolean): void;
  updatingAllowed: boolean;
  setUpdatingAllowed(updatingAllowed: boolean): void;
  isGeometryAutoFixed: boolean;
  setIsGeometryAutoFixed(isGeometryAutoFixed: boolean): void;
  isSaveInProgress: boolean;
  setIsSaveInProgress(isSaveInProgress: boolean): void;
  editFeatureData: EditedField[];
  setEditFeatureData(editFeatureData: EditedField[]): void;
  shouldRender: ShouldRender;
  setShouldRender(shouldRender: ShouldRender): void;
  setNoLayerSchema(noLayerSchema: boolean): void;
  layerSchema: Schema | undefined;
  setLayerSchema(layerSchema: Schema | undefined): void;
  featureDescription: OldSchema | undefined;
  setFeatureDescription(featureDescription: OldSchema | undefined): void;
  formControls: EditFeatureFormControl[];
  setFormControls(formControls: EditFeatureFormControl[]): void;
}

export const useEditFeatureState = (): EditFeatureState => {
  return useLocalObservable<EditFeatureState>(() => ({
    mode: EditFeatureMode.single,
    setMode(mode) {
      this.mode = mode;
    },
    layer: undefined,
    setLayer(layer) {
      this.layer = layer;
    },
    isNew: false,
    setIsNew(isNew) {
      this.isNew = isNew;
    },
    features: [],
    setFeatures(features) {
      this.features = features;
    },
    selectedTab: 0,
    setSelectedTab(selectedTab) {
      this.selectedTab = selectedTab;
    },
    isGeometryChanged: false,
    setIsGeometryChanged(isGeometryChanged) {
      this.isGeometryChanged = isGeometryChanged;
    },
    isGeometryAutoFixed: false,
    setIsGeometryAutoFixed(isGeometryAutoFixed) {
      this.isGeometryAutoFixed = isGeometryAutoFixed;
    },
    updatingAllowed: false,
    setUpdatingAllowed(updatingAllowed) {
      this.updatingAllowed = updatingAllowed;
    },
    isSaveInProgress: false,
    setIsSaveInProgress(isSaveInProgress) {
      this.isSaveInProgress = isSaveInProgress;
    },
    editFeatureData: [],
    setEditFeatureData(editFeatureData) {
      this.editFeatureData = editFeatureData;
    },
    shouldRender: {
      noData: false,
      noFeature: false,
      noLayerSchema: false
    },
    setShouldRender(shouldRender) {
      this.shouldRender = shouldRender;
    },
    setNoLayerSchema(noLayerSchema) {
      this.shouldRender = { ...this.shouldRender, noLayerSchema };
    },
    layerSchema: undefined,
    setLayerSchema(layerSchema) {
      this.layerSchema = layerSchema;
    },
    featureDescription: undefined,
    setFeatureDescription(featureDescription) {
      this.featureDescription = featureDescription;
    },
    formControls: [],
    setFormControls(formControls) {
      this.formControls = formControls;
    }
  }));
};
