import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {StorageKeys} from '../../services/storage-keys';
import {LocalStorageService} from '../../services/local-storage.service';
import {OrganizationService} from '../../services/gis/organization.service';
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
    username: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private organizationService: OrganizationService,
              private storageService: LocalStorageService,
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
            this.tokenStorage.saveAuthModel(authModel);
            this.tokenStorage.saveAccessToken(authModel.access_token);
            this.tokenStorage.saveRefreshToken(authModel.refresh_token);

            this.organizationService.getInfo()
                .subscribe((orgId: any) => {
                  this.storageService.saveByKey(StorageKeys.orgId, orgId);

                  this.router.navigateByUrl('/workspace');
                });
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
