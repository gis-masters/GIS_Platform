import { MapPosition } from '../../../src/app/services/map/map.models';
import { getFeaturesUrl } from '../../../src/app/services/map/map.util';
import { Page } from '../Page';

export class MapPage extends Page {
  selectors = {
    container: '.map'
  };
  title = 'Карта';
  url: string;

  constructor(projectId: number) {
    super();
    this.url = `projects/${projectId}/map`;
  }

  async openWithPositionToFeatures(
    projectId: number,
    dataset: string,
    table: string,
    featureIds: string[],
    position?: MapPosition
  ): Promise<void> {
    await browser.url(getFeaturesUrl(projectId, dataset, table, featureIds, position));
    await this.waitForVisible();
  }
}
