import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { usersService } from './crg/users.service';
import { currentUser } from '../stores/CurrentUser.store';

@Injectable({
  providedIn: 'root'
})
export class OrgAdminGuardService implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    await usersService.fetchCurrent();

    if (!currentUser.userName) {
      this.router.navigate(['login']);
      return false;
    }

    if (currentUser.isAdmin) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
