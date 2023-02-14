import { Given, When } from '@wdio/cucumber-framework';

import { projectsService } from '../../../src/app/services/gis/projects.service';

declare const window: {
  projectsService: typeof projectsService;
};

async function getFirstProjectId(): Promise<number> {
  return await browser.executeAsync(async callback => {
    const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 10 });

    callback(projects[0].id);
  });
}

export async function goToFirstProjectMap(): Promise<void> {
  const projectId = await getFirstProjectId();

  await browser.url(`projects/${projectId}/map`);
}

Given(/^я перешел на страницу карты первого проекта$/, async () => {
  await goToFirstProjectMap();
});

When(/^я перехожу на страницу карты проекта$/, async () => {
  await goToFirstProjectMap();
});
