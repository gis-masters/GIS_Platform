import { mockOauthToken } from '../../tests/ui/_mock/oauthToken';
import { mockOrganizationSettings } from '../../tests/ui/_mock/organizationSettings';
import { mockProjects } from '../../tests/ui/_mock/projects';
import { mockUsersCurrent } from '../../tests/ui/_mock/usersCurrent';
import { LoginForm } from '../blocks/LoginForm/LoginForm';
import { HomePage } from '../pages/Home.page';
import { ProjectsPage } from '../pages/Projects.page';

export async function login(browser: WebdriverIO.Browser): Promise<void> {
  const homePage = new HomePage(browser);

  await homePage.open();
  await homePage.waitForVisible();

  await mockOauthToken(browser);
  await mockUsersCurrent(browser);
  await mockProjects(browser);
  await mockOrganizationSettings(browser);

  const loginForm = new LoginForm(browser);
  await loginForm.login('hermione@test', 'Avadakedavra1');
  const projectsPage = new ProjectsPage(browser);
  await projectsPage.waitForVisible();
}
