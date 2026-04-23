import { Injectable } from '@angular/core';

import { allProjects } from '../../stores/AllProjects.store';
import { projectsService } from '../gis/projects/projects.service';
import { services } from '../services';

@Injectable({
  providedIn: 'root'
})
export class ProjectsGuardService {
  async canActivate(): Promise<boolean> {
    try {
      await projectsService.initAllProjectsStore();

      const defaultProject = allProjects.withoutFolders.find(project => project.default);
      void services.router.navigateByUrl(defaultProject ? `/projects/${defaultProject.id}/map` : '/projects');
    } catch {
      void services.router.navigateByUrl('/projects');
    }

    return false;
  }
}
