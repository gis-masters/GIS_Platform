import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {FizLogger} from '../../../services/logger/fiz.logger';
import {LocalStorageService} from '../../../services/local-storage.service';
import {CommunicationService} from '../../../services/communication.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionType, Sidebar, SidebarType} from '../../../services/side-bar-manager.service';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnDestroy, OnInit {

  isInfoSidebarActive = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private authService: AuthService,
              private route: ActivatedRoute,
              private storageService: LocalStorageService,
              private communicationService: CommunicationService,
              private log: FizLogger) {
    this.log.debug('setUp', 'WorkspaceComponent constructor');

    this.communicationService.sidebarManager
        .pipe(
          filter((data: Sidebar) => data.target === SidebarType.INFO),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((data: Sidebar) => {
          switch (data.action) {
            case ActionType.CLOSE: this.isInfoSidebarActive = false; break;
            case ActionType.OPEN: this.isInfoSidebarActive = true;  break;
            case ActionType.SWITCH: this.isInfoSidebarActive = !this.isInfoSidebarActive; break;
            default:
              this.log.warn('infoSidebar', 'Unsupported action type: ', data.action);
          }
        });
  }

  ngOnInit(): void {
    this.route.data
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          const userModel = data['orgInfo'];
          if (userModel) {
            this.log.info('organization', 'userModel = ', userModel);

            this.storageService.saveUserModel(userModel);
          }
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authService.logout();
  }

}
