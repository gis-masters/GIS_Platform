import { action, makeObservable, observable } from 'mobx';

export type GpkgImportStatus = 'running' | 'done' | 'warning' | 'error';

export type GpkgImportRecord = {
  id: string;
  fileId: string;
  tableName: string;
  payloadIndex: number;
  payloadIndexes: number[];
  features: number;
  tiles: number;
  layerGroupId?: number;
  toastVisible: boolean;
  status: GpkgImportStatus;
  error?: string;
};

type GpkgImportAddPayload = {
  fileId: string;
  tableName: string;
  payloadIndex: number;
  payloadIndexes?: number[];
  features: number;
  tiles: number;
  layerGroupId?: number;
  toastVisible?: boolean;
  status?: GpkgImportStatus;
  error?: string;
};

/** Импорт завершён: размещён частично (warning) или с ошибкой (error). */
export function isSettledStatus(status: GpkgImportStatus): boolean {
  return status === 'warning' || status === 'error';
}

class GpkgImportStore {
  private static _instance: GpkgImportStore;

  static get instance(): GpkgImportStore {
    return this._instance || (this._instance = new this());
  }

  @observable imports: GpkgImportRecord[] = [];
  @observable private fileToastIds: Record<string, string | number> = {};

  private nextId = 1;
  private placedLayerGroupIds = new Set<number>();

  private constructor() {
    makeObservable(this);
  }

  hasImports(fileId: string): boolean {
    return this.imports.some(item => item.fileId === fileId && item.status === 'running');
  }

  hasRunning(fileId: string, payloadIndex: number): boolean {
    return this.imports.some(item => {
      if (item.fileId !== fileId || item.status !== 'running') {
        return false;
      }

      const indexes = item.payloadIndexes.length > 0 ? item.payloadIndexes : [item.payloadIndex];

      return indexes.includes(payloadIndex);
    });
  }

  hasRunningInGroup(layerGroupId: number): boolean {
    return this.imports.some(item => item.layerGroupId === layerGroupId && item.status === 'running');
  }

  isGroupPlaced(layerGroupId: number): boolean {
    return this.placedLayerGroupIds.has(layerGroupId);
  }

  getFileToastId(fileId: string): string | number | undefined {
    return this.fileToastIds[fileId];
  }

  toastFileIds(): string[] {
    return Object.keys(this.fileToastIds);
  }

  getToastCohort(fileId: string): GpkgImportRecord[] {
    return this.imports.filter(item => item.fileId === fileId && (item.toastVisible || isSettledStatus(item.status)));
  }

  @action
  markGroupPlaced(layerGroupId: number): void {
    this.placedLayerGroupIds.add(layerGroupId);
  }

  @action
  add(payload: GpkgImportAddPayload): string {
    const id = String(this.nextId++);
    const { toastVisible = false, status = 'running', error, payloadIndexes, ...rest } = payload;
    this.imports.push({
      ...rest,
      id,
      payloadIndexes: payloadIndexes?.length ? payloadIndexes : [rest.payloadIndex],
      toastVisible,
      status,
      error
    });

    return id;
  }

  @action
  remove(id: string): void {
    this.imports = this.imports.filter(item => item.id !== id);
  }

  @action
  setStatus(id: string, status: GpkgImportStatus, error?: string): void {
    const item = this.find(id);
    if (item) {
      item.status = status;
      item.error = error;
    }
  }

  @action
  setToastVisible(fileId: string, value: boolean): void {
    this.imports.forEach(item => {
      if (item.fileId === fileId && item.status === 'running') {
        item.toastVisible = value;
      }
    });
  }

  @action
  setFileToastId(fileId: string, toastId: string | number): void {
    this.fileToastIds[fileId] = toastId;
  }

  @action
  clearFileToastId(fileId: string): void {
    delete this.fileToastIds[fileId];
  }

  @action
  clear(): void {
    this.imports = [];
    this.fileToastIds = {};
    this.nextId = 1;
    this.placedLayerGroupIds.clear();
  }

  private find(id: string): GpkgImportRecord | undefined {
    return this.imports.find(item => item.id === id);
  }
}

export const gpkgImportStore = GpkgImportStore.instance;
