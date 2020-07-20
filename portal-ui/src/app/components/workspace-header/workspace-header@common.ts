import { OnDestroy, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { UserInfoModel } from '../../services/crg/users.service';
import { localStorageService } from '../../services/local-storage.service';

export class WorkspaceHeader implements OnDestroy, OnInit {

  userModel: UserInfoModel;
  isMapPage: boolean;

  unsubscribe$: Subject<void> = new Subject<void>();

  constructor(protected authService: AuthService,
              protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          const userModel = data.orgInfo;
          if (userModel) {
            this.userModel = userModel;
            localStorageService.saveUserModel(userModel);
          }
        });

    const component: Type<any> | string | null = this.route.component;
    this.isMapPage = component['name'] === 'MapPageComponent';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authService.logout();
  }
}
