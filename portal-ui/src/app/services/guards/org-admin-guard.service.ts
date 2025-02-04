import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { currentUser } from '../../stores/CurrentUser.store';
import { usersService } from '../auth/users/users.service';

@Injectable({
  providedIn: 'root'
})
export class OrgAdminGuardService {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    await usersService.fetchCurrentUser();

    if (!currentUser.login) {
      void this.router.navigate(['/']);

      return false;
    }

    if (currentUser.isAdmin) {
      return true;
    }
    void this.router.navigate(['/']);

    return false;
  }
}
