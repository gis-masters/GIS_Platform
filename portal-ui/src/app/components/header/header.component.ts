import { type IReactionDisposer, reaction } from 'mobx';
import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment, type Platform } from '../../services/environment';
import { route } from '../../stores/Route.store';

@Component({
  selector: 'crg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentPage = '';
  reactionDisposer?: IReactionDisposer;
  envPlatform: Platform = 'simf';
  envRegistration = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.envPlatform = environment.platform;
    this.envRegistration = environment.registration === undefined ? true : !!environment.registration;
    this.reactionDisposer = reaction(
      () => route.data.page,
      () => {
        this.currentPage = route.data.page;
      },
      { fireImmediately: true }
    );
  }

  ngOnDestroy() {
    this.reactionDisposer?.();
  }

  how(): void {
    void this.router.navigate(['/about']);
  }

  login(): void {
    void this.router.navigate(['/']);
  }

  register(): void {
    void this.router.navigate(['/register']);
  }
}
