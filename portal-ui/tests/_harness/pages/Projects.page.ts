import { Page } from '../classes/Page';

class ProjectsPage extends Page {
  title = 'Проекты';
  url = 'projects';

  selectors = {
    root: '.Projects'
  };
}

export const projectsPage = new ProjectsPage();
