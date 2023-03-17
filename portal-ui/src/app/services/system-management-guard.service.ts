import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { usersService } from './auth/users/users.service';
import { currentUser } from '../stores/CurrentUser.store';

@Injectable({
  providedIn: 'root'
})
export class SystemManagementGuardService implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    await usersService.fetchCurrentUser();

    if (!currentUser.login) {
      void this.router.navigate(['/']);

      return false;
    }

    if (currentUser.isSystemAdmin) {
      return true;
    }

    void this.router.navigate(['/projects']);

    return false;
  }
}
