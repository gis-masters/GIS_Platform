import { observable, action, reaction, makeObservable } from 'mobx';

import { mapStore } from './Map.store';
import { route, Pages } from './Route.store';
import { WfsFeature } from '../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../services/gis/projects/projects.models';
import { FeatureError } from '../services/map/map-link-following.service';
import { Properties } from '../components/edit-feature/edit-feature.component';

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

export interface EditFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
  viewFeatures?: WfsFeature[];
  layer?: CrgVectorLayer;
  properties?: Properties;
  isNew?: boolean;
}

const defaultValues: Partial<Sidebars> = {
  leftOpen: true,
  featuresSidebarOpen: false,
  memorizedViewFeatures: null,
  deletedFeatures: null,
  editFeaturesData: null,
  featuresWithErrors: null,
  editOpen: false,
  featuresEdited: false,
  featuresClosingConfirmationOpen: false,
  featuresClosingConfirmationCallback: null,
  bugReportOpen: false,
  infoOpen: false
};

class Sidebars {
  private static _instance: Sidebars;

  @observable leftOpen: boolean;
  @observable featuresSidebarOpen: boolean;
  @observable editOpen: boolean;
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

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);
    this.reset();

    reaction(
      () => route.data && route.data.page,
      page => {
        if (page !== Pages.MAP) {
          this.reset();
        }
      }
    );
  }

  @action
  openLeftSidebar() {
    this.leftOpen = true;
  }

  @action
  closeLeftSidebar() {
    this.leftOpen = false;
  }

  @action.bound
  openFeaturesSidebar() {
    if (this.needEditConfirmation(this.openFeaturesSidebar.bind(this))) {
      return;
    }
    this.closeBugReport();
    this.closeEdit();
    this.featuresSidebarOpen = true;

    if (!this.featuresWithErrors && mapStore.selectedFeatures.length === 1) {
      this.closeFeaturesSidebar();
      this.openEdit({
        features: mapStore.selectedFeatures,
        mode: EditFeatureMode.single
      });
    }

    if (
      mapStore.selectedFeatures.length === 0 &&
      !this.featuresWithErrors &&
      !this.deletedFeatures.length &&
      !this.featuresWithNoAccess.length &&
      !this.deletedLayers.length
    ) {
      this.closeFeaturesSidebar();
      this.closeEdit();
    }
  }

  @action.bound
  closeFeaturesSidebar() {
    this.featuresSidebarOpen = false;
  }

  @action
  closeSidebar() {
    this.closeFeaturesSidebar();
    this.closeEdit();
  }

  @action
  setMemorizedFeatures(features: WfsFeature[]) {
    this.memorizedViewFeatures = features;
  }

  @action
  openEdit(data: EditFeaturesData) {
    if (this.needEditConfirmation(this.openEdit.bind(this, data))) {
      return;
    }
    this.editFeaturesData = data;
    this.closeBugReport();
    this.editOpen = true;
    this.closeFeaturesSidebar();
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
    this.closeFeaturesSidebar();
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
  needEditConfirmation(callback: () => void): boolean {
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
