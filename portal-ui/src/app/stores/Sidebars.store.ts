import { action, makeObservable, observable, reaction } from 'mobx';

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
  layerSidebarOpen: true,
  infoOpen: false,
  photoLayerOpen: false,
  featuresSidebarOpen: false,
  bugReportOpen: false,
  editOpen: false,
  memorizedViewFeatures: undefined,
  deletedFeatures: undefined,
  editFeaturesData: undefined,
  featuresWithErrors: undefined,
  featuresEdited: false,
  featuresClosingConfirmationOpen: false,
  featuresClosingConfirmationCallback: undefined
};

class Sidebars {
  private static _instance: Sidebars;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable layerSidebarOpen?: boolean;

  // Панель уведомлений - справа, поверх остальных панелей
  @observable infoOpen?: boolean;

  // Режим фотослоя - по центру, поверх остальных панелей
  @observable photoLayerOpen: boolean = false;

  @observable featuresSidebarOpen?: boolean;
  @observable bugReportOpen?: boolean;
  @observable editOpen?: boolean;

  @observable memorizedViewFeatures?: WfsFeature[];
  @observable deletedFeatures?: FeatureError[];
  @observable featuresWithNoAccess?: FeatureError[];
  @observable deletedLayers?: FeatureError[];
  @observable layerOfEditedFeature?: CrgVectorableLayer;
  @observable editFeaturesData?: EditFeaturesData;
  @observable featuresWithErrors?: number;
  @observable foundBySearchFeatureEdited?: boolean;
  @observable selectedFeaturesEdited?: boolean;
  @observable featuresClosingConfirmationCallback?: () => void;
  @observable searchValue?: SearchInfo;
  @observable featuresEdited?: boolean;
  @observable featuresClosingConfirmationOpen = false;
  @observable featuresForPhotoMode: WfsFeature[] = [];

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
  openLayersSidebar() {
    this.layerSidebarOpen = true;
  }

  @action
  closeLayersSidebar() {
    this.layerSidebarOpen = false;
  }

  @action
  openPhotoModePreviewer(features: WfsFeature[]) {
    this.featuresForPhotoMode = features;

    this.photoLayerOpen = true;
  }

  @action.bound
  setSearchValue(searchValue: SearchInfo) {
    this.searchValue = searchValue;
  }

  @action.bound
  setLayerOfEditedFeature(layerOfEditedFeature: CrgVectorableLayer) {
    this.layerOfEditedFeature = layerOfEditedFeature;
  }

  @action.bound
  openSelectedFeaturesSidebar() {
    this.closeBugReport();
    this.closeEdit();

    if (mapStore.selectedFeatures.length > 0 && this.featuresSidebarOpen === false) {
      this.featuresSidebarOpen = true;
    }
  }

  openSearchSidebar() {
    this.closeBugReport();
    this.closeEdit();

    this.featuresSidebarOpen = true;
  }

  @action.bound
  closeFeaturesSidebar() {
    this.featuresSidebarOpen = false;
  }

  @action
  closeSidebars() {
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
  openEdit(data: EditFeaturesData) {
    this.editFeaturesData = data;
    this.closeBugReport();
    this.closeFeaturesSidebar();

    this.editOpen = true;
  }

  @action.bound
  closePhotoModePreviewer() {
    this.photoLayerOpen = false;
  }

  @action.bound
  closeEdit() {
    this.editOpen = false;
    this.featuresEdited = false;
    this.editFeaturesData = undefined;
  }

  @action.bound
  openBugReport() {
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
  private reset() {
    Object.assign(this, defaultValues);
  }
}

export const sidebars = Sidebars.instance;
