import { type Map } from 'ol';
import { type Tile as TileLayer } from 'ol/layer';

/**
 * Ожидает загрузки всех тайлов карты
 * (адаптирована из map-print.service.ts)
 */
export function waitForTilesLoad(map: Map): Promise<void> {
  return new Promise(resolve => {
    const layers = map.getLayers().getArray();
    let pendingTiles = 0;
    let resolved = false;

    const checkResolution = () => {
      if (pendingTiles === 0 && !resolved) {
        resolved = true;
        resolve();
      }
    };

    layers.forEach(layer => {
      const tileLayer = layer as unknown as TileLayer<import('ol/source/Tile').default>;

      if ('getSource' in tileLayer) {
        const source = tileLayer.getSource();

        if (source && 'on' in source) {
          source.on('tileloadstart', () => {
            pendingTiles++;
          });

          source.on('tileloadend', () => {
            pendingTiles--;
            checkResolution();
          });

          source.on('tileloaderror', () => {
            pendingTiles--;
            checkResolution();
          });
        }
      }
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, 1000); // 1 секунда для загрузки тайлов (компромисс между качеством и скоростью)
  });
}
