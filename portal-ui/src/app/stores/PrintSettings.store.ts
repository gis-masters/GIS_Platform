import { observable, computed, action, makeObservable } from 'mobx';
import { cloneDeep } from 'lodash';

import { StyleRule } from '../services/geoserver/styles.service';
import { CrgVectorLayer } from '../services/gis/projects.models';
import { currentProject } from './CurrentProject.store';

export interface StyleRuleExtended extends StyleRule {
  layerId: number;
  layerTitle: string;
}

interface PageFormat {
  id: string;
  name: string;
  width: number;
  height: number;
}

export type Orientation = 'p' | 'l';

export const orientations: { title: string; value: Orientation }[] = [
  { title: 'Ландшафтная', value: 'l' },
  { title: 'Портретная', value: 'p' }
];

export const resolutions = [72, 150, 300];

export const scales = [500_000, 200_000, 100_000, 50_000, 25_000, 10_000, 5000, 2000, 1000, 500];

export const pageFormats: PageFormat[] = [
  {
    id: 'a3',
    name: 'A3',
    width: 420,
    height: 297
  },
  {
    id: 'a4',
    name: 'A4',
    width: 297,
    height: 210
  },
  {
    id: 'a5',
    name: 'A5',
    width: 210,
    height: 148
  }
];

interface LegendOptions {
  enabled: boolean;
  auto: boolean;
  items: StyleRuleExtended[];
}

export interface PrintSettings {
  pageFormatId: string;
  resolution: number;
  scale: number;
  orientation: Orientation;
  printingInProcess: boolean;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  windRose: boolean;
  border: boolean;
  date: boolean;
  legend: LegendOptions;
  legendSize: number;
}

const defaultPrintSettings: PrintSettings = {
  pageFormatId: pageFormats[1].id,
  resolution: resolutions[1],
  scale: scales[7],
  orientation: 'l',
  printingInProcess: false,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  windRose: true,
  border: true,
  date: true,
  legendSize: 1,
  legend: {
    enabled: true,
    auto: true,
    items: []
  }
};

class PrintSettingsStore implements PrintSettings {
  @observable pageFormatId: string;
  @observable resolution: number;
  @observable scale: number;
  @observable orientation: Orientation = 'l';
  @observable printingInProcess: boolean;
  @observable printingResolution = 0;
  @observable margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  @observable windRose: boolean;
  @observable border: boolean;
  @observable date: boolean;
  @observable legend: LegendOptions;
  @observable legendSize: number;
  @observable rotation = 0;
  @observable allLegend: StyleRuleExtended[] = [];

  private static _instance: PrintSettingsStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);
    this.reset();
  }

  @computed
  get pageWidth(): number {
    const { width, height } = this.pageFormat;

    return this.orientation === 'l' ? width : height;
  }

  @computed
  get pageHeight(): number {
    const { width, height } = this.pageFormat;

    return this.orientation === 'l' ? height : width;
  }

  @computed
  get pageFormat(): PageFormat {
    return pageFormats.find(({ id }) => id === this.pageFormatId);
  }

  @computed
  get width(): number {
    return Math.round(((this.pageWidth - this.margin.left - this.margin.right) * this.printingResolution) / 25.4);
  }

  @computed
  get height(): number {
    return Math.round(((this.pageHeight - this.margin.top - this.margin.bottom) * this.printingResolution) / 25.4);
  }

  @computed
  get layers(): CrgVectorLayer[] {
    return currentProject.visibleLayersWithoutRasters.flatMap(({ payload }) => payload as CrgVectorLayer);
  }

  @action
  setValues(values: Partial<PrintSettings>) {
    Object.assign(this, values);
  }

  reset() {
    this.setValues(cloneDeep(defaultPrintSettings));
  }

  @action
  setPageFormatId(formatId: string) {
    this.pageFormatId = formatId;
  }

  @action
  setPrintingStatus(printingInProcess: boolean, printingResolution?: number) {
    this.printingInProcess = printingInProcess;
    this.printingResolution = printingResolution;
  }

  @action
  setRotation(angle: number) {
    this.rotation = angle;
  }

  @action
  setLegendItems(legend: StyleRuleExtended[]) {
    this.legend.items = legend;
  }

  @action
  setAllLegend(legend: StyleRuleExtended[]) {
    this.allLegend = legend;
  }
}

export const printSettings = PrintSettingsStore.instance;
