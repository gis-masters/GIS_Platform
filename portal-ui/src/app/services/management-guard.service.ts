import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { localStorageService } from './local-storage.service';
import { BuildInRole } from './util/permissions';

@Injectable({
  providedIn: 'root'
})
export class ManagementGuardService implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | boolean {
    const userInfo = localStorageService.getUserInfo();
    if (!userInfo) {
      this.router.navigate(['login']);
      return false;
    }

    if (userInfo.roles.includes(BuildInRole.ORG_ADMIN) || userInfo.roles.includes(BuildInRole.GLOBAL_ADMIN)) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
