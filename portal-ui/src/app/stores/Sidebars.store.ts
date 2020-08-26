import { observable, action, reaction } from 'mobx';

import { CrgLayer } from '../services/crg/projects.models';
import { route } from './Route.store';
import { ViewFeaturesData } from '../components/view-features/view-features.component';

const defaultValues: Partial<{ [key in keyof Sidebars]: Sidebars[key] }> = {
  leftOpen: true,
  attributesOpen: false,
  layerForAttributes: null,
  featuresOpen: false,
  featuresData: null,
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
  @observable featuresData?: ViewFeaturesData;
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
  openFeatures(data: ViewFeaturesData) {
    if (this.needEditFeatureConfirmation(this.openFeatures.bind(this, data))) {
      return;
    }
    this.featuresOpen = true;
    this.featuresData = data;
    this.closeBugReport();
  }

  @action.bound
  closeFeatures() {
    if (this.needEditFeatureConfirmation(this.closeFeatures)) {
      return;
    }
    this.featuresOpen = false;
    this.featuresData = null;
    this.featuresEdited = false;
  }

  @action
  setFeaturesEdited(edited: boolean) {
    this.featuresEdited = edited;
  }

  @action.bound
  openBugReport() {
    if (this.needEditFeatureConfirmation(this.openBugReport)) {
      return;
    }
    this.bugReportOpen = true;
    this.closeFeatures();
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

  @action.bound
  closeEditFeatureConfirmation() {
    this.featuresClosingConfirmationOpen = false;
    this.featuresClosingConfirmationCallback = null;
  }

  @action
  needEditFeatureConfirmation(callback: () => void): boolean {
    if (this.featuresEdited && !this.featuresClosingConfirmationOpen) {
      this.featuresClosingConfirmationOpen = true;
      this.featuresClosingConfirmationCallback = () => {
        this.setFeaturesEdited(false);
        this.closeEditFeatureConfirmation();
        callback();
      };
      return true;
    } else {
      return false;
      this.closeEditFeatureConfirmation();
    }
  }

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }
}

export const sidebars = Sidebars.instance;
