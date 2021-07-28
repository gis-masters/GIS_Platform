import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { projectsService } from './crg/projects.service';
import { allProjects } from '../stores/AllProjects.store';
import { services } from './services';

@Injectable({
  providedIn: 'root'
})
export class ProjectsGuardService implements CanActivate {
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
