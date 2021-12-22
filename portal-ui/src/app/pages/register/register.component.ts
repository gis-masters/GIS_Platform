import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import { authService } from '../../services/auth.service';
import { Toast } from '../../components/Toast/Toast';

@Component({
  selector: 'crg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {
  errorMsg: string;
  registrationForm = this.fb.group(
    {
      company: [null, Validators.required],
      contactPhone: [null, Validators.required],
      lastName: [null, Validators.required],
      firstName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$')]],
      password_: [null, Validators.required]
    },
    {
      validator: this.passwordMatch('password', 'password_')
    }
  );

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private router: Router, private logger: NGXLogger) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async onSubmit(): Promise<void> {
    this.errorMsg = '';

    if (this.registrationForm.valid) {
      try {
        await authService.registration(this.registrationForm.getRawValue());
        this.registrationForm.getRawValue();
        Toast.success('Регистрация прошла успешно');
        void this.router.navigateByUrl('/');
      } catch (error) {
        if ((error as Error)?.message) {
          this.errorMsg = (error as Error).message;
        } else {
          this.logger.error(error);
        }
      }
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
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
