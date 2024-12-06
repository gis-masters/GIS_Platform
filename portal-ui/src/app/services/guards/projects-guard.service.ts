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

      const defaultProject = allProjects.list.find(project => project.default);
      if (defaultProject) {
        void services.router.navigateByUrl(`/projects/${defaultProject.id}/map`);

        return false;
      }
      void services.router.navigateByUrl('/projects');

      return false;
    } catch {
      void services.router.navigateByUrl('/projects');

      return false;
    }
  }
}
