import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { usersService } from './auth/users/users.service';
import { currentUser } from '../stores/CurrentUser.store';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminGuardService {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    await usersService.fetchCurrentUser();

    if (currentUser.isSystemAdmin) {
      void this.router.navigate(['/system-management']);

      return false;
    }

    return true;
  }
}
