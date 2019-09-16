import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {LocalStorageService} from '../../services/local-storage.service';

import {WorkspaceHeader} from './workspace-header@common';

@Component({
  selector: 'crg-workspace-header',
  templateUrl: './workspace-header@simf.component.html',
  styleUrls: ['./workspace-header@simf.component.scss']
})
export class WorkspaceHeaderComponent extends WorkspaceHeader {

  constructor(protected route: ActivatedRoute,
              protected storageService: LocalStorageService,
              protected authService: AuthService) {
    super(authService, route, storageService);
  }

}
