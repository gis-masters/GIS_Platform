import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { currentProject } from '../stores/CurrentProject.store';
import { projectsService } from './crg/projects.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowGuardService implements CanActivate {
  constructor(private logger: NGXLogger, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      const id = route.params && route.params.projectId;
      await projectsService.fetchCurrent(id && Number(id));

      if (currentProject.id) {
        return true;
      } else {
        this.router.navigateByUrl('/projects');

        return false;
      }
    } catch (err) {
      this.router.navigateByUrl('/projects');
      this.logger.warn('Wrong workflow: empty project', err);

      return false;
    }
  }
}
