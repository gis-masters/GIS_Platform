import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

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
    passwords: this.fb.group({
      password: [null, Validators.required],
      password_: [null,[Validators.required]]
    })
    /*password: [null, Validators.required],
    password_: [null,[Validators.required, this.passValidate]]*/

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
}
