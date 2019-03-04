import {LayerAttribute} from './import.service';
import {ColumnProjection} from '../../gis/gis-db.service';

export class TaskImport {
  // Наименование слоя из исходных данных
  layerName: string;

  // Таблица выбранная из рабочих данных
  workTableName: string;

  // Список обьектов маппинга. (Что во что должно смапится)
  mapping: MappingItem[] = [];

  constructor(layerName: string) {
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
