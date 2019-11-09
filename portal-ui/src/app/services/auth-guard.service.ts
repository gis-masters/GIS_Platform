import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(): Observable<boolean> | boolean {
    if (!this.authService.authenticated) {
      this.router.navigate(['login']);

      return false;
    } else {
      return true;
    }
  }
}
