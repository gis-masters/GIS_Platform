import { projectsService } from '../../../../src/app/services/gis/projects.service';

declare const window: {
  projectsService: typeof projectsService;
};

export async function createProjects(titles: string[]): Promise<void> {
  await browser.executeAsync((titles, callback) => {
    titles.forEach(async title => {
      await window.projectsService.create(title);
    });

    callback();
  }, titles);
}
