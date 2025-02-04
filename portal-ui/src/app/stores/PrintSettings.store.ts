import { action, computed, makeObservable, observable } from 'mobx';
import { cloneDeep } from 'lodash';

import { StyleRuleExtended } from '../services/geoserver/styles/styles.models';
import { CrgVectorLayer } from '../services/gis/layers/layers.models';
import { currentProject } from './CurrentProject.store';

export interface PrintFormat {
  id: string;
  name?: string;
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

export const pageFormats: PrintFormat[] = [
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
  },
  {
    id: 'square',
    width: 220,
    height: 220
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
  showSystemLayers: { draft: boolean; measure: boolean };
}

export const defaultPrintSettings: PrintSettings = {
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
  },
  showSystemLayers: { draft: false, measure: true }
};

class PrintSettingsStore implements PrintSettings {
  private static _instance: PrintSettingsStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable pageFormatId: string = defaultPrintSettings.pageFormatId;
  @observable resolution: number = defaultPrintSettings.resolution;
  @observable scale: number = defaultPrintSettings.scale;
  @observable orientation: Orientation = defaultPrintSettings.orientation;
  @observable printingInProcess: boolean = defaultPrintSettings.printingInProcess;
  @observable printingResolution = 0;
  @observable margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = defaultPrintSettings.margin;
  @observable windRose: boolean = defaultPrintSettings.windRose;
  @observable border: boolean = defaultPrintSettings.border;
  @observable date: boolean = defaultPrintSettings.date;
  @observable legend: LegendOptions = defaultPrintSettings.legend;
  @observable legendSize: number = defaultPrintSettings.legendSize;
  @observable showSystemLayers: { draft: boolean; measure: boolean } = defaultPrintSettings.showSystemLayers;
  @observable rotation = 0;
  @observable allLegend: StyleRuleExtended[] = [];

  private constructor() {
    makeObservable(this);
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
  get pageFormat(): PrintFormat {
    const format = pageFormats.find(({ id }) => id === this.pageFormatId);

    if (!format) {
      throw new Error(`Неизвестный формат страницы: ${this.pageFormatId}`);
    }

    return format;
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
    return currentProject.visibleVectorLayers.flatMap(({ payload }) => payload as CrgVectorLayer);
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
  setPrintingStatus(printingInProcess: boolean, printingResolution = 0) {
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
