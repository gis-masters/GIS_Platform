import { Page } from '../Page';
import { getFeaturesUrl } from '../../../src/app/services/map/map.util';

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
    featureIds: string[]
  ): Promise<void> {
    await browser.url(getFeaturesUrl(projectId, dataset, table, featureIds));
    await this.waitForVisible();
  }
}
