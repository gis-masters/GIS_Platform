import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WorkflowGuardService implements CanActivate {

  constructor(private logger: NGXLogger,
              private storageService: LocalStorageService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (route.url[0].path === 'data_import' && !this.storageService.getProject()) {
      this.logger.warn('Wrong workflow: empty project');

      this.router.navigateByUrl('/workspace/projects');
      return false;
    } else if (route.url[0].path === 'map' && !this.storageService.getProject()) {
      this.logger.warn('Wrong workflow: empty project');

      this.router.navigateByUrl('/workspace/projects');
      return false;
    }

    return true;
  }
}
