import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AxiosError } from 'axios';
import { NGXLogger } from 'ngx-logger';

import { currentProject } from '../../stores/CurrentProject.store';
import { projectsService } from '../gis/projects/projects.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowGuardService {
  constructor(
    private logger: NGXLogger,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      const id = (route.params as Record<string, string>)?.projectId;
      await projectsService.fetchCurrent(Number(id));

      if (currentProject.id) {
        return true;
      }
      void this.router.navigateByUrl('/projects');

      return false;
    } catch (error) {
      const err = error as AxiosError;
      void this.router.navigateByUrl('/projects');
      this.logger.warn('Wrong workflow: empty project', err.message);

      return false;
    }
  }
}
