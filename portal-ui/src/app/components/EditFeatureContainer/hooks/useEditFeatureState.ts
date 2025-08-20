import { useLocalObservable } from 'mobx-react';

import { Schema } from '../../../services/data/schema/schema.models';
import { EditedField, OldSchema } from '../../../services/data/schema/schemaOld.models';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { CrgVectorableLayer, CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { ValidationResult } from '../../../services/util/FeaturePropertyValidatorsReact';

export interface ShouldRender {
  noData: boolean;
  noFeature: boolean;
  noLayerSchema: boolean;
}

export interface EditFeatureContainerFormControl {
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
  setMode: (mode: EditFeatureMode) => void;
  layer: CrgVectorableLayer | CrgVectorLayer | undefined;
  setLayer: (layer: CrgVectorableLayer | CrgVectorLayer | undefined) => void;
  isNew: boolean;
  setIsNew: (isNew: boolean) => void;
  features: WfsFeature[];
  setFeatures: (features: WfsFeature[]) => void;
  selectedTab: number;
  setSelectedTab: (selectedTab: number) => void;
  isGeometryChanged: boolean;
  setIsGeometryChanged: (isGeometryChanged: boolean) => void;
  updatingAllowed: boolean;
  setUpdatingAllowed: (updatingAllowed: boolean) => void;
  isGeometryAutoFixed: boolean;
  setIsGeometryAutoFixed: (isGeometryAutoFixed: boolean) => void;
  isSaveInProgress: boolean;
  setIsSaveInProgress: (isSaveInProgress: boolean) => void;
  editFeatureData: EditedField[];
  setEditFeatureData: (editFeatureData: EditedField[]) => void;
  shouldRender: ShouldRender;
  setShouldRender: (shouldRender: ShouldRender) => void;
  layerSchema: Schema | undefined;
  setLayerSchema: (layerSchema: Schema | undefined) => void;
  featureDescription: OldSchema | undefined;
  setFeatureDescription: (featureDescription: OldSchema | undefined) => void;
  formControls: EditFeatureContainerFormControl[];
  setFormControls: (formControls: EditFeatureContainerFormControl[]) => void;
}

export const useEditFeatureState = (): EditFeatureState => {
  return useLocalObservable(() => ({
    mode: EditFeatureMode.single,
    setMode(this: EditFeatureState, mode: EditFeatureMode): void {
      this.mode = mode;
    },
    layer: undefined,
    setLayer(this: EditFeatureState, layer: CrgVectorableLayer | CrgVectorLayer | undefined): void {
      this.layer = layer;
    },
    isNew: false,
    setIsNew(this: EditFeatureState, isNew: boolean): void {
      this.isNew = isNew;
    },
    features: [],
    setFeatures(this: EditFeatureState, features: WfsFeature[]): void {
      this.features = features;
    },
    selectedTab: 0,
    setSelectedTab(this: EditFeatureState, selectedTab: number): void {
      this.selectedTab = selectedTab;
    },
    isGeometryChanged: false,
    setIsGeometryChanged(this: EditFeatureState, isGeometryChanged: boolean): void {
      this.isGeometryChanged = isGeometryChanged;
    },
    isGeometryAutoFixed: false,
    setIsGeometryAutoFixed(this: EditFeatureState, isGeometryAutoFixed: boolean): void {
      this.isGeometryAutoFixed = isGeometryAutoFixed;
    },
    updatingAllowed: false,
    setUpdatingAllowed(this: EditFeatureState, updatingAllowed: boolean): void {
      this.updatingAllowed = updatingAllowed;
    },
    isSaveInProgress: false,
    setIsSaveInProgress(this: EditFeatureState, isSaveInProgress: boolean): void {
      this.isSaveInProgress = isSaveInProgress;
    },
    editFeatureData: [],
    setEditFeatureData(this: EditFeatureState, editFeatureData: EditedField[]): void {
      this.editFeatureData = editFeatureData;
    },
    shouldRender: {
      noData: false,
      noFeature: false,
      noLayerSchema: false
    },
    setShouldRender(this: EditFeatureState, shouldRender: ShouldRender): void {
      this.shouldRender = shouldRender;
    },
    layerSchema: undefined,
    setLayerSchema(this: EditFeatureState, layerSchema: Schema | undefined): void {
      this.layerSchema = layerSchema;
    },
    featureDescription: undefined,
    setFeatureDescription(this: EditFeatureState, featureDescription: OldSchema | undefined): void {
      this.featureDescription = featureDescription;
    },
    formControls: [],
    setFormControls(this: EditFeatureState, formControls: EditFeatureContainerFormControl[]): void {
      this.formControls = formControls;
    }
  }));
};
