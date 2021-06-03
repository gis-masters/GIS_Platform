import { observable, computed, action } from 'mobx';

interface PageFormat {
  id: string;
  name: string;
  width: number;
  height: number;
}

export type Orientation = 'p' | 'l';

export const resolutions = [72, 150, 300];

export const scales = [500000, 200000, 100000, 50000, 25000, 10000, 5000, 2000, 1000, 500];

export const pageFormats: PageFormat[] = [
  // {
  //   id: 'a0',
  //   name: 'A0',
  //   width: 1189,
  //   height: 841
  // },
  // {
  //   id: 'a1',
  //   name: 'A1',
  //   width: 841,
  //   height: 594
  // },
  // {
  //   id: 'a2',
  //   name: 'A2',
  //   width: 594,
  //   height: 420
  // },
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
  pageFormat: PageFormat;
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
}

const defaultPrintSettings: PrintSettings = {
  pageFormat: pageFormats[1],
  resolution: resolutions[1],
  scale: scales[7],
  orientation: 'l',
  printingInProcess: false,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

class PrintSettingsStore implements PrintSettings {
  @observable pageFormat: PageFormat;
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
    Object.assign(this, defaultPrintSettings);
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

  @action
  setPageFormat(formatId: string) {
    this.pageFormat = pageFormats.find(({ id }) => id === formatId);
  }

  @action
  setPrintingStatus(printingInProcess: boolean) {
    this.printingInProcess = printingInProcess;
  }
}

export const printSettings = PrintSettingsStore.instance;
