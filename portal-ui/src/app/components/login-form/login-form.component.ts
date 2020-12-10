import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { authService, AuthCredentials } from '../../services/auth.service';
import { currentUser } from '../../stores/CurrentUser.store';

@Component({
  selector: 'crg-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @Input() redirectTo: string;
  @Input() noRecovery: boolean;

  busy = false;
  isWrongPassword = false;
  isUserDisabled = false;

  loginForm = this.fb.group({
    username: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    if (currentUser.login) {
      this.goToProjects();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private goToProjects() {
    this.router.navigateByUrl('/projects/default');
  }

  async onSubmit() {
    this.busy = true;
    const credentials: AuthCredentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    if (this.loginForm.valid) {
      this.isWrongPassword = false;
      this.isUserDisabled = false;

      const result = await authService.authenticate(credentials);

      if (result.ok) {
        this.goToProjects();
      } else {
        this.busy = false;
        this.isUserDisabled = result.userDisabled;
        this.isWrongPassword = result.wrongPassword;
      }
    } else {
      alert('Not valid form!');
    }
  }
}
