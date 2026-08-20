import type { Coordinate } from 'ol/coordinate';
import type TileLayer from 'ol/layer/Tile';
import Map, { type MapOptions } from 'ol/Map';
import type TileSource from 'ol/source/Tile';
import type Tile from 'ol/Tile';
import { getUid } from 'ol/util';

/** Меньше число — раньше в очереди OL. Сдвиг больше, чем вклад зума и расстояния. */
const BASEMAP_PRIORITY_OFFSET = 1_000_000_000;

/**
 * Одна TileQueue на карту: без приоритета тайлы НСПД и подложки на одном квадрате
 * конкурируют наравне. Подложка стартует первой.
 */
export class MapWithBasemapPriority extends Map {
  private readonly basemapLayer: TileLayer<TileSource>;

  constructor(options: MapOptions, basemapLayer: TileLayer<TileSource>) {
    super(options);
    this.basemapLayer = basemapLayer;
  }

  override getTilePriority(tile: Tile, tileSourceKey: string, tileCenter: Coordinate, tileResolution: number): number {
    const priority = super.getTilePriority(tile, tileSourceKey, tileCenter, tileResolution);
    const source = this.basemapLayer?.getSource();
    if (source && getUid(source) === tileSourceKey) {
      return priority - BASEMAP_PRIORITY_OFFSET;
    }

    return priority;
  }
}
