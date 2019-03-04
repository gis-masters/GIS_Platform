import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'crg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

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

  constructor(private fb: FormBuilder,
              private router: Router,
              private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.authService
          .registration(this.registrationForm.getRawValue())
          .subscribe(value => {
            this.registrationForm.getRawValue();

            this.snackBar.open('Регистрация прошла успешно', 'X', {duration: 5000});
            this.router.navigateByUrl('/login');
          }, errorResponse => {
            Object.keys(errorResponse.error).forEach(value => {
              this.snackBar.open(errorResponse.error[value][0], 'X', {duration: 5000});
            });
          });
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
