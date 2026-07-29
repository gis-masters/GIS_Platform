import { action, makeObservable, observable, reaction } from 'mobx';

import { type SearchInfo } from '../components/SearchField/SearchField';
import { type WfsFeature } from '../services/geoserver/wfs/wfs.models';
import { type CrgExternalLayer, type CrgVectorableLayer } from '../services/gis/layers/layers.models';
import { type FeatureError } from '../services/map/map-link-following.service';
import { services } from '../services/services';
import { Pages, route } from './Route.store';
import { selectedFeaturesStore } from './SelectedFeatures.store';

const defaultValues: Partial<Sidebars> = {
  layerSidebarOpen: true,
  infoOpen: false,
  photoLayerOpen: false,
  selectedFeaturesSidebarOpen: false,
  bugReportOpen: false,
  editFeatureOpen: false,
  deletedFeatures: undefined,
  featuresWithErrors: undefined
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

  @observable bugReportOpen?: boolean;
  @observable editFeatureOpen?: boolean;
  @observable selectedFeaturesSidebarOpen?: boolean;

  @observable deletedFeatures?: FeatureError[];
  @observable featuresWithNoAccess?: FeatureError[];
  @observable deletedLayers?: FeatureError[];
  @observable layerOfEditedFeature?: CrgVectorableLayer | CrgExternalLayer;
  @observable featuresWithErrors?: number;
  @observable foundBySearchFeatureEdited?: boolean;
  @observable selectedFeaturesEdited?: boolean;
  @observable searchValue?: SearchInfo;

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
  closePhotoModePreviewer() {
    this.photoLayerOpen = false;
  }

  @action.bound
  setSearchValue(searchValue: SearchInfo) {
    this.searchValue = searchValue;
  }

  @action.bound
  setLayerOfEditedFeature(layerOfEditedFeature: CrgVectorableLayer | CrgExternalLayer) {
    this.layerOfEditedFeature = layerOfEditedFeature;
  }

  @action.bound
  openSelectedFeaturesSidebar() {
    if (selectedFeaturesStore.features.length > 0 && this.selectedFeaturesSidebarOpen === false) {
      this.selectedFeaturesSidebarOpen = true;
    }
  }

  @action.bound
  closeSelectedFeaturesSidebar() {
    this.selectedFeaturesSidebarOpen = false;
  }

  @action.bound
  openSearchSidebar() {
    this.selectedFeaturesSidebarOpen = true;
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
  openEdit() {
    this.editFeatureOpen = true;
  }

  // TODO: Свести к режимам
  @action.bound
  closeEdit(reason?: string) {
    services.logger.trace('closeEdit', reason);
    selectedFeaturesStore.clearActiveFeature();

    this.editFeatureOpen = false;
  }

  @action.bound
  openBugReport() {
    this.bugReportOpen = true;
    this.closeSelectedFeaturesSidebar();
    this.closeEdit('openBugReport');
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

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }
}

export const sidebars = Sidebars.instance;
