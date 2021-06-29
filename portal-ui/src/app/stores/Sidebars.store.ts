import { observable, action, reaction } from 'mobx';

import { route } from './Route.store';
import { CrgLayer } from '../services/crg/projects.models';
import { WfsFeature } from '../services/geoserver/wfs.models';
import { EditFeatureMode, Properties } from '../components/edit-feature/edit-feature.component';

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
  editFeaturesData: null,
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
  @observable attributesOpen: boolean;
  @observable layerForAttributes?: CrgLayer;
  @observable featuresOpen: boolean;
  @observable editOpen: boolean;
  @observable viewFeatures?: WfsFeature[];
  @observable editFeaturesData?: EditFeaturesData;
  @observable featuresEdited: boolean;
  @observable featuresClosingConfirmationOpen: boolean;
  @observable featuresClosingConfirmationCallback?: () => void;
  @observable bugReportOpen: boolean;
  @observable infoOpen: boolean;

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
  openFeatures(features: WfsFeature[]) {
    // eslint-disable-next-line unicorn/prefer-prototype-methods
    if (this.needEditConfirmation(this.openFeatures.bind(this, features))) {
      return;
    }
    this.closeBugReport();
    this.closeEdit();
    this.featuresOpen = true;
    this.viewFeatures = features;
  }

  @action.bound
  closeFeatures() {
    this.featuresOpen = false;
    this.viewFeatures = null;
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
