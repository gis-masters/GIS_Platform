import { Page } from '../Page';

export class MapPage extends Page {
  selectors = {
    container: '.map'
  };
  title = 'Карта';
  url: string;

  constructor(projectId: number) {
    super(true);
    this.url = `projects/${projectId}/map`;
  }
}
