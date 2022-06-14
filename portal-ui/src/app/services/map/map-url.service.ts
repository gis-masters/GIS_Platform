import { currentProject } from '../../stores/CurrentProject.store';
import { Pages } from '../../app-routing.module';
import { route } from '../../stores/Route.store';
import { services } from '../services';
import { sleep } from '../util/sleep';

export async function setMapPositionToUrl(zoom: number, center: string): Promise<void> {
  await sleep(100);
  if (route.data.page === Pages.MAP) {
    await services.router.navigate([location.pathname], {
      queryParams: {
        zoom: Number(zoom).toFixed(2),
        center
      },
      queryParamsHandling: 'merge'
    });
  }
}

export async function setEnabledLayerToUrl(): Promise<void> {
  const currentPath = location.pathname;
  const layers = currentProject.visibleOnMapLayers
    .map(layer => {
      if (layer.payload.enabled === true) {
        return layer.id;
      }
    })
    .filter(id => id);

  if (layers) {
    await sleep(200);
    if (location.pathname !== currentPath || currentProject.id !== Number(route.paramMap.get('projectId'))) {
      return;
    }

    await services.provided;

    await services.ngZone.run(async () => {
      await services.router.navigate([location.pathname], {
        queryParams: {
          layers: layers.join(',')
        },
        queryParamsHandling: 'merge'
      });
    });
  }
}
