import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {AuthModel, TokenStorageService} from '../../services/token-storage.service';

@Component({
  selector: 'crg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isWrongPassword = false;
  isUserDisabled = false;

  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private logger: NGXLogger,
              private router: Router) {
    this.authService.validateAuth();
  }

  onSubmit() {
    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    if (this.loginForm.valid) {
      this.isWrongPassword = false;
      this.isUserDisabled = false;

      this.authService.authenticate(credentials)
          .subscribe((authModel: AuthModel) => {
            this.logger.info('Authenticate success');

            this.authService.authenticated = true;
            this.tokenStorage.saveToken(authModel);

            this.router.navigateByUrl('/workspace');
          }, response => {
            this.logger.error('error: ', response);

            this.authService.authenticated = false;

            if (response.error && response.error.error_description === 'User is disabled') {
              this.isUserDisabled = true;
            } else if (response.error.error_description === 'Bad credentials') {
              this.isWrongPassword = true;
            } else {
              this.logger.error('Other error type: ', response.error);
            }
          });
    } else {
      alert('Not valid form!');
    }
  }

}
