import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
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
  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private snackBar: MatSnackBar,
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

      this.authService.authenticate(credentials)
          .subscribe((authModel: AuthModel) => {
            this.logger.info('Authenticate success');

            this.authService.authenticated = true;
            this.tokenStorage.saveToken(authModel);

            this.router.navigateByUrl('/workspace');
          }, response => {
            this.logger.error('error: ', response);

            this.authService.authenticated = false;

            let msg = 'Login failed...';
            if (response.error && response.error.error_description) {
              msg = response.error.error_description;
            }

            this.isWrongPassword = true;
            //this.snackBar.open(msg, 'X', {duration: 5000});
          });
    } else {
      alert('Not valid form!');
    }
  }

}
