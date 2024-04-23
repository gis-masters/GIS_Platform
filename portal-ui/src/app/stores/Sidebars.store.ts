import { action, makeObservable, observable, reaction } from 'mobx';
import { boundMethod } from 'autobind-decorator';

import { Properties } from '../components/edit-feature/edit-feature.component';
import { SearchInfo } from '../components/SearchField/SearchField';
import { WfsFeature } from '../services/geoserver/wfs/wfs.models';
import { CrgVectorableLayer } from '../services/gis/layers/layers.models';
import { FeatureError } from '../services/map/map-link-following.service';
import { mapStore } from './Map.store';
import { Pages, route } from './Route.store';

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

export interface EditFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
  viewFeatures?: WfsFeature[];
  layer?: CrgVectorableLayer;
  properties?: Properties;
  isNew?: boolean;
}

const defaultValues: Partial<Sidebars> = {
  leftOpen: true,
  featuresSidebarOpen: false,
  memorizedViewFeatures: undefined,
  deletedFeatures: undefined,
  editFeaturesData: undefined,
  featuresWithErrors: undefined,
  editOpen: false,
  featuresEdited: false,
  featuresClosingConfirmationOpen: false,
  featuresClosingConfirmationCallback: undefined,
  bugReportOpen: false,
  infoOpen: false,
  photoLayerOpen: false
};

class Sidebars {
  @observable leftOpen?: boolean;
  @observable featuresSidebarOpen?: boolean;
  @observable editOpen?: boolean;
  @observable memorizedViewFeatures?: WfsFeature[];
  @observable deletedFeatures?: FeatureError[];
  @observable featuresWithNoAccess?: FeatureError[];
  @observable deletedLayers?: FeatureError[];
  @observable editFeaturesData?: EditFeaturesData;
  @observable featuresWithErrors?: number;
  @observable foundBySearchFeatureEdited?: boolean;
  @observable selectedFeaturesEdited?: boolean;
  @observable featuresClosingConfirmationCallback?: () => void;
  @observable searchValue?: SearchInfo;
  @observable featuresEdited?: boolean;
  @observable featuresClosingConfirmationOpen?: boolean;
  @observable bugReportOpen?: boolean;
  @observable infoOpen?: boolean;
  @observable photoLayerOpen: boolean = false;
  @observable featuresForPhotoMode: WfsFeature[] = [];

  private static _instance: Sidebars;

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

  openPhotoLayers(features: WfsFeature[]) {
    this.openPhotoModePreviewer(features);
    this.openSelectedFeaturesSidebar();
  }

  @action.bound
  setSearchValue(searchValue: SearchInfo) {
    this.searchValue = searchValue;
  }

  @action.bound
  openFeaturesSidebar() {
    this.closeBugReport();
    this.closeEdit();
    if (!this.photoLayerOpen) {
      this.featuresSidebarOpen = true;
    }
  }

  @boundMethod
  openSelectedFeaturesSidebar() {
    if (this.needEditConfirmation(this.openSelectedFeaturesSidebar.bind(this))) {
      return;
    }
    this.openFeaturesSidebar();
    if (this.needEditConfirmation(this.openFeaturesSidebar.bind(this))) {
      return;
    }

    this.closeBugReport();
    this.closeEdit();

    if (!this.featuresWithErrors && mapStore.selectedFeatures.length === 1 && !this.photoLayerOpen) {
      this.closeFeaturesSidebar();
      this.openEdit({
        features: mapStore.selectedFeatures,
        mode: EditFeatureMode.single
      });
    }

    if (
      mapStore.selectedFeatures.length === 0 &&
      !this.featuresWithErrors &&
      !this.deletedFeatures?.length &&
      !this.featuresWithNoAccess?.length &&
      !this.deletedLayers?.length
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
  setFoundBySearchFeatureEdited(foundBySearchFeatureEdited: boolean) {
    this.foundBySearchFeatureEdited = foundBySearchFeatureEdited;
  }

  @action
  setSelectedFeaturesEdited(selectedFeaturesEdited: boolean) {
    this.selectedFeaturesEdited = selectedFeaturesEdited;
  }

  @action
  setMemorizedFeatures(features: WfsFeature[]) {
    this.memorizedViewFeatures = features;
  }

  @action
  openPhotoModePreviewer(features: WfsFeature[]) {
    this.featuresForPhotoMode = features;

    this.photoLayerOpen = true;
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
  closePhotoModePreviewer() {
    this.photoLayerOpen = false;
  }

  @action.bound
  closeEdit() {
    if (this.needEditConfirmation(this.closeEdit)) {
      return;
    }
    this.editOpen = false;
    this.featuresEdited = false;
    this.editFeaturesData = undefined;
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
    this.featuresClosingConfirmationCallback = undefined;
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
