import { Page } from '../Page';

class ProjectsPage extends Page {
  url = 'projects';

  get $container(): Promise<WebdriverIO.Element> {
    return $('.Projects');
  }
}

export const projectsPage = new ProjectsPage();
