import {LayerAttribute} from './import.service';

// Править в соответствии с моделью ru/mycrg/gis/service/import_/ImportTask.java
export class TaskImport {
  // Наименование слоя из исходных данных
  layerName: string;

  // Таблица выбранная из рабочих данных
  workTableName: string;

  // Список обьектов маппинга. (Что во что должно смапится)
  mapping: MappingItem[] = [];

  srs: number;

  constructor(layerName: string, srs: string) {
    this.srs = Number(srs.split(':')[1]);
    this.layerName = layerName;
  }

  isPrepared(): boolean {
    if (!this.layerName || !this.workTableName || this.mapping.length < 1) {
      return false;
    }

    return true;
  }
}

export interface MappingItem {
  source: LayerAttribute;
  target: ColumnProjection;
}

export interface ColumnProjection {
  name: string;
  type: string;
}
