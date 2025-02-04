import { Page } from '../Page';

class ProjectsPage extends Page {
  title = 'Проекты';
  url = 'projects';

  selectors = {
    container: '.Projects'
  };
}

export const projectsPage = new ProjectsPage();
