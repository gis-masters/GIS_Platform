import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { route } from '../../stores/Route.store';
import { AuthService } from '../../services/auth.service';
import { UserInfoModel } from '../../services/crg/users.service';
import { localStorageService } from '../../services/local-storage.service';

export class WorkspaceHeader implements OnDestroy, OnInit {
  userModel: UserInfoModel;
  isMapPage: boolean;

  unsubscribe$: Subject<void> = new Subject<void>();

  constructor(protected authService: AuthService, protected aRoute: ActivatedRoute) {}

  ngOnInit() {
    this.aRoute.data.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      const userModel = data.orgInfo;
      if (userModel) {
        this.userModel = userModel;
        localStorageService.saveUserModel(userModel);
      }
    });

    this.isMapPage = route.currentPage === 'map';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authService.logout();
  }
}
