import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

import {AuthService, AuthCredentials} from '../../services/auth.service';
import {JwtToken, TokenStorageService} from '../../services/token-storage.service';

@Component({
  selector: 'crg-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @Input() redirectTo: string;
  @Input() noRecovery: boolean;

  isWrongPassword = false;
  isUserDisabled = false;

  loginForm = this.fb.group({
    username: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router) { }

  ngOnInit(): void {
    this.authService.validateAuth(this.redirectTo);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    const credentials: AuthCredentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    if (this.loginForm.valid) {
      this.isWrongPassword = false;
      this.isUserDisabled = false;

      this.authService.authenticate(credentials).then(
          (jwtToken: JwtToken) => {
            this.authService.authenticated = true;
            this.tokenStorage.saveToken(jwtToken);
            this.router.navigateByUrl('/projects');
          },
          response => {
            this.authService.authenticated = false;

            if (response.error && response.error.error_description === 'User is disabled') {
              this.isUserDisabled = true;
            } else if (response.error.error_description === 'Bad credentials') {
              this.isWrongPassword = true;
            }
          }
      );
    } else {
      alert('Not valid form!');
    }
  }
}
