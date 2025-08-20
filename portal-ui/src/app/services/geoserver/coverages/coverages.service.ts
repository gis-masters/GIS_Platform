import { currentUser } from '../../../stores/CurrentUser.store';
import { replaceUrl } from '../../api/server-urls.service';
import { CrgLayer } from '../../gis/layers/layers.models';
import { GeoserverLayerInfo } from '../layers/geoserver-layer.models';
import { getLayerInfo } from '../layers/geoserver-layer.service';
import { coveragesClient } from './coverages.client';
import { CoverageTransparentColor, GeoserverCoverage } from './coverages.model';

export async function updateTransparentColor(
  coverageStore: string,
  coverage: string,
  transparentColor: string
): Promise<void> {
  const payload = {
    coverage: {
      parameters: {
        entry: [
          {
            string: ['InputTransparentColor', transparentColor]
          }
        ]
      }
    }
  };

  try {
    await coveragesClient.update(currentUser.workspaceName, coverageStore, coverage, payload);
  } catch {
    throw new Error('Не удалось обновить настройки слоя');
  }
}

export async function getTransparentColor(coverageStore: string, coverage: string): Promise<CoverageTransparentColor> {
  try {
    return await coveragesClient.getCoverage(currentUser.workspaceName, coverageStore, coverage);
  } catch {
    throw new Error('Не удалось получить настройки слоя');
  }
}

export async function recalculateBboxAndGetCoverage(layer: CrgLayer): Promise<GeoserverCoverage> {
  try {
    await coveragesClient.recalculateBbox(layer);

    const geoserverLayerInfo = await getLayerInfo(layer);
    const rasterCoverage = await getGeoserverLayerCoverage(geoserverLayerInfo);

    return rasterCoverage.coverage;
  } catch (error) {
    throw new Error(`Не удалось пересчитать bbox для слоя "${layer.title}": ${String(error)}`);
  }
}

function getGeoserverLayerCoverage(geoserverLayerInfo: GeoserverLayerInfo): Promise<{ coverage: GeoserverCoverage }> {
  const url = replaceUrl(geoserverLayerInfo.resource.href, true);

  return coveragesClient.getCoverageByUrl(url);
}
