import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { projectsService } from './crg/projects.service';
import { allProjects } from '../stores/AllProjects.store';
import { services } from './services';

@Injectable({
  providedIn: 'root'
})
export class ProjectsGuardService implements CanActivate {
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      await projectsService.initAllProjectsStore();

      const defaultProject = allProjects.list.find(project => project.default);
      if (defaultProject) {
        services.router.navigateByUrl(`/projects/${defaultProject.id}/map`);
        return false;
      } else {
        services.router.navigateByUrl('/projects');
        return false;
      }
    } catch (err) {
      services.router.navigateByUrl('/projects');
      return false;
    }
  }
}
