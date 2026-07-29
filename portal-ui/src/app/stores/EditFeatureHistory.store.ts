import { action, computed, makeObservable, observable } from 'mobx';
import { cloneDeep, isEqual } from 'lodash';

import { type WfsGeometry } from '../services/geoserver/wfs/wfs.models';

export interface HistoryEntry {
  id: number;
  timestamp: number;
  geometry: WfsGeometry;
  description: string;
}

class EditFeatureHistoryStore {
  private static _instance: EditFeatureHistoryStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private CAPACITY: number = 100;
  private nextId: number = 1;

  @observable private history: HistoryEntry[] = [];
  @observable private currentIndex: number = -1;

  constructor() {
    makeObservable(this);
  }

  @computed
  get canUndo(): boolean {
    return this.currentIndex > 0;
  }

  @computed
  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  @computed
  get historyLength(): number {
    return this.history.length;
  }

  @action
  add(geometry: WfsGeometry, description: string): void {
    if (this.isDuplicate(geometry)) {
      return;
    }

    const entry: HistoryEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      geometry: cloneDeep(geometry),
      description
    };

    // Удаляем все записи после текущего индекса (если мы находимся не в конце истории)
    if (this.currentIndex < this.history.length - 1) {
      this.history.splice(this.currentIndex + 1);
    }

    // Добавляем новую запись
    this.history.push(entry);
    this.currentIndex = this.history.length - 1;

    // Ограничиваем размер истории
    if (this.history.length > this.CAPACITY) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  @action
  undo(): WfsGeometry | null {
    if (!this.canUndo) {
      return null;
    }

    this.currentIndex--;

    return cloneDeep(this.history[this.currentIndex].geometry);
  }

  @action
  redo(): WfsGeometry | null {
    if (!this.canRedo) {
      return null;
    }

    this.currentIndex++;

    return cloneDeep(this.history[this.currentIndex].geometry);
  }

  @action
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.nextId = 1;
  }

  /**
   * Получить исходную геометрию (первую запись в истории)
   */
  getOriginalGeometry(): WfsGeometry | null {
    if (this.history.length > 0) {
      return cloneDeep(this.history[0].geometry);
    }

    return null;
  }

  private generateId(): number {
    return this.nextId++;
  }

  private isDuplicate(geometry: WfsGeometry): boolean {
    if (this.history.length === 0) {
      return false;
    }

    // Сравниваем с последней записью в истории
    const lastEntry = this.history.at(-1);
    if (!lastEntry) {
      return false;
    }

    return isEqual(geometry, lastEntry.geometry);
  }
}

export const editFeatureHistoryStore = EditFeatureHistoryStore.instance;
