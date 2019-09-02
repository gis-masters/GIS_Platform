import {AuthService} from '../../services/auth.service';

export class WorkspaceHeader {
  constructor (protected authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}