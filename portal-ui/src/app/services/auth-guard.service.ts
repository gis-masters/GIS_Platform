import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { usersService } from './crg/users.service';
import { currentUser } from '../stores/CurrentUser.store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    await usersService.fetchCurrentUser();

    if (!currentUser.login) {
      this.router.navigate(['login']);

      return false;
    } else {
      return true;
    }
  }
}
