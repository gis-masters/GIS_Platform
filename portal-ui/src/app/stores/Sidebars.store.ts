import { observable, action, reaction } from 'mobx';

import { route } from './Route.store';
import { CrgLayer } from '../services/crg/projects.models';
import { WfsFeature } from '../services/geoserver/wfs.models';
import { Properties } from '../components/edit-feature/edit-feature.component';
import { FeatureError } from '../services/map/map-link-following.service';

export enum MapSelectionTypes {
  ADD,
  REMOVE,
  REPLACE
}

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

export interface EditFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
  viewFeatures?: WfsFeature[];
  layer?: CrgLayer;
  properties?: Properties;
  isNew?: boolean;
}

const defaultValues: Partial<Sidebars> = {
  leftOpen: true,
  attributesOpen: false,
  layerForAttributes: null,
  featuresOpen: false,
  viewFeatures: null,
  memorizedViewFeatures: null,
  deletedFeatures: null,
  editFeaturesData: null,
  featuresWithErrors: null,
  editOpen: false,
  featuresEdited: false,
  featuresClosingConfirmationOpen: false,
  featuresClosingConfirmationCallback: null,
  bugReportOpen: false,
  infoOpen: false,
  isFeaturesLimitReached: false
};

class Sidebars {
  private static _instance: Sidebars;

  @observable leftOpen: boolean;
  @observable attributesOpen: boolean;
  @observable layerForAttributes?: CrgLayer;
  @observable featuresOpen: boolean;
  @observable editOpen: boolean;
  @observable viewFeatures?: WfsFeature[];
  @observable memorizedViewFeatures?: WfsFeature[];
  @observable deletedFeatures?: FeatureError[];
  @observable featuresWithNoAccess?: FeatureError[];
  @observable deletedLayers?: FeatureError[];
  @observable editFeaturesData?: EditFeaturesData;
  @observable featuresWithErrors?: number;
  @observable featuresEdited: boolean;
  @observable featuresClosingConfirmationOpen: boolean;
  @observable featuresClosingConfirmationCallback?: () => void;
  @observable bugReportOpen: boolean;
  @observable infoOpen: boolean;
  @observable isFeaturesLimitReached?: boolean;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.reset();

    reaction(
      () => route.data && route.data.page,
      page => {
        if (page !== 'map') {
          this.reset();
        }
      }
    );
  }

  @action
  openLeft() {
    this.leftOpen = true;
  }

  @action
  closeLeft() {
    this.leftOpen = false;
  }

  @action
  openAttributes(layer: CrgLayer) {
    this.attributesOpen = true;
    this.layerForAttributes = layer;
  }

  @action
  closeAttributes() {
    this.attributesOpen = false;
    this.layerForAttributes = null;
  }

  @action
  openFeatures(features: WfsFeature[], selectionType?: MapSelectionTypes) {
    // eslint-disable-next-line unicorn/prefer-prototype-methods
    if (this.needEditConfirmation(this.openFeatures.bind(this, features))) {
      return;
    }
    this.closeBugReport();
    this.closeEdit();
    this.featuresOpen = true;

    if (this.viewFeatures) {
      if (selectionType === MapSelectionTypes.REPLACE) {
        this.viewFeatures = features;
      } else {
        features.forEach(feature => {
          const index = this.viewFeatures.findIndex(element => {
            return element.id === feature.id;
          });

          if (selectionType === MapSelectionTypes.REMOVE && index !== -1) {
            this.viewFeatures.splice(index, 1);
          }

          if (selectionType === MapSelectionTypes.ADD && index === -1) {
            this.viewFeatures.push(feature);
          }
        });
      }
    } else if (selectionType !== MapSelectionTypes.REMOVE) {
      this.viewFeatures = features;
    }

    if (
      !this.featuresWithErrors &&
      this.viewFeatures.length === 1 &&
      features.length === 1 &&
      (selectionType === MapSelectionTypes.REPLACE || selectionType === MapSelectionTypes.ADD)
    ) {
      this.openEdit({
        features: features,
        mode: EditFeatureMode.single
      });
    }

    if ((!this.viewFeatures || this.viewFeatures.length === 0) && !this.featuresWithErrors) {
      this.closeFeatures();
      this.closeEdit();
    }
  }

  @action.bound
  closeFeatures() {
    this.featuresOpen = false;
    this.viewFeatures = null;
  }

  @action.bound
  openFeaturesWithError() {
    this.featuresOpen = true;
  }

  @action
  closeSidebar() {
    this.closeFeatures();
    this.closeEdit();
  }

  @action
  setSingleFeature(feature: WfsFeature) {
    this.viewFeatures = [feature];
  }

  @action
  setMemorizedFeatures(features: WfsFeature[]) {
    this.memorizedViewFeatures = features;
  }

  @action
  setFeaturesLimit(reached: boolean) {
    this.isFeaturesLimitReached = reached;
  }

  @action
  openEdit(data: EditFeaturesData) {
    // eslint-disable-next-line unicorn/prefer-prototype-methods
    if (this.needEditConfirmation(this.openEdit.bind(this, data))) {
      return;
    }
    this.editFeaturesData = data;
    this.closeBugReport();
    this.editOpen = true;
    this.closeFeatures();
    this.viewFeatures = data.features;
  }

  @action.bound
  closeEdit() {
    if (this.needEditConfirmation(this.closeEdit)) {
      return;
    }
    this.editOpen = false;
    this.featuresEdited = false;
    this.editFeaturesData = null;
  }

  @action.bound
  openBugReport() {
    if (this.needEditConfirmation(this.openBugReport)) {
      return;
    }
    this.bugReportOpen = true;
    this.closeFeatures();
    this.closeEdit();
  }

  @action
  closeBugReport() {
    this.bugReportOpen = false;
  }

  @action.bound
  openInfo() {
    this.infoOpen = true;
  }

  @action
  closeInfo() {
    this.infoOpen = false;
  }

  @action
  setFeaturesEdited(edited: boolean) {
    this.featuresEdited = edited;
  }

  @action
  setFeaturesWithErrors(features: number): void {
    this.featuresWithErrors = features;
  }

  @action
  setDeletedFeatures(features: FeatureError[]): void {
    this.deletedFeatures = features;
  }

  @action
  setNoAccessFeatures(features: FeatureError[]): void {
    this.featuresWithNoAccess = features;
  }

  @action
  setDeletedLayers(features: FeatureError[]): void {
    this.deletedLayers = features;
  }

  @action
  clearFeaturesWithError(): void {
    this.deletedLayers = [];
    this.deletedFeatures = [];
    this.featuresWithNoAccess = [];
  }

  @action.bound
  closeEditFeatureConfirmation() {
    this.featuresClosingConfirmationOpen = false;
    this.featuresClosingConfirmationCallback = null;
  }

  @action
  private needEditConfirmation(callback: () => void): boolean {
    if (this.featuresEdited && !this.featuresClosingConfirmationOpen) {
      this.featuresClosingConfirmationOpen = true;
      this.featuresClosingConfirmationCallback = () => {
        this.setFeaturesEdited(false);
        this.closeEditFeatureConfirmation();
        callback();
      };

      return true;
    }

    this.closeEditFeatureConfirmation();

    return false;
  }

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }
}

export const sidebars = Sidebars.instance;
