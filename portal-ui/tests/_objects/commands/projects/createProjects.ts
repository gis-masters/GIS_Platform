import { projectsService } from '../../../../src/app/services/gis/projects.service';

declare const window: {
  projectsService: typeof projectsService;
};

export async function createProjects(titles: string[]): Promise<void> {
  await browser.executeAsync(async (titles, callback) => {
    for (const title of titles) {
      await window.projectsService.create(title);
    }

    callback();
  }, titles);
}
