import { projectsService } from '../../../src/app/services/gis/projects.service';
import { mapService } from '../../../src/app/services/map/map.service';

declare const window: {
  mapService: typeof mapService;
  projectsService: typeof projectsService;
};

export async function getLayerVisibility(layerName: string): Promise<boolean> {
  return browser.executeAsync(async (layerName, callback) => {
    const layer = window.mapService.map.getLayers();
    const array = layer.getArray();

    for (let i = array.length - 1; i !== 0; i--) {
      const properties = array[i].getProperties();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const layerComplexName = properties?.source?.params_?.LAYERS as string;

      const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 10 });

      const allLayers = await window.projectsService.getLayers(projects[0].id);
      const res = allLayers.find(l => l.complexName === layerComplexName);

      if (res?.title === layerName) {
        callback(array[i].getLayerState().visible);

        break;
      }
    }
  }, layerName);
}
