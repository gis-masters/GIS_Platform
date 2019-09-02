import {Component} from '@angular/core';

import {AuthService} from '../../services/auth.service';

import { WorkspaceHeader } from './workspace-header@common.component';

@Component({
  selector: 'crg-workspace-header',
  templateUrl: './workspace-header@simf.component.html',
  styleUrls: ['./workspace-header@simf.component.scss']
})
export class WorkspaceHeaderComponent extends WorkspaceHeader {
  constructor(protected authService: AuthService) {
    super(authService);
  }
}
