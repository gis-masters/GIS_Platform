import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { ProjectsService } from './crg/projects.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowGuardService implements CanActivate {
  constructor(private logger: NGXLogger,
              private projectsService: ProjectsService,
              private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      const project = await this.projectsService.getCurrent(route);
      if (project) {
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
