import { observable, computed, action } from 'mobx';

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

export const scales = [500000, 200000, 100000, 50000, 25000, 10000, 5000, 2000, 1000, 500];

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
  date: true
};

class PrintSettingsStore implements PrintSettings {
  @observable pageFormatId: string;
  @observable resolution: number;
  @observable scale: number;
  @observable orientation: Orientation = 'l';
  @observable printingInProcess: boolean;
  @observable margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  @observable windRose: boolean;
  @observable border: boolean;
  @observable date: boolean;
  @observable rotation = 0;

  private static _instance: PrintSettingsStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @computed
  get pageWidth(): number {
    const { width, height } = this.pageFormat;

    if (this.orientation === 'l') {
      return width;
    } else {
      return height;
    }
  }

  private constructor() {
    this.setValues(defaultPrintSettings);
  }

  @action
  setValues(values: Partial<PrintSettings>) {
    Object.assign(this, values);
  }

  @computed
  get pageHeight(): number {
    const { width, height } = this.pageFormat;

    if (this.orientation === 'l') {
      return height;
    } else {
      return width;
    }
  }

  @computed
  get pageFormat(): PageFormat {
    return pageFormats.find(({ id }) => id === this.pageFormatId);
  }

  @action
  setPageFormatId(formatId: string) {
    this.pageFormatId = formatId;
  }

  @action
  setPrintingStatus(printingInProcess: boolean) {
    this.printingInProcess = printingInProcess;
  }

  @action
  setRotation(angle: number) {
    this.rotation = angle;
  }
}

export const printSettings = PrintSettingsStore.instance;
