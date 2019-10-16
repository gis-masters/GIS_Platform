import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component, OnDestroy} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'crg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {

  errorMsg: string;
  registrationForm = this.fb.group({
    company: [null, Validators.required],
    contactPhone: [null, Validators.required],
    lastName: [null, Validators.required],
    firstName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$')]],
    password_: [null, Validators.required]
  }, {
    validator: this.passwordMatch('password', 'password_')
  });

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder,
              private router: Router,
              private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    this.errorMsg = '';

    if (this.registrationForm.valid) {
      this.authService.registration(this.registrationForm.getRawValue()).then(
          () => {
            this.registrationForm.getRawValue();

            this.snackBar.open('Регистрация прошла успешно', 'X', {duration: 5000});
            this.router.navigateByUrl('/login');
          },
          errorResponse => {
            if (errorResponse.error.message) {
              this.errorMsg = errorResponse.error.message;
            } else {
              this.logger.error(errorResponse);
            }
          }
      );
    } else {
      alert('Not valid!');
    }
  }

  private passwordMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
